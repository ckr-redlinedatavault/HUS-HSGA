'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLogin() {
    // --- Logic Preserved Completely ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Added for better UX
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push('/admin/dashboard');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    // ----------------------------------

    return (
        <div className="min-h-screen flex w-full bg-white font-sans text-gray-600 selection:bg-orange-100 relative">

            {/* Top Left Logo Branding */}
            <div className="absolute top-8 left-8 z-30 flex items-center gap-4">
                <div className="relative w-16 h-16 lg:w-20 lg:h-20">
                    <Image
                        src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770199908/1769454781522_pgepvr.png"
                        alt="HSGA Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900 leading-none tracking-tight">
                        HSGA <span className="text-orange-600">TELANGANA</span>
                    </h2>
                    <p className="text-xs lg:text-sm font-medium text-gray-400 uppercase tracking-[0.2em] mt-1">
                        Unified Systems
                    </p>
                </div>
            </div>

            {/* Left Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 pt-32 lg:pt-16">
                <div className="max-w-md w-full space-y-10">

                    {/* Header Section */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-light text-gray-900 tracking-tight">
                            Admin <span className="font-normal text-orange-600">Control</span>
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm font-light">
                            Authorized personnel only. Enter your administrative credentials.
                        </p>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleLogin} className="space-y-6">

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                                Admin Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@hsga.org"
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-200 outline-none transition-all placeholder-gray-300"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-200 outline-none transition-all placeholder-gray-300 tracking-widest"
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs text-center font-medium">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-full shadow-lg shadow-orange-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? 'Authenticating...' : 'Access Administration'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Side: Visual Section */}
            <div className="hidden lg:block w-1/2 relative bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-orange-600/20 mix-blend-multiply z-10" />
                <Image
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop"
                    alt="Administration Center"
                    fill
                    className="object-cover opacity-60 grayscale-[0.5]"
                    priority
                />
                <div className="absolute bottom-12 left-12 z-20 text-white max-w-sm">
                    <div className="h-1 w-12 bg-orange-600 mb-6" />
                    <p className="text-2xl font-light leading-snug">
                        Management is doing things right; <br />
                        <span className="italic font-normal">leadership is doing the right things.</span>
                    </p>
                    <p className="text-xs mt-6 opacity-60 uppercase tracking-[0.3em]">System Admin Panel v2.0</p>
                </div>
            </div>

        </div>
    );
}