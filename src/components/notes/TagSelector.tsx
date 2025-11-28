/**
 * Tag selector component with create functionality
 */
'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus } from 'react-icons/fa';
import { Tag } from '@/types';
import { tagsApi } from '@/lib/api/tags';
import { cn } from '@/lib/utils';

interface TagSelectorProps {
    selectedTags: number[];
    onChange: (tagIds: number[]) => void;
    label?: string;
}

export function TagSelector({ selectedTags, onChange, label }: TagSelectorProps) {
    const [tags, setTags] = useState<Tag[]>([]);
    const [newTagName, setNewTagName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadTags();
    }, []);

    const loadTags = async () => {
        try {
            const data = await tagsApi.getTags();
            setTags(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load tags:', error);
            setTags([]);
        }
    };

    const handleCreateTag = async () => {
        if (!newTagName.trim()) return;

        setLoading(true);
        try {
            const newTag = await tagsApi.createTag(newTagName.trim());
            setTags([...tags, newTag]);
            onChange([...selectedTags, newTag.id]);
            setNewTagName('');
        } catch (error) {
            console.error('Failed to create tag:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleTag = (tagId: number) => {
        if (selectedTags.includes(tagId)) {
            onChange(selectedTags.filter(id => id !== tagId));
        } else {
            onChange([...selectedTags, tagId]);
        }
    };

    return (
        <div className="space-y-3">
            {label && (
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}

            {/* Selected Tags */}
            {selectedTags.length > 0 && Array.isArray(tags) && (
                <div className="flex flex-wrap gap-2">
                    {tags
                        .filter(tag => selectedTags.includes(tag.id))
                        .map(tag => (
                            <span
                                key={tag.id}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                            >
                                {tag.name}
                                <button
                                    onClick={() => toggleTag(tag.id)}
                                    className="hover:text-blue-900 dark:hover:text-blue-100"
                                >
                                    <FaTimes size={12} />
                                </button>
                            </span>
                        ))}
                </div>
            )}

            {/* Available Tags */}
            <div className="flex flex-wrap gap-2">
                {Array.isArray(tags) && tags
                    .filter(tag => !selectedTags.includes(tag.id))
                    .map(tag => (
                        <button
                            key={tag.id}
                            onClick={() => toggleTag(tag.id)}
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            {tag.name}
                        </button>
                    ))}
            </div>

            {/* Create New Tag */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
                    placeholder="New tag name"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleCreateTag}
                    disabled={loading || !newTagName.trim()}
                    className={cn(
                        'px-4 py-2 rounded-lg transition-colors flex items-center gap-1',
                        loading || !newTagName.trim()
                            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    )}
                >
                    <FaPlus size={14} />
                    <span className="text-sm">Add</span>
                </button>
            </div>
        </div>
    );
}
