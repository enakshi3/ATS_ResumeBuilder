/**
 * Resume Model
 */

const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        default: 'Untitled Resume'
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    content: {
        personalInfo: {
            fullName: String,
            email: String,
            phone: String,
            location: String,
            linkedin: String,
            website: String
        },
        summary: String,
        experience: [{
            company: String,
            position: String,
            location: String,
            startDate: String,
            endDate: String,
            current: Boolean,
            bullets: [String]
        }],
        education: [{
            school: String,
            degree: String,
            field: String,
            graduationDate: String,
            gpa: String
        }],
        skills: [String],
        certifications: [{
            name: String,
            issuer: String,
            date: String
        }],
        projects: [{
            name: String,
            description: String,
            technologies: [String],
            link: String
        }]
    },
    rawText: {
        type: String,
        default: ''
    },
    fileUrl: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

resumeSchema.index({ userId: 1 });

module.exports = mongoose.model('Resume', resumeSchema);
