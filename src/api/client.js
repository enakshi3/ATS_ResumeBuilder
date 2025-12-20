/**
 * Saanvi ResumeATS - API Client
 * Centralized API layer for all backend communications
 */

// API Configuration
const API_BASE_URL = 'http://localhost:5002/api';

class ApiClient {
    constructor() {
        this.baseUrl = API_BASE_URL;
        this.token = null;
    }

    setToken(token) {
        this.token = token;
    }

    clearToken() {
        this.token = null;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new ApiError(data.error || 'Request failed', response.status);
            }

            return { success: true, data };
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            // For auth endpoints, throw the actual error - don't use mock data
            if (endpoint.startsWith('/auth')) {
                console.error(`Auth API request failed for ${endpoint}:`, error);
                throw new ApiError(error.message || 'Network error', 0);
            }
            // Network error or other issues - use mock data in development for non-auth endpoints
            console.warn(`API request failed for ${endpoint}, using mock data`);
            return this.getMockResponse(endpoint, options);
        }
    }

    // Mock responses for development
    getMockResponse(endpoint, options) {
        const method = options.method || 'GET';

        // Route to appropriate mock handler
        if (endpoint.startsWith('/auth')) {
            return mockAuthResponses(endpoint, method, options);
        }
        if (endpoint.startsWith('/scans')) {
            return mockScanResponses(endpoint, method, options);
        }
        if (endpoint.startsWith('/resumes')) {
            return mockResumeResponses(endpoint, method, options);
        }
        if (endpoint.startsWith('/jobs')) {
            return mockJobResponses(endpoint, method, options);
        }
        if (endpoint.startsWith('/ai')) {
            return mockAIResponses(endpoint, method, options);
        }
        if (endpoint.startsWith('/user')) {
            return mockUserResponses(endpoint, method, options);
        }

        return { success: false, error: 'Unknown endpoint' };
    }

    // Convenience methods
    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // File upload
    async uploadFile(endpoint, file, additionalData = {}) {
        const formData = new FormData();
        formData.append('file', file);
        Object.entries(additionalData).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                method: 'POST',
                headers,
                body: formData,
            });

            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            // Mock file upload response
            return {
                success: true,
                data: {
                    fileUrl: URL.createObjectURL(file),
                    fileName: file.name,
                    fileSize: file.size,
                }
            };
        }
    }
}

class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }
}

// =====================================================
// MOCK RESPONSES
// =====================================================

function mockAuthResponses(endpoint, method, options) {
    if (endpoint === '/auth/login' && method === 'POST') {
        return {
            success: true,
            data: {
                user: {
                    id: 'user_1',
                    email: 'john.doe@email.com',
                    name: 'John Doe',
                    role: 'member',
                    organizationId: 'org_1'
                },
                token: 'mock_jwt_token_12345',
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            }
        };
    }

    if (endpoint === '/auth/register' && method === 'POST') {
        const body = JSON.parse(options.body);
        return {
            success: true,
            data: {
                user: {
                    id: 'user_new',
                    email: body.email,
                    name: body.name,
                    role: 'owner'
                },
                token: 'mock_jwt_token_new'
            }
        };
    }

    if (endpoint === '/auth/me') {
        return {
            success: true,
            data: {
                id: 'user_1',
                email: 'john.doe@email.com',
                name: 'John Doe',
                avatarUrl: null,
                role: 'member',
                organizationId: 'org_1',
                preferences: {
                    emailNotifications: true,
                    weeklyDigest: true,
                    theme: 'dark'
                }
            }
        };
    }

    return { success: false, error: 'Auth endpoint not found' };
}

