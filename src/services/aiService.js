/**
 * AI Service - Handles all AI-powered features
 * Ready for OpenAI/Anthropic API integration
 */

import { api } from '../api/client';

export const aiService = {
    /**
     * Analyze resume against job description for ATS compatibility
     */
    async analyzeResume(resumeText, jobDescription) {
        // In production, this would call OpenAI/Anthropic API
        // For now, uses mock responses
        const response = await api.post('/ai/analyze', {
            resumeText,
            jobDescription
        });
        return response;
    },

    /**
     * Improve a resume bullet point with metrics and action verbs
     */
    async improveBullet(bulletText, context = {}) {
        const response = await api.post('/ai/improve-bullet', {
            text: bulletText,
            context
        });
        return response;
    },

    /**
     * Generate a tailored cover letter
     */
    async generateCoverLetter(resumeContent, jobDescription, companyName) {
        const response = await api.post('/ai/cover-letter', {
            resume: resumeContent,
            jobDescription,
            company: companyName
        });
        return response;
    },

    /**
     * Generate interview questions based on job description
     */
    async generateInterviewQuestions(jobDescription, resumeContent) {
        const response = await api.post('/ai/interview-questions', {
            jobDescription,
            resume: resumeContent
        });
        return response;
    },

    /**
     * Analyze LinkedIn profile and provide suggestions
     */
    async analyzeLinkedIn(profileData) {
        const response = await api.post('/ai/linkedin-analyze', {
            profile: profileData
        });
        return response;
    },

    /**
     * Extract keywords from job description
     */
    async extractKeywords(jobDescription) {
        const response = await api.post('/ai/extract-keywords', {
            text: jobDescription
        });
        return response;
    },

    /**
     * Generate professional summary based on experience
     */
    async generateSummary(experience, targetRole) {
        const response = await api.post('/ai/generate-summary', {
            experience,
            targetRole
        });
        return response;
    }
};

/**
 * Helper to parse resume text from uploaded file
 */
export async function parseResumeFile(file) {
    // In production, this would use a PDF/DOCX parser
    // For now, returns mock parsed content
    return {
        success: true,
        data: {
            rawText: 'Parsed resume content...',
            sections: {
                name: 'John Doe',
                email: 'john@example.com',
                experience: [],
                education: [],
                skills: []
            }
        }
    };
}

/**
 * Calculate ATS score locally (for quick estimates)
 */
export function calculateQuickScore(resumeText, jobDescription) {
    const resumeWords = resumeText.toLowerCase().split(/\s+/);
    const jdWords = jobDescription.toLowerCase().split(/\s+/);

    // Simple keyword matching
    const keywords = jdWords.filter(word =>
        word.length > 4 && !commonWords.includes(word)
    );

    const matched = keywords.filter(kw =>
        resumeWords.some(rw => rw.includes(kw) || kw.includes(rw))
    );

    const matchRate = matched.length / Math.max(keywords.length, 1);
    const score = Math.min(100, Math.round(matchRate * 100 + 20)); // Base score + match rate

    return {
        score,
        matched: [...new Set(matched)],
        missing: keywords.filter(kw => !matched.includes(kw)).slice(0, 10)
    };
}

const commonWords = [
    'the', 'and', 'for', 'with', 'will', 'have', 'that', 'this', 'from', 'your',
    'are', 'our', 'you', 'can', 'all', 'been', 'more', 'other', 'about', 'into',
    'work', 'team', 'years', 'experience', 'ability', 'strong', 'excellent'
];
