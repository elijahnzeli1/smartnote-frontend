/**
 * Registration form component  
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

interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
}

export function RegisterForm() {
    const router = useRouter();
    const { register: registerUser } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>();

    const password = watch('password');

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        setError('');

        try {
            await registerUser(data);
            // After successful registration, redirect to login
            router.push('/login?registered=true');
        } catch (err) {
            const error = err as { response?: { data?: { username?: string[]; email?: string[]; message?: string } } };
            const errorMsg = error.response?.data?.username?.[0] ||
                error.response?.data?.email?.[0] ||
                error.response?.data?.message ||
                'Registration failed';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
                label="Username"
                type="text"
                placeholder="Choose a username"
                fullWidth
                error={errors.username?.message}
                {...register('username', {
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Username must be at least 3 characters' }
                })}
            />

            <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                fullWidth
                error={errors.email?.message}
                {...register('email', {
                    required: 'Email is required',
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                    }
                })}
            />

            <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                fullWidth
                error={errors.password?.message}
                {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' }
                })}
                suffix={
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                }
            />

            <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                fullWidth
                error={errors.password_confirm?.message}
                {...register('password_confirm', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                })}
                suffix={
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                }
            />

            {error && (
                <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    {error}
                </div>
            )}

            <Button type="submit" fullWidth loading={loading}>
                Create Account
            </Button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in
                </Link>
            </p>
        </form>
    );
}
