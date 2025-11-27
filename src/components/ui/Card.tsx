/**
 * Card component for displaying notes
 */
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    gradient?: boolean;
}

export function Card({ gradient = false, className, children, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-xl p-6 transition-all duration-300',
                gradient
                    ? 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
                'shadow-md hover:shadow-xl',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
