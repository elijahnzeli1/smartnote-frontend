/**
 * Export button component for notes
 */
'use client';

import React, { useState } from 'react';
import { ExportFormat } from '@/types';
import { notesApi } from '@/lib/api/notes';

interface ExportButtonProps {
    search?: string;
    tagId?: number;
}

export function ExportButton({ search, tagId }: ExportButtonProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const handleExport = async (format: ExportFormat) => {
        setIsExporting(true);
        setShowMenu(false);

        try {
            const blob = await notesApi.exportNotes(format, search, tagId);
            
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            // Set filename based on format
            const extension = format === 'markdown' ? 'md' : format;
            link.download = `notes_export.${extension}`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export notes. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
                <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                </svg>
                {isExporting ? 'Exporting...' : 'Export Notes'}
            </button>

            {/* Export format menu */}
            {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                        <button
                            onClick={() => handleExport('json')}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                            <div className="font-medium">JSON</div>
                            <div className="text-xs text-gray-500">Structured data format</div>
                        </button>
                        <button
                            onClick={() => handleExport('csv')}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                            <div className="font-medium">CSV</div>
                            <div className="text-xs text-gray-500">Spreadsheet format</div>
                        </button>
                        <button
                            onClick={() => handleExport('markdown')}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                            <div className="font-medium">Markdown</div>
                            <div className="text-xs text-gray-500">Readable text format</div>
                        </button>
                    </div>
                </div>
            )}

            {/* Click outside to close menu */}
            {showMenu && (
                <div 
                    className="fixed inset-0 z-0" 
                    onClick={() => setShowMenu(false)}
                />
            )}
        </div>
    );
}
