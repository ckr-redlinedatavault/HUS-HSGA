'use client';

import { useState, useEffect } from 'react';

type TraiRegister = {
    id: string;
    uniqueId: string;
    fullName: string;
    phoneNo: string;
    email: string;
    district: string;
    status: string;
    createdAt: string;
};

export default function TrainerRegistrationAdmin() {
    const [registrations, setRegistrations] = useState<TraiRegister[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [selectedReg, setSelectedReg] = useState<TraiRegister | null>(null);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const res = await fetch('/api/forms/trainer-registration');
            if (res.ok) {
                const data = await res.json();
                setRegistrations(data);
            }
        } catch (error) {
            console.error('Failed to fetch', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, status: 'APPROVED' | 'DECLINED') => {
        setActionLoading(id);
        try {
            const res = await fetch('/api/forms/trainer-registration', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });
            if (res.ok) {
                setRegistrations(prev =>
                    prev.map(r => r.id === id ? { ...r, status } : r)
                );
                if (selectedReg?.id === id) {
                    setSelectedReg(prev => prev ? { ...prev, status } : null);
                }
            }
        } catch (error) {
            console.error('Failed to update status', error);
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            APPROVED: 'bg-green-100 text-green-800 border-green-200',
            DECLINED: 'bg-red-100 text-red-800 border-red-200',
        };
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Trainer Registrations</h1>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm text-gray-500 border border-gray-200">
                    Total: <span className="font-bold text-gray-900">{registrations.length}</span>
                    {' · '}
                    Pending: <span className="font-bold text-yellow-600">{registrations.filter(r => r.status === 'PENDING').length}</span>
                </div>
            </div>

            {loading ? (
                <div className="text-gray-500">Loading registrations...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Unique ID</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Phone</th>
                                    <th className="px-6 py-4">District</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {registrations.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No trainer registrations yet.</td>
                                    </tr>
                                ) : (
                                    registrations.map((reg) => (
                                        <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                                {new Date(reg.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-mono font-bold text-orange-600">{reg.uniqueId}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{reg.fullName}</td>
                                            <td className="px-6 py-4 text-gray-600">{reg.phoneNo}</td>
                                            <td className="px-6 py-4 text-gray-600">{reg.district}</td>
                                            <td className="px-6 py-4">{getStatusBadge(reg.status)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedReg(reg)}
                                                        className="text-orange-600 hover:text-orange-800 font-medium text-xs"
                                                    >
                                                        View
                                                    </button>
                                                    {reg.status === 'PENDING' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusChange(reg.id, 'APPROVED')}
                                                                disabled={actionLoading === reg.id}
                                                                className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusChange(reg.id, 'DECLINED')}
                                                                disabled={actionLoading === reg.id}
                                                                className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                                            >
                                                                Decline
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {selectedReg && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative">
                        <button
                            onClick={() => setSelectedReg(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Trainer Details</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Unique ID</label>
                                    <p className="text-lg font-mono font-bold text-orange-600">{selectedReg.uniqueId}</p>
                                </div>
                                <div>{getStatusBadge(selectedReg.status)}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                                    <p className="text-gray-900 font-medium">{selectedReg.fullName}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                                    <p className="text-gray-900 font-medium">{selectedReg.phoneNo}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                                    <p className="text-gray-900 font-medium">{selectedReg.email}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">District</label>
                                    <p className="text-gray-900 font-medium">{selectedReg.district}</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Registered On</label>
                                <p className="text-gray-900 font-medium">{new Date(selectedReg.createdAt).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {selectedReg.status === 'PENDING' && (
                                <>
                                    <button
                                        onClick={() => handleStatusChange(selectedReg.id, 'APPROVED')}
                                        disabled={actionLoading === selectedReg.id}
                                        className="flex-1 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(selectedReg.id, 'DECLINED')}
                                        disabled={actionLoading === selectedReg.id}
                                        className="flex-1 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                    >
                                        Decline
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => setSelectedReg(null)}
                                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
