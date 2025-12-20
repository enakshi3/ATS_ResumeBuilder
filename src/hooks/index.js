/**
 * Custom hooks for data fetching and state management
 */

import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

/**
 * Hook for fetching data with loading and error states
 * @param {string} endpoint - API endpoint to fetch
 * @param {Object} options - Options including dependencies and skip
 */
export function useFetch(endpoint, options = {}) {
    const { deps = [], skip = false, initialData = null } = options;

    const [data, setData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(!skip);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (skip) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await api.get(endpoint);
            if (response.success) {
                setData(response.data);
            } else {
                setError(response.error);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [endpoint, skip]);

    useEffect(() => {
        fetchData();
    }, [fetchData, ...deps]);

    return { data, isLoading, error, refetch: fetchData };
}

/**
 * Hook for mutations (POST, PUT, DELETE)
 */
export function useMutation(endpoint, method = 'POST') {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const mutate = useCallback(async (body) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.request(endpoint, {
                method,
                body: JSON.stringify(body)
            });

            setIsLoading(false);
            return response;
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
            return { success: false, error: err.message };
        }
    }, [endpoint, method]);

    return { mutate, isLoading, error };
}

/**
 * Hook for user statistics
 */
export function useUserStats() {
    const { data: stats, isLoading, error, refetch } = useFetch('/user/stats', {
        initialData: {
            totalScans: 0,
            averageScore: 0,
            jobsTracked: 0,
            resumesCount: 0,
            scansThisMonth: 0
        }
    });

    return { stats, isLoading, error, refetch };
}

/**
 * Hook for scan history
 */
export function useScanHistory() {
    const { data: scans, isLoading, error, refetch } = useFetch('/scans', {
        initialData: []
    });

    return { scans, isLoading, error, refetch };
}

/**
 * Hook for single scan details
 */
export function useScan(scanId) {
    const { data: scan, isLoading, error, refetch } = useFetch(
        `/scans/${scanId}`,
        { skip: !scanId }
    );

    return { scan, isLoading, error, refetch };
}

/**
 * Hook for resumes
 */
export function useResumes() {
    const { data: resumes, isLoading, error, refetch } = useFetch('/resumes', {
        initialData: []
    });

    return { resumes, isLoading, error, refetch };
}

/**
 * Hook for job applications
 */
export function useJobs() {
    const { data: jobs, isLoading, error, refetch } = useFetch('/jobs', {
        initialData: {
            saved: [],
            applied: [],
            interviewing: [],
            offer: [],
            rejected: []
        }
    });

    const totalJobs = Object.values(jobs).flat().length;
    const activeJobs = (jobs.interviewing?.length || 0) + (jobs.offer?.length || 0);

    return { jobs, totalJobs, activeJobs, isLoading, error, refetch };
}

/**
 * Hook for AI features
 */
export function useAI() {
    const [isProcessing, setIsProcessing] = useState(false);

    const analyzeResume = useCallback(async (resumeText, jobDescription) => {
        setIsProcessing(true);
        try {
            const response = await api.post('/ai/analyze', { resumeText, jobDescription });
            setIsProcessing(false);
            return response;
        } catch (error) {
            setIsProcessing(false);
            return { success: false, error: error.message };
        }
    }, []);

    const improveBullet = useCallback(async (text) => {
        setIsProcessing(true);
        try {
            const response = await api.post('/ai/improve-bullet', { text });
            setIsProcessing(false);
            return response;
        } catch (error) {
            setIsProcessing(false);
            return { success: false, error: error.message };
        }
    }, []);

    const generateCoverLetter = useCallback(async (resumeId, jobDescription) => {
        setIsProcessing(true);
        try {
            const response = await api.post('/ai/cover-letter', { resumeId, jobDescription });
            setIsProcessing(false);
            return response;
        } catch (error) {
            setIsProcessing(false);
            return { success: false, error: error.message };
        }
    }, []);

    const generateInterviewQuestions = useCallback(async (jobDescription) => {
        setIsProcessing(true);
        try {
            const response = await api.post('/ai/interview-questions', { jobDescription });
            setIsProcessing(false);
            return response;
        } catch (error) {
            setIsProcessing(false);
            return { success: false, error: error.message };
        }
    }, []);

    return {
        isProcessing,
        analyzeResume,
        improveBullet,
        generateCoverLetter,
        generateInterviewQuestions
    };
}

/**
 * Hook for local storage persistence
 */
export function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            return initialValue;
        }
    });

    const setValue = useCallback((value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }, [key, storedValue]);

    return [storedValue, setValue];
}

/**
 * Hook for debounced value
 */
export function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Hook for detecting clicks outside element
 */
export function useClickOutside(ref, handler) {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
}
