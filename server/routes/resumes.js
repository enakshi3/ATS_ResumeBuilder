/**
 * Resume Routes - Resume Management
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const { authMiddleware, optionalAuth } = require('../middleware/auth');

// In-memory storage
const memoryResumes = new Map();

// Try to use MongoDB Resume model
let Resume;
try {
    Resume = require('../models/Resume');
} catch (e) {
    Resume = null;
}

/**
 * GET /api/resumes
 * List all resumes for the current user
 */
router.get('/', optionalAuth, async (req, res) => {
    try {
        let resumes = [];

        if (Resume && Resume.db?.readyState === 1 && req.user) {
            resumes = await Resume.find({ userId: req.user.id })
                .sort({ isDefault: -1, updatedAt: -1 });
        } else {
            // Return demo resumes
            resumes = [
                { id: 'resume_1', title: 'Main Resume', isDefault: true, createdAt: new Date().toISOString() },
                { id: 'resume_2', title: 'Technical Resume', isDefault: false, createdAt: new Date(Date.now() - 86400000).toISOString() }
            ];
        }

        res.json(resumes);
    } catch (err) {
        console.error('Get resumes error:', err);
        res.status(500).json({ error: 'Failed to fetch resumes' });
    }
});

/**
 * POST /api/resumes
 * Create a new resume
 */
router.post('/', optionalAuth, async (req, res) => {
    try {
        const { title, content, rawText } = req.body;

        let resume;

        if (Resume && Resume.db?.readyState === 1 && req.user) {
            resume = new Resume({
                userId: req.user.id,
                title: title || 'Untitled Resume',
                content: content || {},
                rawText: rawText || ''
            });
            await resume.save();
        } else {
            resume = {
                id: uuidv4(),
                title: title || 'Untitled Resume',
                content: content || {},
                rawText: rawText || '',
                isDefault: false,
                createdAt: new Date().toISOString()
            };
            memoryResumes.set(resume.id, resume);
        }

        res.status(201).json(resume);
    } catch (err) {
        console.error('Create resume error:', err);
        res.status(500).json({ error: 'Failed to create resume' });
    }
});

/**
 * GET /api/resumes/:id
 * Get a specific resume
 */
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        let resume;

        if (Resume && Resume.db?.readyState === 1) {
            resume = await Resume.findById(req.params.id);
        } else {
            resume = memoryResumes.get(req.params.id);
        }

        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        res.json(resume);
    } catch (err) {
        console.error('Get resume error:', err);
        res.status(500).json({ error: 'Failed to fetch resume' });
    }
});

/**
 * PUT /api/resumes/:id
 * Update a resume
 */
router.put('/:id', optionalAuth, async (req, res) => {
    try {
        const { title, content, rawText, isDefault } = req.body;

        let resume;

        if (Resume && Resume.db?.readyState === 1) {
            resume = await Resume.findByIdAndUpdate(
                req.params.id,
                { title, content, rawText, isDefault },
                { new: true }
            );
        } else {
            resume = memoryResumes.get(req.params.id);
            if (resume) {
                resume = { ...resume, title, content, rawText, isDefault };
                memoryResumes.set(req.params.id, resume);
            }
        }

        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        res.json(resume);
    } catch (err) {
        console.error('Update resume error:', err);
        res.status(500).json({ error: 'Failed to update resume' });
    }
});

/**
 * DELETE /api/resumes/:id
 * Delete a resume
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        if (Resume && Resume.db?.readyState === 1) {
            await Resume.findByIdAndDelete(req.params.id);
        } else {
            memoryResumes.delete(req.params.id);
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Delete resume error:', err);
        res.status(500).json({ error: 'Failed to delete resume' });
    }
});

module.exports = router;
