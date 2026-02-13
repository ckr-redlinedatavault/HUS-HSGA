'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function InstiRegistrationForm() {
    // --- Logic Preserved ---
    const [formData, setFormData] = useState({
        instiName: '',
        instiType: '',
        headName: '',
        phoneNo: '',
        email: '',
        district: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState<{ uniqueId: string } | null>(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/forms/insti-registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                setSuccessData(data);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to submit registration');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Success View
    if (successData) {
        return (
            <div className="h-screen w-full bg-gray-50 flex items-center justify-center p-4 overflow-hidden font-sans">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-normal text-gray-900 mb-2">Registration Approved</h1>
                    <p className="text-gray-500 text-sm mb-6 font-normal">Your account has been created. Please secure your ID.</p>
                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-6">
                        <p className="text-[10px] font-normal text-orange-600 uppercase tracking-widest mb-1">Unique Institutional ID</p>
                        <p className="text-2xl font-mono font-normal text-gray-900">{successData.uniqueId}</p>
                    </div>
                    <div className="space-y-3">
                        <Link href="/insti/login" className="block w-full bg-orange-600 text-white font-normal py-3 rounded-xl hover:bg-orange-700 transition-all">
                            Proceed to Login
                        </Link>
                        <Link href="/" className="block text-gray-400 font-normal text-[10px] uppercase tracking-widest">
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gray-50 font-sans text-gray-600 flex flex-col">

            {/* Navigation */}
            <nav className="shrink-0 h-20 px-8 flex justify-between items-center bg-white border-b border-gray-100 flex-none sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                        <Image
                            src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770199908/1769454781522_pgepvr.png"
                            alt="HSGA Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div>
                        <h2 className="text-sm font-normal text-gray-900 leading-none">
                            HSGA <span className="text-orange-600">TELANGANA</span>
                        </h2>
                        <p className="text-[9px] font-normal text-gray-400 uppercase tracking-widest mt-1">Unified Systems</p>
                    </div>
                </div>
                <Link href="/get-started" className="flex items-center gap-2 px-5 py-2 border border-gray-200 text-gray-600 rounded-full text-[10px] font-normal uppercase hover:bg-gray-50 bg-white">
                    Go Back
                </Link>
            </nav>

            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center p-4 py-12 md:p-8">
                <div className="max-w-4xl w-full bg-white rounded-[24px] shadow-lg border border-gray-100 flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="bg-orange-600 p-6 text-white shrink-0">
                        <h1 className="text-2xl font-normal uppercase tracking-tight">Institutional Onboarding</h1>
                        <p className="text-orange-100 text-[11px] font-normal mt-1 opacity-90">
                            Register your School, College, or Organization to the HSGA Unified Network.
                        </p>
                    </div>

                    {/* Scrollable Form Container (only if height is very small) */}
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-normal text-gray-400 uppercase tracking-widest">Institution Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 font-normal text-gray-900"
                                    value={formData.instiName}
                                    onChange={(e) => setFormData({ ...formData, instiName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-normal text-gray-400 uppercase tracking-widest">Institution Type</label>
                                <select
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 font-normal text-gray-900 appearance-none"
                                    value={formData.instiType}
                                    onChange={(e) => setFormData({ ...formData, instiType: e.target.value })}
                                >
                                    <option value="">Select Category</option>
                                    <option value="SCHOOL">High School</option>
                                    <option value="COLLEGE">Junior/Degree College</option>
                                    <option value="OTHER">Other Organization</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-normal text-gray-400 uppercase tracking-widest">Authorized Head / Principal Name</label>
                            <input
                                required
                                type="text"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 font-normal text-gray-900"
                                value={formData.headName}
                                onChange={(e) => setFormData({ ...formData, headName: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-normal text-gray-400 uppercase tracking-widest">Contact Number</label>
                                <input
                                    required
                                    type="tel"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 font-normal text-gray-900"
                                    value={formData.phoneNo}
                                    onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-normal text-gray-400 uppercase tracking-widest">Official Email</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 font-normal text-gray-900"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-normal text-gray-400 uppercase tracking-widest">District</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 font-normal text-gray-900"
                                    value={formData.district}
                                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-normal text-gray-400 uppercase tracking-widest">Account Password</label>
                                <input
                                    required
                                    type="password"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 font-normal text-gray-900"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-[10px] font-normal uppercase text-center">
                                {error}
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                disabled={loading}
                                type="submit"
                                className="w-full bg-gray-900 text-white font-normal py-4 rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50 text-[11px] uppercase tracking-widest"
                            >
                                {loading ? 'Processing...' : 'Submit Institutional Application'}
                            </button>
                        </div>

                        <p className="text-center text-[10px] font-normal text-gray-400 uppercase tracking-widest">
                            Already have an ID? <Link href="/insti/login" className="text-orange-600">Login</Link>
                        </p>
                    </form>
                </div>
            </main>

            {/* Simple Orange Footer */}
            <footer className="w-full bg-orange-600 text-white py-6 shrink-0">
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <h2 className="text-lg font-normal">HSGA Telangana State</h2>
                        <p className="text-white/80 text-xs mt-1 font-light italic">
                            Service • Unity • Discipline
                        </p>
                    </div>
                    <div className="flex gap-6 text-sm font-light">
                        <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
                        <Link href="/terms" className="hover:underline">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}