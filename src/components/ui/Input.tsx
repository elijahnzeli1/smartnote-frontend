/**
 * Input component with validation states
 */
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
    suffix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, fullWidth, className, suffix, ...props }, ref) => {
        return (
            <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
                {label && (
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        ref={ref}
                        className={cn(
                            'px-4 py-2 rounded-lg border transition-all duration-200 w-full',
                            'bg-white dark:bg-gray-800',
                            'border-gray-300 dark:border-gray-600',
                            'text-gray-900 dark:text-white',
                            'placeholder-gray-400 dark:placeholder-gray-500',
                            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                            error && 'border-red-500 focus:ring-red-500',
                            'disabled:opacity-50 disabled:cursor-not-allowed',
                            !!suffix && 'pr-10',
                            className
                        )}
                        {...props}
                    />
                    {suffix && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {suffix}
                        </div>
                    )}
                </div>
                {error && (
                    <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
