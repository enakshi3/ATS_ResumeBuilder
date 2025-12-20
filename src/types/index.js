/**
 * Saanvi ResumeATS - Data Types
 * Multi-tenant SaaS data model definitions
 */

// =====================================================
// USER & ORGANIZATION
// =====================================================

/**
 * @typedef {Object} User
 * @property {string} id - UUID
 * @property {string} email
 * @property {string} name
 * @property {string} [avatarUrl]
 * @property {string} organizationId - Foreign key to Organization
 * @property {'member' | 'admin' | 'owner'} role
 * @property {UserPreferences} preferences
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 */

/**
 * @typedef {Object} UserPreferences
 * @property {boolean} emailNotifications
 * @property {boolean} weeklyDigest
 * @property {'dark' | 'light' | 'system'} theme
 * @property {string} [timezone]
 */

/**
 * @typedef {Object} Organization
 * @property {string} id - UUID
 * @property {string} name
 * @property {string} slug - URL-safe identifier
 * @property {SubscriptionPlan} plan
 * @property {UsageLimits} limits
 * @property {UsageStats} usage
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {'free' | 'pro' | 'enterprise'} SubscriptionPlan
 */

/**
 * @typedef {Object} UsageLimits
 * @property {number} scansPerMonth
 * @property {number} resumesMax
 * @property {number} jobsMax
 * @property {boolean} aiSuggestions
 * @property {boolean} prioritySupport
 */

/**
 * @typedef {Object} UsageStats
 * @property {number} scansThisMonth
 * @property {number} resumesCount
 * @property {number} jobsCount
 * @property {string} periodStart - ISO timestamp
 */

// =====================================================
// RESUMES
// =====================================================

/**
 * @typedef {Object} Resume
 * @property {string} id - UUID
 * @property {string} userId
 * @property {string} title
 * @property {ResumeContent} content
 * @property {string} [fileUrl] - Original uploaded file
 * @property {string} [rawText] - Extracted text
 * @property {boolean} isDefault
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} ResumeContent
 * @property {PersonalInfo} personalInfo
 * @property {string} [summary]
 * @property {Experience[]} experience
 * @property {Education[]} education
 * @property {SkillCategory[]} skills
 * @property {Project[]} [projects]
 * @property {Certification[]} [certifications]
 */

/**
 * @typedef {Object} PersonalInfo
 * @property {string} name
 * @property {string} email
 * @property {string} [phone]
 * @property {string} [location]
 * @property {string} [linkedin]
 * @property {string} [portfolio]
 */

/**
 * @typedef {Object} Experience
 * @property {string} id
 * @property {string} title
 * @property {string} company
 * @property {string} [location]
 * @property {string} startDate
 * @property {string} [endDate]
 * @property {boolean} current
 * @property {string[]} bullets
 */

/**
 * @typedef {Object} Education
 * @property {string} id
 * @property {string} degree
 * @property {string} school
 * @property {string} [location]
 * @property {string} year
 * @property {string} [gpa]
 */

/**
 * @typedef {Object} SkillCategory
 * @property {string} name
 * @property {string[]} skills
 */

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string[]} technologies
 * @property {string} [url]
 */

/**
 * @typedef {Object} Certification
 * @property {string} id
 * @property {string} name
 * @property {string} issuer
 * @property {string} [date]
 * @property {string} [url]
 */

// =====================================================
// ATS SCANS
// =====================================================

/**
 * @typedef {Object} Scan
 * @property {string} id - UUID
 * @property {string} userId
 * @property {string} [resumeId] - Optional if pasted text
 * @property {string} jobTitle
 * @property {string} company
 * @property {string} jobDescription
 * @property {ScanResults} results
 * @property {'pending' | 'processing' | 'completed' | 'failed'} status
 * @property {string} createdAt
 */

/**
 * @typedef {Object} ScanResults
 * @property {number} overallScore - 0-100
 * @property {'excellent' | 'good' | 'fair' | 'poor'} scoreCategory
 * @property {string} summary
 * @property {KeywordAnalysis} keywords
 * @property {FormattingAnalysis} formatting
 * @property {ExperienceAnalysis} experience
 * @property {Improvement[]} improvements
 */

/**
 * @typedef {Object} KeywordAnalysis
 * @property {number} score
 * @property {string[]} matched
 * @property {string[]} missing
 * @property {string[]} partial
 */

/**
 * @typedef {Object} FormattingAnalysis
 * @property {number} score
 * @property {FormattingIssue[]} issues
 */

/**
 * @typedef {Object} FormattingIssue
 * @property {'success' | 'warning' | 'error'} type
 * @property {string} text
 */

/**
 * @typedef {Object} ExperienceAnalysis
 * @property {number} score
 * @property {string[]} suggestions
 */

/**
 * @typedef {Object} Improvement
 * @property {'high' | 'medium' | 'low'} priority
 * @property {string} title
 * @property {string} description
 * @property {string} impact
 */

// =====================================================
// JOB APPLICATIONS
// =====================================================

/**
 * @typedef {Object} JobApplication
 * @property {string} id - UUID
 * @property {string} userId
 * @property {string} company
 * @property {string} role
 * @property {string} [location]
 * @property {string} [salary]
 * @property {JobStatus} status
 * @property {string} [url]
 * @property {string} [notes]
 * @property {boolean} starred
 * @property {string} [appliedAt]
 * @property {string} [nextStep]
 * @property {Reminder[]} [reminders]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected'} JobStatus
 */

/**
 * @typedef {Object} Reminder
 * @property {string} id
 * @property {string} text
 * @property {string} dueDate
 * @property {boolean} completed
 */

// =====================================================
// AI SERVICES
// =====================================================

/**
 * @typedef {Object} AIRequest
 * @property {'analyze_resume' | 'improve_bullet' | 'generate_cover_letter' | 'generate_questions'} type
 * @property {Object} payload
 */

/**
 * @typedef {Object} AIResponse
 * @property {boolean} success
 * @property {Object} [data]
 * @property {string} [error]
 */

// =====================================================
// API RESPONSES
// =====================================================

/**
 * @template T
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {T} [data]
 * @property {string} [error]
 * @property {Object} [pagination]
 */

/**
 * @typedef {Object} PaginationInfo
 * @property {number} page
 * @property {number} limit
 * @property {number} total
 * @property {number} totalPages
 */

export const PLAN_LIMITS = {
    free: {
        scansPerMonth: 5,
        resumesMax: 2,
        jobsMax: 10,
        aiSuggestions: false,
        prioritySupport: false
    },
    pro: {
        scansPerMonth: 50,
        resumesMax: 10,
        jobsMax: 100,
        aiSuggestions: true,
        prioritySupport: false
    },
    enterprise: {
        scansPerMonth: Infinity,
        resumesMax: Infinity,
        jobsMax: Infinity,
        aiSuggestions: true,
        prioritySupport: true
    }
};

export const SCORE_CATEGORIES = {
    excellent: { min: 80, color: 'success' },
    good: { min: 60, color: 'accent' },
    fair: { min: 40, color: 'warning' },
    poor: { min: 0, color: 'error' }
};

export function getScoreCategory(score) {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
}
