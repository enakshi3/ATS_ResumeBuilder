/**
 * AI Routes - AI-powered features
 * Rule-based implementation (ready for OpenAI/Anthropic integration)
 */

const express = require('express');
const router = express.Router();

const { optionalAuth } = require('../middleware/auth');

/**
 * POST /api/ai/analyze
 * Analyze resume against job description
 */
router.post('/analyze', optionalAuth, async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;

        if (!resumeText || !jobDescription) {
            return res.status(400).json({ error: 'Resume text and job description are required' });
        }

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 500));

        const resumeWords = resumeText.toLowerCase().split(/\s+/);
        const jdWords = jobDescription.toLowerCase().split(/\s+/);

        // Extract keywords (words > 4 chars)
        const keywords = [...new Set(jdWords.filter(w => w.length > 4))].slice(0, 30);
        const matched = keywords.filter(kw => resumeWords.some(rw => rw.includes(kw)));
        const missing = keywords.filter(kw => !matched.includes(kw)).slice(0, 10);

        const matchRate = matched.length / Math.max(keywords.length, 1);
        const overallScore = Math.min(100, Math.round(matchRate * 100 + 20));

        res.json({
            overallScore,
            keywords: { matched, missing },
            suggestions: [
                'Add quantifiable metrics to your achievements',
                'Include more industry-specific terminology',
                'Ensure your skills section matches job requirements'
            ]
        });
    } catch (err) {
        console.error('AI analyze error:', err);
        res.status(500).json({ error: 'Analysis failed' });
    }
});

/**
 * POST /api/ai/improve-bullet
 * Improve a resume bullet point
 */
router.post('/improve-bullet', optionalAuth, async (req, res) => {
    try {
        const { text, context } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        // Action verbs for improvement
        const actionVerbs = [
            'Spearheaded', 'Orchestrated', 'Engineered', 'Streamlined', 'Pioneered',
            'Accelerated', 'Transformed', 'Optimized', 'Championed', 'Architected'
        ];

        const randomVerb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
        const metrics = ['40%', '3x', '50%', '25%', '60%'];
        const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];

        const improved = `${randomVerb} ${text.toLowerCase().replace(/^(led|managed|worked on|helped|assisted|supported)\s*/i, '')}, resulting in ${randomMetric} improvement in key performance metrics and demonstrating strong leadership capabilities.`;

        res.json({
            original: text,
            improved
        });
    } catch (err) {
        console.error('Improve bullet error:', err);
        res.status(500).json({ error: 'Improvement failed' });
    }
});

/**
 * POST /api/ai/cover-letter
 * Generate a cover letter
 */
router.post('/cover-letter', optionalAuth, async (req, res) => {
    try {
        const { resume, jobDescription, company } = req.body;

        if (!jobDescription) {
            return res.status(400).json({ error: 'Job description is required' });
        }

        const companyName = company || 'your company';

        const coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the position at ${companyName}. After reviewing the job description, I am confident that my skills and experience make me an excellent candidate for this role.

Throughout my career, I have developed a robust skill set that aligns well with the requirements outlined in your posting. I have consistently demonstrated my ability to deliver results, collaborate effectively with cross-functional teams, and adapt to evolving challenges.

What excites me most about this opportunity is the chance to contribute to ${companyName}'s mission while continuing to grow professionally. I am particularly drawn to the innovative work your team is doing and believe I can add significant value.

I would welcome the opportunity to discuss how my background and skills would benefit your team. Thank you for considering my application.

Best regards,
[Your Name]`;

        res.json({ coverLetter });
    } catch (err) {
        console.error('Cover letter error:', err);
        res.status(500).json({ error: 'Cover letter generation failed' });
    }
});

/**
 * POST /api/ai/interview-questions
 * Generate interview questions
 */
router.post('/interview-questions', optionalAuth, async (req, res) => {
    try {
        const { jobDescription, resume } = req.body;

        const questions = [
            {
                category: 'Behavioral',
                questions: [
                    'Tell me about a time when you faced a challenging project deadline. How did you handle it?',
                    'Describe a situation where you had to work with a difficult team member.',
                    'Give an example of when you took initiative to solve a problem.'
                ]
            },
            {
                category: 'Technical',
                questions: [
                    'Walk me through your approach to solving complex technical problems.',
                    'How do you stay updated with the latest industry trends and technologies?',
                    'Describe a project where you had to learn a new technology quickly.'
                ]
            },
            {
                category: 'Role-Specific',
                questions: [
                    'What interests you most about this role?',
                    'How does this position align with your career goals?',
                    'What unique skills would you bring to our team?'
                ]
            }
        ];

        res.json({ questions });
    } catch (err) {
        console.error('Interview questions error:', err);
        res.status(500).json({ error: 'Failed to generate questions' });
    }
});

/**
 * POST /api/ai/extract-keywords
 * Extract keywords from job description
 */
router.post('/extract-keywords', optionalAuth, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const words = text.toLowerCase().split(/\s+/);
        const stopWords = new Set([
            'the', 'and', 'for', 'with', 'will', 'have', 'that', 'this', 'from', 'your',
            'are', 'our', 'you', 'can', 'all', 'been', 'more', 'other', 'about', 'into'
        ]);

        const keywords = [...new Set(words.filter(w =>
            w.length > 4 && !stopWords.has(w)
        ))].slice(0, 25);

        res.json({ keywords });
    } catch (err) {
        console.error('Extract keywords error:', err);
        res.status(500).json({ error: 'Extraction failed' });
    }
});

/**
 * POST /api/ai/generate-summary
 * Generate professional summary
 */
router.post('/generate-summary', optionalAuth, async (req, res) => {
    try {
        const { experience, targetRole } = req.body;

        const role = targetRole || 'professional';

        const summary = `Results-driven ${role} with extensive experience delivering high-impact solutions in fast-paced environments. Proven track record of leveraging technical expertise and strategic thinking to drive business outcomes. Adept at collaborating with cross-functional teams and translating complex requirements into actionable deliverables. Passionate about continuous learning and committed to excellence in every project.`;

        res.json({ summary });
    } catch (err) {
        console.error('Generate summary error:', err);
        res.status(500).json({ error: 'Summary generation failed' });
    }
});

module.exports = router;
