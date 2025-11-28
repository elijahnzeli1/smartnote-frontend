/**
 * Notes Dashboard Page
 */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useNotes } from '@/lib/hooks';
import { NotesList } from '@/components/notes/NotesList';
import { NoteEditor } from '@/components/notes/NoteEditor';
import { Button } from '@/components/ui/Button';
import { Note, CreateNoteData } from '@/types';

export default function NotesPage() {
    const router = useRouter();
    const { user, loading: authLoading, logout } = useAuth();
    const { notes, loading, error, fetchNotes, createNote, updateNote, deleteNote, summarizeNote } = useNotes();

    const [editorOpen, setEditorOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | undefined>();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            fetchNotes();
        }
    }, [user]);

    const handleCreateNote = () => {
        setEditingNote(undefined);
        setEditorOpen(true);
    };

    const handleEditNote = (note: Note) => {
        setEditingNote(note);
        setEditorOpen(true);
    };

    const handleSaveNote = async (data: CreateNoteData) => {
        if (editingNote) {
            await updateNote(editingNote.id, data);
        } else {
            await createNote(data);
        }
    };

    const handleDeleteNote = async (id: number) => {
        if (confirm('Are you sure you want to delete this note?')) {
            await deleteNote(id);
        }
    };

    const handleSummarize = async (id: number) => {
        await summarizeNote(id);
    };

    const handleSearch = async (query: string) => {
        await fetchNotes(query);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Smart Notes
                        </h1>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Welcome, {user.username}
                            </span>
                            <Button variant="ghost" onClick={logout}>
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                            My Notes
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {notes?.length || 0} {notes?.length === 1 ? 'note' : 'notes'}
                        </p>
                    </div>
                    <Button onClick={handleCreateNote}>
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Note
                    </Button>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <NotesList
                    notes={notes}
                    loading={loading}
                    onEdit={handleEditNote}
                    onDelete={handleDeleteNote}
                    onSummarize={handleSummarize}
                    onSearch={handleSearch}
                />
            </main>

            {/* Note Editor Modal */}
            <NoteEditor
                isOpen={editorOpen}
                onClose={() => setEditorOpen(false)}
                onSave={handleSaveNote}
                note={editingNote}
            />
        </div>
    );
}
