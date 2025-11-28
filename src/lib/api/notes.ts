/**
 * Notes API methods.
 */
import apiClient from './client';
import { Note, CreateNoteData, UpdateNoteData, SummaryResponse, Tag, ExportFormat } from '@/types';

interface NotesListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Note[];
}

export const notesApi = {
    /**
     * Get all notes for the authenticated user
     */
    async getNotes(search?: string, tagId?: number): Promise<NotesListResponse> {
        const params: Record<string, string | number> = {};
        if (search) params.search = search;
        if (tagId) params.tag = tagId;
        const response = await apiClient.get('/notes/', { params });
        return response.data;
    },

    /**
     * Get a single note by ID
     */
    async getNote(id: number): Promise<Note> {
        const response = await apiClient.get(`/notes/${id}/`);
        return response.data;
    },

    /**
     * Create a new note
     */
    async createNote(data: CreateNoteData): Promise<Note> {
        const response = await apiClient.post('/notes/', data);
        return response.data;
    },

    /**
     * Update a note
     */
    async updateNote(id: number, data: UpdateNoteData): Promise<Note> {
        const response = await apiClient.patch(`/notes/${id}/`, data);
        return response.data;
    },

    /**
     * Delete a note
     */
    async deleteNote(id: number): Promise<void> {
        await apiClient.delete(`/notes/${id}/`);
    },

    /**
     * Generate or regenerate summary for a note
     */
    async summarizeNote(id: number): Promise<SummaryResponse> {
        const response = await apiClient.post(`/notes/${id}/summarize/`);
        return response.data;
    },

    /**
     * Export notes in specified format
     */
    async exportNotes(format: ExportFormat = 'json', search?: string, tagId?: number): Promise<Blob> {
        const params: Record<string, string | number> = { format };
        if (search) params.search = search;
        if (tagId) params.tag = tagId;
        
        const response = await apiClient.get('/notes/export/', { 
            params,
            responseType: 'blob'
        });
        return response.data;
    },

    /**
     * Get all tags for the authenticated user
     */
    async getTags(): Promise<Tag[]> {
        const response = await apiClient.get('/tags/');
        return response.data;
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

