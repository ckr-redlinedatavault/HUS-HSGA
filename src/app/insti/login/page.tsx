'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function InstiLoginPage() {
    // --- Logic Preserved Completely ---
    const [uniqueId, setUniqueId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/insti/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uniqueId, password }),
            });

            if (res.ok) {
                router.push('/insti/dashboard');
            } else {
                const data = await res.json();
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
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
                            Institutional <span className="font-normal text-orange-600">Portal</span>
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm font-light">
                            Manage your institution's programs and student progress through the HSGA network.
                        </p>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleLogin} className="space-y-6">

                        {/* Institutional ID Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                                Institutional ID
                            </label>
                            <input
                                type="text"
                                value={uniqueId}
                                onChange={(e) => setUniqueId(e.target.value.toUpperCase())}
                                placeholder="INST-HSGA-XXXX"
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-200 outline-none transition-all placeholder-gray-300 font-mono text-center tracking-wider"
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
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-200 outline-none transition-all placeholder-gray-300 text-center tracking-widest"
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
                            {loading ? 'Verifying Institution...' : 'Sign In to Dashboard'}
                        </button>

                        {/* Footer Links */}
                        <div className="text-center pt-4">
                            <p className="text-xs text-gray-400 font-light">
                                Not registered yet?{' '}
                                <Link href="/forms/insti-registration" className="text-orange-600 hover:text-orange-700 font-normal hover:underline transition-all">
                                    Register Institution
                                </Link>
                            </p>
                            <Link href="/" className="inline-block mt-4 text-[10px] text-gray-300 hover:text-orange-600 uppercase tracking-widest transition-colors">
                                ← Return to Homepage
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Side: Visual / Image */}
            <div className="hidden lg:block w-1/2 relative bg-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-orange-600/10 mix-blend-multiply z-10" />
                <Image
                    src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000&auto=format&fit=crop"
                    alt="Institutional Excellence"
                    fill
                    className="object-cover grayscale-[0.2]"
                    priority
                />
                <div className="absolute bottom-10 left-10 z-20 text-white max-w-md">
                    <p className="text-lg font-light leading-relaxed">
                        "Education is the most powerful weapon which you can use to change the world."
                    </p>
                    <p className="text-xs mt-4 opacity-80 uppercase tracking-widest">HSGA Unified Systems • Institutional Division</p>
                </div>
            </div>

        </div>
    );
}