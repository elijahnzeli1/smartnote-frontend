/**
 * Notes list component with search
 */
'use client';

import React, { useState } from 'react';
import { NoteCard } from './NoteCard';
import { Input } from '../ui/Input';
import { Note } from '@/types';

interface NotesListProps {
    notes: Note[];
    loading: boolean;
    onEdit: (note: Note) => void;
    onDelete: (id: number) => void;
    onSummarize: (id: number) => void;
    onSearch: (query: string) => void;
}

export function NotesList({
    notes,
    loading,
    onEdit,
    onDelete,
    onSummarize,
    onSearch,
}: NotesListProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
    };

    if (loading && notes.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search */}
            <div className="max-w-md">
                <Input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={handleSearch}
                    fullWidth
                />
            </div>

            {/* Notes Grid */}
            {notes.length === 0 ? (
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No notes</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Get started by creating a new note.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map((note) => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onSummarize={onSummarize}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
