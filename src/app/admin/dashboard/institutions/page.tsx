'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../layout';

type Institution = {
    id: string;
    uniqueId: string;
    instiName: string;
    instiType: string;
    headName: string;
    phoneNo: string;
    email: string;
    district: string;
    status: string;
    trainerId?: string;
};

type Trainer = {
    uniqueId: string;
    fullName: string;
    district: string;
};

export default function AdminInstitutions() {
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const [instiRes, trainerRes] = await Promise.all([
                fetch('/api/admin/insti'),
                fetch('/api/admin/trainers/approved')
            ]);
            const instiData = await instiRes.json();
            const trainerData = await trainerRes.json();
            setInstitutions(instiData);
            setTrainers(trainerData);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        setActionLoading(id);
        try {
            const res = await fetch(`/api/admin/insti/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (res.ok) fetchData();
        } finally {
            setActionLoading(null);
        }
    };

    const assignTrainer = async (id: string, trainerId: string) => {
        setActionLoading(id);
        try {
            const res = await fetch(`/api/admin/insti/${id}/assign-trainer`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trainerId }),
            });
            if (res.ok) fetchData();
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return <div className="p-8 text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Institutions...</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Institutional Management</h1>
                    <p className="text-sm text-gray-500 font-medium tracking-tight">Approve schools and assign dedicated trainers.</p>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Institution Info</th>
                                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type / District</th>
                                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Assign Trainer</th>
                                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {institutions.map((insti) => (
                                <tr key={insti.id} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="p-5">
                                        <p className="font-bold text-gray-900 text-sm">{insti.instiName}</p>
                                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-1">{insti.uniqueId}</p>
                                    </td>
                                    <td className="p-5">
                                        <p className="text-xs font-bold text-gray-700">{insti.instiType}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{insti.district}</p>
                                    </td>
                                    <td className="p-5">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase border ${insti.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-100' :
                                                insti.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                    'bg-red-50 text-red-700 border-red-100'
                                            }`}>
                                            {insti.status}
                                        </span>
                                    </td>
                                    <td className="p-5 min-w-[200px]">
                                        {insti.status === 'APPROVED' ? (
                                            <select
                                                disabled={actionLoading === insti.id}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-orange-500 transition-all"
                                                value={insti.trainerId || ''}
                                                onChange={(e) => assignTrainer(insti.id, e.target.value)}
                                            >
                                                <option value="">Unassigned</option>
                                                {trainers.map(t => (
                                                    <option key={t.uniqueId} value={t.uniqueId}>
                                                        {t.fullName} ({t.district})
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Approve first</p>
                                        )}
                                    </td>
                                    <td className="p-5 whitespace-nowrap">
                                        <div className="flex gap-2">
                                            {insti.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => updateStatus(insti.id, 'APPROVED')}
                                                        className="px-3 py-1.5 bg-green-600 text-white rounded text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-sm"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(insti.id, 'DECLINED')}
                                                        className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                    >
                                                        Decline
                                                    </button>
                                                </>
                                            )}
                                            {insti.status !== 'PENDING' && (
                                                <button
                                                    onClick={() => updateStatus(insti.id, 'PENDING')}
                                                    className="px-3 py-1.5 text-gray-400 hover:text-gray-600 text-[10px] font-black uppercase tracking-widest transition-all"
                                                >
                                                    Reset to Pending
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {institutions.length === 0 && (
                        <div className="p-20 text-center">
                            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">No institutional registrations found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
