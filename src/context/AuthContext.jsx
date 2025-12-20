/**
 * Saanvi ResumeATS - Authentication Context
 * Handles user authentication state across the app
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('auth_user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(!!user);

    /* =========================
       Restore Session on Load
    ========================= */

    useEffect(() => {
        const token = localStorage.getItem('auth_token');

        if (token) {
            api.setToken(token);

            // If user already restored from storage, skip refetch
            if (user) {
                setIsAuthenticated(true);
                setIsLoading(false);
            } else {
                fetchCurrentUser();
            }
        } else {
            setIsLoading(false);
        }
        // eslint-disable-next-line
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const response = await api.get('/auth/me');
            if (response.success) {
                setUser(response.data);
                localStorage.setItem('auth_user', JSON.stringify(response.data));
                setIsAuthenticated(true);
            } else {
                logout();
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    /* =========================
       Login
    ========================= */

    const login = useCallback(async (email, password) => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });

            if (response.success) {
                const { user, token } = response.data;

                localStorage.setItem('auth_token', token);
                localStorage.setItem('auth_user', JSON.stringify(user));

                api.setToken(token);
                setUser(user);
                setIsAuthenticated(true);

                return { success: true };
            }

            return { success: false, error: response.error };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    }, []);

    /* =========================
       Register
    ========================= */

    const register = useCallback(async (name, email, password) => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/register', {
                name,
                email,
                password
            });

            if (response.success) {
                const { user, token } = response.data;

                localStorage.setItem('auth_token', token);
                localStorage.setItem('auth_user', JSON.stringify(user));

                api.setToken(token);
                setUser(user);
                setIsAuthenticated(true);

                return { success: true };
            }

            return { success: false, error: response.error };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    }, []);

    /* =========================
       Logout
    ========================= */

    const logout = useCallback(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');

        api.clearToken();
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
    }, []);

    /* =========================
       Update User Profile (IMPORTANT)
    ========================= */

    const updateUser = useCallback(async (updates) => {
        try {
            const response = await api.put('/user/profile', updates);

            if (response.success) {
                setUser(prev => {
                    const updatedUser = { ...prev, ...response.data };
                    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
                    return updatedUser;
                });

                return { success: true };
            }

            return { success: false, error: response.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }, []);

    /* =========================
       Update Preferences
    ========================= */

    const updatePreferences = useCallback(async (preferences) => {
        try {
            const response = await api.put('/user/preferences', preferences);

            if (response.success) {
                setUser(prev => {
                    const updatedUser = {
                        ...prev,
                        preferences: {
                            ...prev.preferences,
                            ...preferences
                        }
                    };
                    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
                    return updatedUser;
                });

                return { success: true };
            }

            return { success: false, error: response.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }, []);

    /* =========================
       Context Value
    ========================= */

    const value = {
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
        updatePreferences
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
