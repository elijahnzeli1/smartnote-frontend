/**
 * Notes API methods.
 */
import apiClient from './client';
import { Note, CreateNoteData, UpdateNoteData, SummaryResponse } from '@/types';

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
    async getNotes(search?: string): Promise<NotesListResponse> {
        const params = search ? { search } : {};
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
};
