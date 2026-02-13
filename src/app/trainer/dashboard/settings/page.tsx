'use client';

import { useState, useEffect } from 'react';

type TrainerProfile = {
    uniqueId: string;
    fullName: string;
    phoneNo: string;
    email: string;
    district: string;
    status: string;
    createdAt: string;
};

export default function TrainerSettings() {
    const [profile, setProfile] = useState<TrainerProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/trainer/me');
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                }
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <div className="text-gray-400 font-medium">Loading settings...</div>;
    if (!profile) return null;

    const details = [
        { label: 'Full Name', value: profile.fullName },
        { label: 'Trainer ID', value: profile.uniqueId, isMono: true },
        { label: 'Phone', value: profile.phoneNo },
        { label: 'Email', value: profile.email },
        { label: 'District', value: profile.district },
        { label: 'Registered On', value: new Date(profile.createdAt).toLocaleDateString() },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-50 bg-gray-50/30 text-gray-900">
                    <h1 className="text-lg font-bold">Account Details</h1>
                    <p className="text-xs text-gray-500">Official registration information provided to HSGA Telangana.</p>
                </div>

                <div className="divide-y divide-gray-50">
                    {details.map((item) => (
                        <div key={item.label} className="grid grid-cols-1 sm:grid-cols-3 p-5 gap-1 sm:gap-4 items-center">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.label}</span>
                            <span className={`sm:col-span-2 text-sm text-gray-700 font-medium ${item.isMono && 'font-mono text-orange-600'}`}>
                                {item.value}
                            </span>
                        </div>
                    ))}
                    <div className="grid grid-cols-1 sm:grid-cols-3 p-5 gap-1 sm:gap-4 items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</span>
                        <div className="sm:col-span-2 flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${profile.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-100' :
                                profile.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                    'bg-red-50 text-red-700 border-red-100'
                                }`}>
                                {profile.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-amber-50/50 p-5 rounded-xl border border-amber-100">
                <p className="text-xs text-amber-800 leading-relaxed italic">
                    Note: Registration details are read-only. For updates, please visit the HSGA head office with documents.
                </p>
            </div>
        </div>
    );
}
