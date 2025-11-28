/**
 * Note card component for displaying individual notes
 */
'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Note } from '@/types';
import { formatDateTime } from '@/lib/utils';

interface NoteCardProps {
    note: Note;
    onEdit: (note: Note) => void;
    onDelete: (id: number) => void;
    onSummarize: (id: number) => void;
}

export function NoteCard({ note, onEdit, onDelete, onSummarize }: NoteCardProps) {
    const [summarizing, setSummarizing] = useState(false);

    const handleSummarize = async () => {
        setSummarizing(true);
        try {
            await onSummarize(note.id);
        } catch (error) {
            // Error is handled by the parent component/hook
            console.debug('Summarization failed:', error);
        } finally {
            setSummarizing(false);
        }
    };

    return (
        <Card gradient className="hover:scale-[1.02] cursor-pointer group">
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {note.title}
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(note)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            aria-label="Edit note"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => onDelete(note.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            aria-label="Delete note"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                    {note.content}
                </p>

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {note.tags.map(tag => (
                            <span
                                key={tag.id}
                                className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Summary Section */}
                {note.summary ? (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-2">
                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">AI Summary</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{note.summary}</p>
                    </div>
                ) : (
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleSummarize}
                        loading={summarizing}
                        className="w-full"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Generate AI Summary
                    </Button>
                )}

                {/* Footer */}
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDateTime(note.created_at)}
                </div>
            </div>
        </Card>
    );
}
