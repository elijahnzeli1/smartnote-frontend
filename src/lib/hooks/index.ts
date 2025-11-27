/**
 * Custom React hooks for authentication and notes.
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../api/auth';
import { notesApi } from '../api/notes';
import { User, Note, LoginData, RegisterData, CreateNoteData } from '@/types';

/**
 * Hook for authentication state and actions
 */
export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check if user is authenticated on mount
        const checkAuth = async () => {
            if (authApi.isAuthenticated()) {
                try {
                    const profile = await authApi.getProfile();
                    setUser(profile);
                } catch (error) {
                    // Token expired or invalid
                    authApi.logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (data: LoginData) => {
        const tokens = await authApi.login(data);
        setUser(tokens.user);
        return tokens;
    };

    const register = async (data: RegisterData) => {
        const result = await authApi.register(data);
        return result;
    };

    const logout = () => {
        authApi.logout();
        setUser(null);
        router.push('/login');
    };

    return {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };
}

/**
 * Hook for managing notes
 */
export function useNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNotes = async (search?: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await notesApi.getNotes(search);
            setNotes(response.results);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch notes');
        } finally {
            setLoading(false);
        }
    };

    const createNote = async (data: CreateNoteData) => {
        setError(null);
        try {
            const newNote = await notesApi.createNote(data);
            setNotes((prev) => [newNote, ...prev]);
            return newNote;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create note');
            throw err;
        }
    };

    const updateNote = async (id: number, data: Partial<Note>) => {
        setError(null);
        try {
            const updatedNote = await notesApi.updateNote(id, data);
            setNotes((prev) =>
                prev.map((note) => (note.id === id ? updatedNote : note))
            );
            return updatedNote;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update note');
            throw err;
        }
    };

    const deleteNote = async (id: number) => {
        setError(null);
        try {
            await notesApi.deleteNote(id);
            setNotes((prev) => prev.filter((note) => note.id !== id));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete note');
            throw err;
        }
    };

    const summarizeNote = async (id: number) => {
        setError(null);
        try {
            const response = await notesApi.summarizeNote(id);
            // Update the note with the new summary
            setNotes((prev) =>
                prev.map((note) =>
                    note.id === id ? { ...note, summary: response.summary } : note
                )
            );
            return response;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to generate summary');
            throw err;
        }
    };

    return {
        notes,
        loading,
        error,
        fetchNotes,
        createNote,
        updateNote,
        deleteNote,
        summarizeNote,
    };
}
