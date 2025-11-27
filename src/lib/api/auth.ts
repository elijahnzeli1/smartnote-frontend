/**
 * Authentication API methods.
 */
import apiClient from './client';
import { AuthTokens, RegisterData, LoginData, User } from '@/types';

export const authApi = {
    /**
     * Register a new user
     */
    async register(data: RegisterData): Promise<{ user: User; message: string }> {
        const response = await apiClient.post('/auth/register/', data);
        return response.data;
    },

    /**
     * Login user and get tokens
     */
    async login(data: LoginData): Promise<AuthTokens> {
        const response = await apiClient.post('/auth/login/', data);
        const tokens = response.data;

        // Store tokens in localStorage
        if (tokens.access) {
            localStorage.setItem('access_token', tokens.access);
        }
        if (tokens.refresh) {
            localStorage.setItem('refresh_token', tokens.refresh);
        }

        return tokens;
    },

    /**
     * Logout user
     */
    logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    },

    /**
     * Get current user profile
     */
    async getProfile(): Promise<User> {
        const response = await apiClient.get('/auth/profile/');
        return response.data;
    },

    /**
     * Update user profile
     */
    async updateProfile(data: Partial<User>): Promise<User> {
        const response = await apiClient.patch('/auth/profile/', data);
        return response.data;
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem('access_token');
    },
};
