/**
 * API client configuration and instance.
 */
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Only access localStorage on client side
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('access_token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 405 Method Not Allowed - likely auth issue
        if (error.response?.status === 405) {
            console.error('405 Method Not Allowed - Check authentication token');
            if (typeof window !== 'undefined') {
                const hasToken = !!localStorage.getItem('access_token');
                if (!hasToken) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                    return Promise.reject(new Error('Authentication required. Please log in.'));
                }
            }
        }

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Only try refresh on client side
            if (typeof window !== 'undefined') {
                try {
                    const refreshToken = localStorage.getItem('refresh_token');
                    if (refreshToken) {
                        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
                            refresh: refreshToken,
                        });

                        const { access } = response.data;
                        localStorage.setItem('access_token', access);

                        // Retry the original request with new token
                        originalRequest.headers.Authorization = `Bearer ${access}`;
                        return apiClient(originalRequest);
                    }
                } catch (refreshError) {
                    // Refresh failed, clear tokens and redirect to login
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
