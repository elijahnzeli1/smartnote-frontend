/**
 * Login Page
 */
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Welcome Back
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Sign in to continue to Smart Notes
                        </p>
                    </div>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