function mockScanResponses(endpoint, method, options) {
    if (endpoint === '/scans' && method === 'GET') {
        return {
            success: true,
            data: [
                { id: 'scan_1', jobTitle: 'Senior Frontend Developer', company: 'Google', results: { overallScore: 85 }, status: 'completed', createdAt: '2024-01-15' },
                { id: 'scan_2', jobTitle: 'Product Manager', company: 'Microsoft', results: { overallScore: 72 }, status: 'completed', createdAt: '2024-01-14' },
                { id: 'scan_3', jobTitle: 'UX Designer', company: 'Apple', results: { overallScore: 58 }, status: 'completed', createdAt: '2024-01-12' },
            ]
        };
    }

    if (endpoint === '/scans' && method === 'POST') {
        return {
            success: true,
            data: {
                id: 'scan_new',
                status: 'processing',
                createdAt: new Date().toISOString()
            }
        };
    }

    if (endpoint.match(/\/scans\/[\w-]+$/) && method === 'GET') {
        return {
            success: true,
            data: {
                id: 'scan_1',
                jobTitle: 'Senior Frontend Developer',
                company: 'Google',
                status: 'completed',
                results: {
                    overallScore: 85,
                    scoreCategory: 'excellent',
                    summary: 'Strong resume with good keyword alignment.',
                    keywords: {
                        score: 80,
                        matched: ['React', 'TypeScript', 'JavaScript'],
                        missing: ['GraphQL', 'AWS'],
                        partial: ['Node.js']
                    },
                    formatting: {
                        score: 90,
                        issues: [
                            { type: 'success', text: 'Clean format' },
                            { type: 'success', text: 'Good structure' }
                        ]
                    },
                    improvements: [
                        { priority: 'high', title: 'Add GraphQL', description: 'Include GraphQL experience', impact: '+5 points' }
                    ]
                }
            }
        };
    }

    return { success: false, error: 'Scan endpoint not found' };
}

function mockResumeResponses(endpoint, method, options) {
    if (endpoint === '/resumes' && method === 'GET') {
        return {
            success: true,
            data: [
                { id: 'resume_1', title: 'Main Resume', isDefault: true, createdAt: '2024-01-01' },
                { id: 'resume_2', title: 'Technical Resume', isDefault: false, createdAt: '2024-01-05' },
            ]
        };
    }

    return { success: false, error: 'Resume endpoint not found' };
}

function mockJobResponses(endpoint, method, options) {
    if (endpoint === '/jobs' && method === 'GET') {
        return {
            success: true,
            data: {
                saved: [{ id: 'job_1', company: 'Google', role: 'Frontend Dev', location: 'CA', starred: true }],
                applied: [{ id: 'job_2', company: 'Netflix', role: 'UI Engineer', appliedAt: '2024-01-15' }],
                interviewing: [],
                offer: [],
                rejected: []
            }
        };
    }

    return { success: false, error: 'Job endpoint not found' };
}

function mockAIResponses(endpoint, method, options) {
    if (endpoint === '/ai/analyze' && method === 'POST') {
        // Simulate processing delay
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    success: true,
                    data: {
                        overallScore: Math.floor(Math.random() * 30) + 70,
                        keywords: { matched: ['React', 'JavaScript'], missing: ['AWS'] },
                        suggestions: ['Add more metrics', 'Include leadership examples']
                    }
                });
            }, 1500);
        });
    }

    if (endpoint === '/ai/improve-bullet' && method === 'POST') {
        const body = JSON.parse(options.body);
        return {
            success: true,
            data: {
                original: body.text,
                improved: `Spearheaded ${body.text.toLowerCase()}, resulting in 40% improvement in key metrics and demonstrating strong leadership capabilities.`
            }
        };
    }

    if (endpoint === '/ai/cover-letter' && method === 'POST') {
        return {
            success: true,
            data: {
                coverLetter: `Dear Hiring Manager,\n\nI am writing to express my strong interest in this position...\n\nBest regards,\nJohn Doe`
            }
        };
    }

    return { success: false, error: 'AI endpoint not found' };
}

function mockUserResponses(endpoint, method, options) {
    if (endpoint === '/user/stats') {
        return {
            success: true,
            data: {
                totalScans: 47,
                averageScore: 78,
                jobsTracked: 23,
                resumesCount: 5,
                scansThisMonth: 12
            }
        };
    }

    return { success: false, error: 'User endpoint not found' };
}

// Export singleton instance
export const api = new ApiClient();
export { ApiError };
