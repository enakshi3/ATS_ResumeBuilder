/**
 * Job Model - Job Tracker
 */

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    location: {
        type: String,
        default: ''
    },
    salary: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['saved', 'applied', 'interviewing', 'offer', 'rejected'],
        default: 'saved'
    },
    starred: {
        type: Boolean,
        default: false
    },
    appliedAt: {
        type: Date,
        default: null
    },
    jobUrl: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    },
    jobDescription: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

jobSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Job', jobSchema);
