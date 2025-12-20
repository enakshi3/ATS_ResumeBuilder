/**
 * Scan Routes - Resume ATS Scanning
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const { authMiddleware, optionalAuth } = require('../middleware/auth');

// In-memory storage for scans (fallback)
const memoryScans = new Map();

// Try to use MongoDB Scan model
let Scan;
try {
    Scan = require('../models/Scan');
} catch (e) {
    Scan = null;
}

/**
 * Analyze resume text against job description
 * Returns ATS score and analysis
 */
function analyzeResume(resumeText, jobDescription) {
    const resumeWords = resumeText.toLowerCase().split(/\s+/);
    const jdWords = jobDescription.toLowerCase().split(/\s+/);

    // Common words to ignore
    const stopWords = new Set([
        'the', 'and', 'for', 'with', 'will', 'have', 'that', 'this', 'from', 'your',
        'are', 'our', 'you', 'can', 'all', 'been', 'more', 'other', 'about', 'into',
        'work', 'team', 'years', 'experience', 'ability', 'strong', 'excellent', 'looking'
    ]);

    // Extract meaningful keywords from JD
    const jdKeywords = [...new Set(jdWords.filter(w =>
        w.length > 3 && !stopWords.has(w)
    ))];

    // Find matches
    const matched = [];
    const missing = [];
    const partial = [];

    jdKeywords.forEach(keyword => {
        const exactMatch = resumeWords.some(w => w === keyword);
        const partialMatch = resumeWords.some(w => w.includes(keyword) || keyword.includes(w));

        if (exactMatch) {
            matched.push(keyword);
        } else if (partialMatch) {
            partial.push(keyword);
        } else {
            missing.push(keyword);
        }
    });

    // Calculate scores
    const keywordScore = Math.round((matched.length + partial.length * 0.5) / Math.max(jdKeywords.length, 1) * 100);

    // Formatting checks
    const formattingIssues = [];
    if (resumeText.length < 500) {
        formattingIssues.push({ type: 'warning', text: 'Resume may be too short' });
    }
    if (resumeText.length > 5000) {
        formattingIssues.push({ type: 'warning', text: 'Resume may be too long' });
    }
    if (!/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText)) {
        formattingIssues.push({ type: 'warning', text: 'Phone number not detected' });
    }
    if (!/@/.test(resumeText)) {
        formattingIssues.push({ type: 'warning', text: 'Email not detected' });
    } else {
        formattingIssues.push({ type: 'success', text: 'Contact information present' });
    }

    const formattingScore = Math.max(0, 100 - formattingIssues.filter(i => i.type === 'warning').length * 15);

    // Overall score
    const overallScore = Math.round(keywordScore * 0.7 + formattingScore * 0.3);

    // Score category
    let scoreCategory = 'needs-work';
    if (overallScore >= 85) scoreCategory = 'excellent';
    else if (overallScore >= 70) scoreCategory = 'good';
    else if (overallScore >= 50) scoreCategory = 'fair';

    // Generate improvements
    const improvements = [];
    if (missing.length > 0) {
        improvements.push({
            priority: 'high',
            title: 'Add missing keywords',
            description: `Include these keywords: ${missing.slice(0, 5).join(', ')}`,
            impact: '+10-15 points'
        });
    }
    if (formattingIssues.some(i => i.type === 'warning')) {
        improvements.push({
            priority: 'medium',
            title: 'Fix formatting issues',
            description: 'Address the formatting warnings to improve ATS readability',
            impact: '+5-10 points'
        });
    }

    return {
        overallScore,
        scoreCategory,
        summary: `Your resume has a ${overallScore}% match with this job description. ${matched.length} keywords matched, ${missing.length} missing.`,
        keywords: {
            score: keywordScore,
            matched: matched.slice(0, 20),
            missing: missing.slice(0, 15),
            partial: partial.slice(0, 10)
        },
        formatting: {
            score: formattingScore,
            issues: formattingIssues
        },
        improvements
    };
}

/**
 * GET /api/scans
 * List all scans for the current user
 */
router.get('/', optionalAuth, async (req, res) => {
    try {
        let scans = [];

        if (Scan && Scan.db?.readyState === 1) {
            // MongoDB connected - fetch real data
            if (req.user) {
                scans = await Scan.find({ userId: req.user.id })
                    .sort({ createdAt: -1 })
                    .limit(50);
            } else {
                // No user auth - return all recent scans (for demo/testing)
                scans = await Scan.find()
                    .sort({ createdAt: -1 })
                    .limit(50);
            }
        } else {
            // In-memory fallback
            scans = Array.from(memoryScans.values());
        }

        res.json(scans);
    } catch (err) {
        console.error('Get scans error:', err);
        res.status(500).json({ error: 'Failed to fetch scans' });
    }
});

/**
 * POST /api/scans
 * Create a new resume scan
 */
router.post('/', optionalAuth, async (req, res) => {
    try {
        const { resumeText, jobDescription, jobTitle, company } = req.body;

        if (!resumeText || !jobDescription) {
            return res.status(400).json({ error: 'Resume text and job description are required' });
        }

        // Perform analysis
        const results = analyzeResume(resumeText, jobDescription);

        let scan;

        if (Scan && Scan.db?.readyState === 1) {
            // Save to MongoDB - use user ID if available, otherwise use a default guest ID
            const mongoose = require('mongoose');
            const userId = req.user?.id || new mongoose.Types.ObjectId();

            scan = new Scan({
                userId,
                jobTitle: jobTitle || 'Untitled Position',
                company: company || '',
                jobDescription,
                resumeText,
                status: 'completed',
                results
            });
            await scan.save();
        } else {
            // In-memory mode
            scan = {
                id: uuidv4(),
                jobTitle: jobTitle || 'Untitled Position',
                company: company || '',
                status: 'completed',
                results,
                createdAt: new Date().toISOString()
            };
            memoryScans.set(scan.id, scan);
        }

        res.status(201).json(scan);
    } catch (err) {
        console.error('Create scan error:', err);
        res.status(500).json({ error: 'Failed to create scan' });
    }
});

/**
 * GET /api/scans/:id
 * Get a specific scan by ID
 */
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        let scan;

        if (Scan && Scan.db?.readyState === 1) {
            scan = await Scan.findById(req.params.id);
        } else {
            scan = memoryScans.get(req.params.id);
        }

        if (!scan) {
            // Return demo scan
            scan = {
                id: req.params.id,
                jobTitle: 'Senior Frontend Developer',
                company: 'Tech Company',
                status: 'completed',
                results: {
                    overallScore: 78,
                    scoreCategory: 'good',
                    summary: 'Good resume with solid keyword alignment.',
                    keywords: {
                        score: 75,
                        matched: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
                        missing: ['GraphQL', 'AWS', 'Docker'],
                        partial: ['Node.js', 'REST']
                    },
                    formatting: {
                        score: 85,
                        issues: [
                            { type: 'success', text: 'Contact information present' },
                            { type: 'success', text: 'Clean format detected' }
                        ]
                    },
                    improvements: [
                        { priority: 'high', title: 'Add cloud experience', description: 'Include AWS or cloud platform experience', impact: '+8 points' }
                    ]
                },
                createdAt: new Date().toISOString()
            };
        }

        res.json(scan);
    } catch (err) {
        console.error('Get scan error:', err);
        res.status(500).json({ error: 'Failed to fetch scan' });
    }
});

module.exports = router;
