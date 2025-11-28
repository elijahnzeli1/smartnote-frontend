/**
 * Collapsible Sidebar Component
 */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes, FaStickyNote, FaTags, FaSignOutAlt } from 'react-icons/fa';
import { cn } from '@/lib/utils';

interface SidebarProps {
    onLogout: () => void;
    username: string;
}

export function Sidebar({ onLogout, username }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(true);
    const pathname = usePathname();

    const navItems = [
        { href: '/notes', icon: FaStickyNote, label: 'Notes' },
        { href: '/tags', icon: FaTags, label: 'Tags' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-50',
                    isOpen ? 'w-64' : 'w-0 lg:w-16'
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        {isOpen && (
                            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Smart Notes
                            </h2>
                        )}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                                        isActive
                                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    )}
                                >
                                    <Icon size={20} />
                                    {isOpen && <span className="font-medium">{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                        {isOpen && (
                            <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                                {username}
                            </div>
                        )}
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                        >
                            <FaSignOutAlt size={20} />
                            {isOpen && <span>Sign Out</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Toggle Button (Mobile) */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed top-4 left-4 z-40 lg:hidden p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
                >
                    <FaBars size={20} />
                </button>
            )}
        </>
    );
}
