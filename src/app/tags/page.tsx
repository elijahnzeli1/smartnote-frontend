/**
 * Tags Management Page
 */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { tagsApi } from '@/lib/api/tags';
import { Tag } from '@/types';
import { FaTrash } from 'react-icons/fa';

export default function TagsPage() {
    const router = useRouter();
    const { user, loading: authLoading, logout } = useAuth();
    const [tags, setTags] = useState<Tag[]>([]);
    const [newTagName, setNewTagName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            loadTags();
        }
    }, [user]);

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
            setNewTagName('');
        } catch (error) {
            console.error('Failed to create tag:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTag = async (id: number) => {
        if (!confirm('Delete this tag? It will be removed from all notes.')) return;

        try {
            await tagsApi.deleteTag(id);
            setTags(tags.filter(tag => tag.id !== id));
        } catch (error) {
            console.error('Failed to delete tag:', error);
        }
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
        <div className="min-h-screen bg-background dark:bg-gray-900 flex">
            <Sidebar onLogout={logout} username={user.username} />

            <div className="flex-1 lg:ml-64">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="container mx-auto px-4 py-4">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Tags Management
                        </h1>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto space-y-6">
                        {/* Create Tag */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Create New Tag
                            </h2>
                            <div className="flex gap-3">
                                <Input
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
                                    placeholder="Tag name"
                                    fullWidth
                                />
                                <Button
                                    onClick={handleCreateTag}
                                    disabled={loading || !newTagName.trim()}
                                    loading={loading}
                                >
                                    Create
                                </Button>
                            </div>
                        </div>

                        {/* Tags List */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Your Tags ({tags.length})
                            </h2>
                            {tags.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                                    No tags yet. Create your first tag above.
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {Array.isArray(tags) && tags.map(tag => (
                                        <div
                                            key={tag.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                        >
                                            <span className="text-gray-900 dark:text-white font-medium">
                                                {tag.name}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteTag(tag.id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
