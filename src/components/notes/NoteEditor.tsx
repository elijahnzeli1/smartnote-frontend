/**
 * Note editor modal for creating and editing notes
 */
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { TagSelector } from './TagSelector';
import { Note, CreateNoteData } from '@/types';

interface NoteEditorProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateNoteData) => Promise<void>;
    note?: Note;
}

export function NoteEditor({ isOpen, onClose, onSave, note }: NoteEditorProps) {
    const [loading, setLoading] = useState(false);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateNoteData>();

    useEffect(() => {
        if (note) {
            reset({
                title: note.title,
                content: note.content,
                auto_summarize: false,
            });
            setSelectedTags(note.tags.map(t => t.id));
        } else {
            reset({
                title: '',
                content: '',
                auto_summarize: true,
            });
            setSelectedTags([]);
        }
    }, [note, reset]);

    const onSubmit = async (data: CreateNoteData) => {
        setLoading(true);
        try {
            await onSave({ ...data, tag_ids: selectedTags });
            onClose();
            reset();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={note ? 'Edit Note' : 'Create New Note'}
            size="lg"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    label="Title"
                    placeholder="Enter note title"
                    fullWidth
                    error={errors.title?.message}
                    {...register('title', { required: 'Title is required' })}
                />

                <Textarea
                    label="Content"
                    placeholder="Write your note here..."
                    fullWidth
                    rows={10}
                    error={errors.content?.message}
                    {...register('content', { required: 'Content is required' })}
                />

                <TagSelector
                    selectedTags={selectedTags}
                    onChange={setSelectedTags}
                    label="Tags"
                />

                {!note && (
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="auto_summarize"
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            {...register('auto_summarize')}
                            defaultChecked
                        />
                        <label htmlFor="auto_summarize" className="text-sm text-gray-700 dark:text-gray-300">
                            Automatically generate AI summary
                        </label>
                    </div>
                )}

                <div className="flex gap-3">
                    <Button type="submit" fullWidth loading={loading}>
                        {note ? 'Update Note' : 'Create Note'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
