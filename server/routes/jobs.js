/**
 * Job Routes - Job Tracker
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const { authMiddleware, optionalAuth } = require('../middleware/auth');

// In-memory storage
const memoryJobs = new Map();

// Try to use MongoDB Job model
let Job;
try {
    Job = require('../models/Job');
} catch (e) {
    Job = null;
}

/**
 * GET /api/jobs
 * Get all tracked jobs organized by status
 */
router.get('/', optionalAuth, async (req, res) => {
    try {
        let jobs = [];

        if (Job && Job.db?.readyState === 1 && req.user) {
            jobs = await Job.find({ userId: req.user.id })
                .sort({ updatedAt: -1 });
        } else {
            // Return demo jobs organized by status
            return res.json({
                saved: [
                    { id: 'job_1', company: 'Google', role: 'Frontend Developer', location: 'Mountain View, CA', starred: true },
                    { id: 'job_2', company: 'Meta', role: 'React Engineer', location: 'Menlo Park, CA', starred: false }
                ],
                applied: [
                    { id: 'job_3', company: 'Netflix', role: 'UI Engineer', appliedAt: new Date(Date.now() - 86400000).toISOString() }
                ],
                interviewing: [
                    { id: 'job_4', company: 'Apple', role: 'Senior Developer', appliedAt: new Date(Date.now() - 604800000).toISOString() }
                ],
                offer: [],
                rejected: []
            });
        }

        // Organize by status
        const organized = {
            saved: jobs.filter(j => j.status === 'saved'),
            applied: jobs.filter(j => j.status === 'applied'),
            interviewing: jobs.filter(j => j.status === 'interviewing'),
            offer: jobs.filter(j => j.status === 'offer'),
            rejected: jobs.filter(j => j.status === 'rejected')
        };

        res.json(organized);
    } catch (err) {
        console.error('Get jobs error:', err);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

/**
 * POST /api/jobs
 * Add a new tracked job
 */
router.post('/', optionalAuth, async (req, res) => {
    try {
        const { company, role, location, salary, status, jobUrl, notes, jobDescription } = req.body;

        if (!company || !role) {
            return res.status(400).json({ error: 'Company and role are required' });
        }

        let job;

        if (Job && Job.db?.readyState === 1 && req.user) {
            job = new Job({
                userId: req.user.id,
                company,
                role,
                location: location || '',
                salary: salary || '',
                status: status || 'saved',
                jobUrl: jobUrl || '',
                notes: notes || '',
                jobDescription: jobDescription || ''
            });
            await job.save();
        } else {
            job = {
                id: uuidv4(),
                company,
                role,
                location: location || '',
                salary: salary || '',
                status: status || 'saved',
                starred: false,
                createdAt: new Date().toISOString()
            };
            memoryJobs.set(job.id, job);
        }

        res.status(201).json(job);
    } catch (err) {
        console.error('Create job error:', err);
        res.status(500).json({ error: 'Failed to create job' });
    }
});

/**
 * PUT /api/jobs/:id
 * Update a tracked job
 */
router.put('/:id', optionalAuth, async (req, res) => {
    try {
        const updates = req.body;

        let job;

        if (Job && Job.db?.readyState === 1) {
            job = await Job.findByIdAndUpdate(req.params.id, updates, { new: true });
        } else {
            job = memoryJobs.get(req.params.id);
            if (job) {
                job = { ...job, ...updates };
                memoryJobs.set(req.params.id, job);
            }
        }

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.json(job);
    } catch (err) {
        console.error('Update job error:', err);
        res.status(500).json({ error: 'Failed to update job' });
    }
});

/**
 * DELETE /api/jobs/:id
 * Remove a tracked job
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        if (Job && Job.db?.readyState === 1) {
            await Job.findByIdAndDelete(req.params.id);
        } else {
            memoryJobs.delete(req.params.id);
        }

        res.json({ success: true });
    } catch (err) {
        console.error('Delete job error:', err);
        res.status(500).json({ error: 'Failed to delete job' });
    }
});

module.exports = router;
