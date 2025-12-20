/**
 * Saanvi ResumeATS - App Context
 * Global application state for scans, resumes, jobs, and stats
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

const initialState = {
    // User stats
    stats: {
        totalScans: 0,
        averageScore: 0,
        jobsTracked: 0,
        resumesCount: 0,
        scansThisMonth: 0
    },

    // Resumes
    resumes: [],
    activeResume: null,

    // Scans
    scans: [],
    activeScan: null,

    // Jobs
    jobs: {
        saved: [],
        applied: [],
        interviewing: [],
        offer: [],
        rejected: []
    },

    // UI State
    isLoading: false,
    error: null
};

export function AppProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [state, setState] = useState(initialState);

    // Fetch initial data when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchInitialData();
        }
    }, [isAuthenticated]);

    const fetchInitialData = async () => {
        setState(prev => ({ ...prev, isLoading: true }));

        try {
            const [statsRes, scansRes, resumesRes, jobsRes] = await Promise.all([
                api.get('/user/stats'),
                api.get('/scans'),
                api.get('/resumes'),
                api.get('/jobs')
            ]);

            setState(prev => ({
                ...prev,
                stats: statsRes.success ? statsRes.data : prev.stats,
                scans: scansRes.success ? scansRes.data : [],
                resumes: resumesRes.success ? resumesRes.data : [],
                jobs: jobsRes.success ? jobsRes.data : prev.jobs,
                isLoading: false
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error.message
            }));
        }
    };

    // =====================================================
    // SCANS
    // =====================================================

    const createScan = useCallback(async (resumeData, jobDescription) => {
        setState(prev => ({ ...prev, isLoading: true }));

        try {
            const response = await api.post('/scans', {
                resume: resumeData,
                jobDescription
            });

            if (response.success) {
                // Poll for results or use the immediate response
                const scanId = response.data.id;

                // Simulate getting full results
                const resultsResponse = await api.get(`/scans/${scanId}`);

                if (resultsResponse.success) {
                    setState(prev => ({
                        ...prev,
                        scans: [resultsResponse.data, ...prev.scans],
                        activeScan: resultsResponse.data,
                        stats: {
                            ...prev.stats,
                            totalScans: prev.stats.totalScans + 1,
                            scansThisMonth: prev.stats.scansThisMonth + 1
                        },
                        isLoading: false
                    }));
                    return { success: true, data: resultsResponse.data };
                }
            }

            return { success: false, error: 'Failed to create scan' };
        } catch (error) {
            setState(prev => ({ ...prev, isLoading: false, error: error.message }));
            return { success: false, error: error.message };
        }
    }, []);

    const getScan = useCallback(async (scanId) => {
        try {
            const response = await api.get(`/scans/${scanId}`);
            if (response.success) {
                setState(prev => ({ ...prev, activeScan: response.data }));
                return { success: true, data: response.data };
            }
            return { success: false, error: 'Scan not found' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }, []);

    // =====================================================
    // RESUMES
    // =====================================================

    const saveResume = useCallback(async (resumeData) => {
        try {
            const response = resumeData.id
                ? await api.put(`/resumes/${resumeData.id}`, resumeData)
                : await api.post('/resumes', resumeData);

            if (response.success) {
                setState(prev => {
                    const resumes = resumeData.id
                        ? prev.resumes.map(r => r.id === resumeData.id ? response.data : r)
                        : [...prev.resumes, response.data];

                    return {
                        ...prev,
                        resumes,
                        activeResume: response.data
                    };
                });
                return { success: true, data: response.data };
            }
            return { success: false, error: response.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }, []);

    const deleteResume = useCallback(async (resumeId) => {
        try {
            const response = await api.delete(`/resumes/${resumeId}`);
            if (response.success) {
                setState(prev => ({
                    ...prev,
                    resumes: prev.resumes.filter(r => r.id !== resumeId),
                    activeResume: prev.activeResume?.id === resumeId ? null : prev.activeResume
                }));
                return { success: true };
            }
            return { success: false, error: response.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }, []);

    // =====================================================
    // JOBS
    // =====================================================

    const addJob = useCallback(async (jobData) => {
        try {
            const response = await api.post('/jobs', jobData);
            if (response.success) {
                const status = jobData.status || 'saved';
                setState(prev => ({
                    ...prev,
                    jobs: {
                        ...prev.jobs,
                        [status]: [...prev.jobs[status], response.data]
                    },
                    stats: {
                        ...prev.stats,
                        jobsTracked: prev.stats.jobsTracked + 1
                    }
                }));
                return { success: true, data: response.data };
            }
            return { success: false, error: response.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }, []);

    const updateJob = useCallback(async (jobId, updates) => {
        try {
            const response = await api.put(`/jobs/${jobId}`, updates);
            if (response.success) {
                setState(prev => {
                    // Find which column the job is in
                    const newJobs = { ...prev.jobs };
                    let found = false;

                    for (const status of Object.keys(newJobs)) {
                        const index = newJobs[status].findIndex(j => j.id === jobId);
                        if (index !== -1) {
                            // If status changed, move to new column
                            if (updates.status && updates.status !== status) {
                                const [job] = newJobs[status].splice(index, 1);
                                newJobs[updates.status].push({ ...job, ...updates });
                            } else {
                                newJobs[status][index] = { ...newJobs[status][index], ...updates };
                            }
                            found = true;
                            break;
                        }
                    }

                    return { ...prev, jobs: newJobs };
                });
                return { success: true };
            }
            return { success: false, error: response.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }, []);

    const deleteJob = useCallback(async (jobId, status) => {
        try {
            const response = await api.delete(`/jobs/${jobId}`);
            if (response.success) {
                setState(prev => ({
                    ...prev,
                    jobs: {
                        ...prev.jobs,
                        [status]: prev.jobs[status].filter(j => j.id !== jobId)
                    }
                }));
                return { success: true };
            }
            return { success: false, error: response.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }, []);

    const moveJob = useCallback((jobId, fromStatus, toStatus) => {
        setState(prev => {
            const newJobs = { ...prev.jobs };
            const jobIndex = newJobs[fromStatus].findIndex(j => j.id === jobId);

            if (jobIndex !== -1) {
                const [job] = newJobs[fromStatus].splice(jobIndex, 1);
                job.status = toStatus;
                if (toStatus === 'applied' && !job.appliedAt) {
                    job.appliedAt = new Date().toISOString().split('T')[0];
                }
                newJobs[toStatus].push(job);
            }

            return { ...prev, jobs: newJobs };
        });
    }, []);

    // =====================================================
    // AI SERVICES
    // =====================================================

    const improveText = useCallback(async (text, type = 'bullet') => {
        try {
            const response = await api.post('/ai/improve-bullet', { text, type });
            if (response.success) {
                return { success: true, data: response.data };
            }
            return { success: false, error: response.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }, []);

    const generateCoverLetter = useCallback(async (resumeId, jobDescription) => {
        try {
            const response = await api.post('/ai/cover-letter', { resumeId, jobDescription });
            if (response.success) {
                return { success: true, data: response.data };
            }
            return { success: false, error: response.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }, []);

    const value = {
        ...state,

        // Actions
        refreshData: fetchInitialData,

        // Scans
        createScan,
        getScan,

        // Resumes
        saveResume,
        deleteResume,
        setActiveResume: (resume) => setState(prev => ({ ...prev, activeResume: resume })),

        // Jobs
        addJob,
        updateJob,
        deleteJob,
        moveJob,

        // AI
        improveText,
        generateCoverLetter,

        // Error handling
        clearError: () => setState(prev => ({ ...prev, error: null }))
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}

export default AppContext;
