/**
 * Tags API methods
 */
import apiClient from './client';
import { Tag } from '@/types';

export const tagsApi = {
    /**
     * Get all tags for the authenticated user
     */
    async getTags(): Promise<Tag[]> {
        const response = await apiClient.get('/tags/');
        // Backend returns paginated response with results array
        return response.data.results || response.data || [];
    },

    /**
     * Create a new tag
     */
    async createTag(name: string): Promise<Tag> {
        const response = await apiClient.post('/tags/', { name });
        return response.data;
    },

    /**
     * Delete a tag
     */
    async deleteTag(id: number): Promise<void> {
        await apiClient.delete(`/tags/${id}/`);
    },
};
