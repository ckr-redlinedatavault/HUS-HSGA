'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function TrainerRegistrationForm() {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNo: '',
        email: '',
        district: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [generatedId, setGeneratedId] = useState('');
    const [error, setError] = useState('');

    const patterns = {
        text: /^[a-zA-Z\s\.]+$/,
        phone: /^[6-9]\d{9}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'phoneNo') {
            if (!/^\d*$/.test(value)) return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!patterns.text.test(formData.fullName)) return "Full Name should contain only letters.";
        if (!patterns.phone.test(formData.phoneNo)) return "Phone Number must be a valid 10-digit Indian number.";
        if (!patterns.email.test(formData.email)) return "Please enter a valid email address.";
        if (!patterns.text.test(formData.district)) return "District should contain only letters.";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setLoading(false);
            window.scrollTo(0, 0);
            return;
        }

        try {
            const res = await fetch('/api/forms/trainer-registration', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                setGeneratedId(data.uniqueId);
                setSuccess(true);
                window.scrollTo(0, 0);
            } else {
                const data = await res.json();
                setError(data.error || 'Registration failed');
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Success View
    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans overflow-hidden">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-xl font-normal text-gray-900 mb-2">Registration Submitted</h1>
                    <p className="text-gray-500 text-sm mb-6 font-normal">Please secure your Unique Trainer ID below.</p>

                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-6">
                        <p className="text-[10px] font-normal text-orange-600 uppercase tracking-widest mb-1">Unique Trainer ID</p>
                        <p className="text-2xl font-mono font-normal text-gray-900 tracking-wider uppercase">{generatedId}</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-left mb-8">
                        <h3 className="text-[10px] font-bold text-blue-800 uppercase tracking-widest mb-2">Next Steps</h3>
                        <ol className="text-[11px] text-blue-700 space-y-2 opacity-90">
                            <li>• Submit the physical form at the HSGA office.</li>
                            <li>• Wait for admin verification & approval.</li>
                        </ol>
                    </div>

                    <div className="space-y-3">
                        <a href="/trainer/login" className="block w-full bg-orange-600 text-white font-normal py-3 rounded-xl hover:bg-orange-700 transition-all text-sm">
                            Go to Trainer Login
                        </a>
                        <Link href="/" className="block text-gray-400 font-normal text-[10px] uppercase tracking-widest pt-2">
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
            <nav className="shrink-0 h-20 px-8 flex justify-between items-center bg-white border-b border-gray-100 sticky top-0 z-50 bg-white/80 backdrop-blur-md">
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
                <Link href="/get-started" className="flex items-center gap-2 px-5 py-2 border border-gray-200 text-gray-600 rounded-full text-[10px] font-normal uppercase hover:bg-gray-50 bg-white transition-colors">
                    Go Back
                </Link>
            </nav>

            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center p-4 py-12 md:p-8">
                <div className="max-w-4xl w-full bg-white rounded-[24px] shadow-lg border border-gray-100 flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="bg-orange-600 p-8 text-white shrink-0 relative">
                        <h1 className="text-2xl md:text-3xl font-normal uppercase tracking-tight">Trainer Onboarding</h1>
                        <p className="text-orange-100 text-[11px] md:text-sm font-normal mt-1 opacity-90 max-w-lg">
                            Register as a certified trainer with HSGA Telangana. Join our mission to empower youth through discipline and service.
                        </p>
                    </div>

                    {/* Form Panel */}
                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8 overflow-y-auto">

                        {error && (
                            <div className="text-red-500 text-[10px] font-normal uppercase text-center bg-red-50 p-4 rounded-xl border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Full Name */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-normal text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input
                                    name="fullName"
                                    required
                                    type="text"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Enter your legal name"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-orange-500 font-normal text-gray-900 transition-all focus:bg-white"
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-normal text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <input
                                    name="phoneNo"
                                    required
                                    type="tel"
                                    value={formData.phoneNo}
                                    onChange={handleInputChange}
                                    placeholder="10-digit mobile"
                                    maxLength={10}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-orange-500 font-normal text-gray-900 transition-all focus:bg-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Email */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-normal text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input
                                    name="email"
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="trainer@example.com"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-orange-500 font-normal text-gray-900 transition-all focus:bg-white"
                                />
                            </div>

                            {/* District */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-normal text-gray-400 uppercase tracking-widest ml-1">District</label>
                                <input
                                    name="district"
                                    required
                                    type="text"
                                    value={formData.district}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Hyderabad"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-orange-500 font-normal text-gray-900 transition-all focus:bg-white"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-normal text-gray-400 uppercase tracking-widest ml-1">Account Password</label>
                            <input
                                name="password"
                                required
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Create a secure password"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-orange-500 font-normal text-gray-900 transition-all focus:bg-white"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gray-900 text-white font-normal py-5 rounded-xl hover:bg-orange-600 transition-all disabled:opacity-50 text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-gray-200 hover:shadow-orange-100"
                            >
                                {loading ? 'Processing Registration...' : 'Submit Trainer Application'}
                            </button>
                        </div>

                        <p className="text-center text-[10px] font-normal text-gray-400 uppercase tracking-widest">
                            Already have a Trainer ID? <Link href="/trainer/login" className="text-orange-600 hover:underline">Login to Portal</Link>
                        </p>
                    </form>
                </div>
            </main>

            {/* Official Orange Footer */}
            <footer className="w-full bg-orange-600 text-white py-12 shrink-0">
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-xl font-normal uppercase tracking-tight">HSGA Telangana State</h2>
                        <p className="text-white/80 text-[10px] mt-1 font-normal uppercase tracking-[0.2em]">
                            Service • Unity • Discipline
                        </p>
                    </div>
                    <div className="flex gap-8 text-[11px] font-normal uppercase tracking-widest">
                        <Link href="/privacy" className="hover:text-gray-900 transition-colors underline-offset-4 hover:underline">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-gray-900 transition-colors underline-offset-4 hover:underline">Terms of Service</Link>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-8 mt-8 pt-8 border-t border-white/10 text-center">
                    <p className="text-[9px] text-white/50 uppercase tracking-[0.3em]">© 2026 HSGA Unified Systems • All Rights Reserved</p>
                </div>
            </footer>
        </div>
    );
}
