/**
 * Tag selection component for notes
 */
'use client';

import React, { useState, useEffect } from 'react';
import { Tag } from '@/types';
import { notesApi } from '@/lib/api/notes';

interface TagSelectorProps {
    selectedTags: number[];
    onChange: (tagIds: number[]) => void;
}

export function TagSelector({ selectedTags, onChange }: TagSelectorProps) {
    const [tags, setTags] = useState<Tag[]>([]);
    const [newTagName, setNewTagName] = useState('');
    const [isAddingTag, setIsAddingTag] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTags();
    }, []);

    const loadTags = async () => {
        try {
            const data = await notesApi.getTags();
            setTags(data);
        } catch (error) {
            console.error('Failed to load tags:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleTag = (tagId: number) => {
        if (selectedTags.includes(tagId)) {
            onChange(selectedTags.filter(id => id !== tagId));
        } else {
            onChange([...selectedTags, tagId]);
        }
    };

    const handleCreateTag = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTagName.trim()) return;

        try {
            const newTag = await notesApi.createTag(newTagName.trim());
            setTags([...tags, newTag]);
            setNewTagName('');
            setIsAddingTag(false);
            onChange([...selectedTags, newTag.id]);
        } catch (error) {
            console.error('Failed to create tag:', error);
            alert('Failed to create tag. It may already exist.');
        }
    };

    if (loading) {
        return <div className="text-sm text-gray-500">Loading tags...</div>;
    }

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            
            {/* Tag List */}
            <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleToggleTag(tag.id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            selectedTags.includes(tag.id)
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {tag.name}
                    </button>
                ))}
            </div>

            {/* Add New Tag */}
            {isAddingTag ? (
                <form onSubmit={handleCreateTag} className="flex gap-2">
                    <input
                        type="text"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="Tag name"
                        className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Add
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setIsAddingTag(false);
                            setNewTagName('');
                        }}
                        className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </form>
            ) : (
                <button
                    type="button"
                    onClick={() => setIsAddingTag(true)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                >
                    + Add new tag
                </button>
            )}
        </div>
    );
}
