'use client';

import { useState, useEffect } from 'react';

type InstiProfile = {
    uniqueId: string;
    instiName: string;
    instiType: string;
    headName: string;
    phoneNo: string;
    email: string;
    district: string;
    status: string;
    createdAt: string;
};

export default function InstiSettings() {
    const [profile, setProfile] = useState<InstiProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/insti/me');
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                }
            } catch (error) {
                console.error('Failed to fetch institutional profile', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <div className="text-gray-400 font-medium">Loading settings...</div>;
    if (!profile) return null;

    const details = [
        { label: 'Institution Name', value: profile.instiName },
        { label: 'Type', value: profile.instiType },
        { label: 'Head of Institution', value: profile.headName },
        { label: 'Institutional ID', value: profile.uniqueId, isMono: true },
        { label: 'Contact Number', value: profile.phoneNo },
        { label: 'Email Address', value: profile.email },
        { label: 'District', value: profile.district },
        { label: 'Registration Date', value: new Date(profile.createdAt).toLocaleDateString() },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-50 bg-gray-50/30 text-gray-900">
                    <h1 className="text-lg font-bold">Institutional Profile</h1>
                    <p className="text-xs text-gray-500 font-medium">Official records registered with Hindustan Scouts and Guides Association.</p>
                </div>

                <div className="divide-y divide-gray-50">
                    {details.map((item) => (
                        <div key={item.label} className="grid grid-cols-1 sm:grid-cols-3 p-5 gap-1 sm:gap-4 items-center">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                            <span className={`sm:col-span-2 text-sm text-gray-700 font-bold ${item.isMono && 'font-mono text-orange-600'}`}>
                                {item.value}
                            </span>
                        </div>
                    ))}
                    <div className="grid grid-cols-1 sm:grid-cols-3 p-5 gap-1 sm:gap-4 items-center">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verification Status</span>
                        <div className="sm:col-span-2">
                            <span className={`px-3 py-1 rounded text-[10px] font-black tracking-widest uppercase border ${profile.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-100' :
                                    profile.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                        'bg-red-50 text-red-700 border-red-100'
                                }`}>
                                {profile.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-amber-50 p-5 rounded-xl border border-amber-100">
                <p className="text-xs text-amber-800 leading-relaxed font-bold italic uppercase tracking-wider">
                    Official Note: Institutional details are verified via physical documentation. Updates require direct contact with the State HQ.
                </p>
            </div>
        </div>
    );
}
