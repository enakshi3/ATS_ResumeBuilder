/**
 * Scan Model - Resume ATS Scan Results
 */

const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    company: {
        type: String,
        default: ''
    },
    jobDescription: {
        type: String,
        required: true
    },
    resumeText: {
        type: String,
        required: true
    },
    resumeFileName: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['processing', 'completed', 'failed'],
        default: 'processing'
    },
    results: {
        overallScore: { type: Number, default: 0 },
        scoreCategory: { type: String, default: 'needs-work' },
        summary: { type: String, default: '' },
        keywords: {
            score: { type: Number, default: 0 },
            matched: [String],
            missing: [String],
            partial: [String]
        },
        formatting: {
            score: { type: Number, default: 0 },
            issues: [{
                type: { type: String },
                text: String
            }]
        },
        improvements: [{
            priority: String,
            title: String,
            description: String,
            impact: String
        }]
    }
}, {
    timestamps: true
});

// Index for user queries
scanSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Scan', scanSchema);
