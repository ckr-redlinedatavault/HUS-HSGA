'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type TrainerProfile = {
    uniqueId: string;
    fullName: string;
    phoneNo: string;
    email: string;
    district: string;
    status: string;
    createdAt: string;
};

export default function TrainerDashboard() {
    const [profile, setProfile] = useState<TrainerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

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

    if (loading) return <div className="text-gray-400 font-medium">Loading overview...</div>;
    if (!profile) return null;

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString(undefined, {
            weekday: 'long', month: 'long', day: 'numeric'
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString(undefined, {
            hour: '2-digit', minute: '2-digit', hour12: true
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                        {getGreeting()}, {profile.fullName.split(' ')[0]}
                    </h1>
                    <p className="text-sm text-gray-500">Welcome back to HSGA Telangana Trainer portal.</p>
                </div>
                <div className="md:text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{formatDate(currentTime)}</p>
                    <p className="text-xl font-bold text-gray-900">{formatTime(currentTime)}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Status</p>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${profile.status === 'APPROVED' ? 'bg-green-500' :
                            profile.status === 'PENDING' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                        <span className="font-bold text-gray-900">{profile.status}</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Trainer ID</p>
                    <p className="font-mono font-bold text-orange-600">{profile.uniqueId}</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">District</p>
                    <p className="font-bold text-gray-900">{profile.district}</p>
                </div>
            </div>

            {/* Notice */}
            <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 flex gap-4">
                <div className="p-2 bg-blue-100 rounded-lg h-fit text-blue-600 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="space-y-1">
                    <h3 className="text-sm font-bold text-blue-900 uppercase">Information</h3>
                    <p className="text-sm text-blue-800/80 leading-relaxed">
                        {profile.status === 'APPROVED'
                            ? "Your account is active. You can now access trainer features and event schedules."
                            : "Your registration is currently under review. Final verification requires submission of physical documents at the HSGA office."
                        }
                    </p>
                </div>
            </div>

            {/* Assigned Schools */}
            {profile.status === 'APPROVED' && <AssignedSchoolsSection />}
        </div>
    );
}

function AssignedSchoolsSection() {
    const [schools, setSchools] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/trainer/schools')
            .then(res => res.json())
            .then(data => {
                setSchools(Array.isArray(data) ? data : []);
                setLoading(false);
            });
    }, []);

    if (loading) return null;
    if (schools.length === 0) return null;

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Assigned Institutions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schools.map((school) => (
                    <div key={school.uniqueId} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-gray-900">{school.instiName}</h3>
                                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mt-1">{school.uniqueId}</p>
                            </div>
                            <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-orange-100">
                                {school.instiType}
                            </span>
                        </div>
                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                {school.headName}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {school.district}
                            </div>
                        </div>
                        <Link
                            href={`/trainer/dashboard/schools/${school.uniqueId}`}
                            className="flex items-center justify-center gap-2 w-full bg-gray-50 text-gray-900 font-black text-[10px] uppercase tracking-widest py-3 rounded-xl hover:bg-gray-900 hover:text-white transition-all group-hover:bg-orange-600 group-hover:text-white"
                        >
                            View Enrolled Students
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
