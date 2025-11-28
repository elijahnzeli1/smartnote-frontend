/**
 * Login form component
 */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuth } from '@/lib/hooks';
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface LoginFormData {
    username: string;
    password: string;
}

export function LoginForm() {
    const router = useRouter();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        setError('');

        try {
            await login(data);
            router.push('/notes');
        } catch (err) {
            const error = err as { response?: { data?: { detail?: string } } };
            setError(error.response?.data?.detail || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
                label="Username"
                type="text"
                placeholder="Enter your username"
                fullWidth
                error={errors.username?.message}
                {...register('username', { required: 'Username is required' })}
            />

            <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                fullWidth
                error={errors.password?.message}
                {...register('password', { required: 'Password is required' })}
                suffix={
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                    >
                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                }
            />

            {error && (
                <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    {error}
                </div>
            )}

            <Button type="submit" fullWidth loading={loading}>
                Sign In
            </Button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign up
                </Link>
            </p>
        </form>
    );
}
