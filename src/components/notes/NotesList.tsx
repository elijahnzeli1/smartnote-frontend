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
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        {searchQuery ? 'No notes found matching your search.' : 'No notes yet. Create your first note!'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {notes.map((note: Note) => (
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
