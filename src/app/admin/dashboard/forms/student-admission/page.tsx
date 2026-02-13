'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type Submission = {
    id: string;
    district: string;
    schoolName: string;
    studentName: string;
    className: string;
    phoneNo: string;
    studentSignature: string;
    principalSignature: string;
    seal: string;
    createdAt: string;
};

export default function StudentAdmissionAdmin() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSub, setSelectedSub] = useState<Submission | null>(null);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const res = await fetch('/api/forms/student-admission');
            if (res.ok) {
                const data = await res.json();
                setSubmissions(data);
            }
        } catch (error) {
            console.error('Failed to fetch', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">Student Admissions Received</h1>

            {loading ? (
                <div className="text-gray-500">Loading submissions...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Student Name</th>
                                    <th className="px-6 py-4">School</th>
                                    <th className="px-6 py-4">District</th>
                                    <th className="px-6 py-4">Class</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {submissions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No submissions yet.</td>
                                    </tr>
                                ) : (
                                    submissions.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                                {new Date(sub.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">{sub.studentName}</td>
                                            <td className="px-6 py-4 text-gray-600">{sub.schoolName}</td>
                                            <td className="px-6 py-4 text-gray-600">{sub.district}</td>
                                            <td className="px-6 py-4 text-gray-600">{sub.className}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setSelectedSub(sub)}
                                                    className="text-orange-600 hover:text-orange-800 font-medium"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Detail Modal/Overlay */}
            {selectedSub && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
                        <button
                            onClick={() => setSelectedSub(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2">Application Details</h2>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Student Name</label>
                                <p className="text-gray-900 font-medium">{selectedSub.studentName}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">School Name</label>
                                <p className="text-gray-900 font-medium">{selectedSub.schoolName}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Class</label>
                                <p className="text-gray-900 font-medium">{selectedSub.className}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Phone No</label>
                                <p className="text-gray-900 font-medium">{selectedSub.phoneNo}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">District</label>
                                <p className="text-gray-900 font-medium">{selectedSub.district}</p>
                            </div>
                        </div>

                        <h3 className="text-md font-bold text-gray-900 mb-4 border-b pb-1">Signatures & Documents</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="border border-gray-100 rounded-lg p-2">
                                <p className="text-xs text-center text-gray-500 mb-2">Student Signature</p>
                                {selectedSub.studentSignature && (
                                    <img src={selectedSub.studentSignature} alt="Student Signature" className="max-h-32 mx-auto object-contain" />
                                )}
                            </div>
                            <div className="border border-gray-100 rounded-lg p-2">
                                <p className="text-xs text-center text-gray-500 mb-2">Principal Signature</p>
                                {selectedSub.principalSignature && (
                                    <img src={selectedSub.principalSignature} alt="Principal Signature" className="max-h-32 mx-auto object-contain" />
                                )}
                            </div>
                            <div className="border border-gray-100 rounded-lg p-2">
                                <p className="text-xs text-center text-gray-500 mb-2">School Seal</p>
                                {selectedSub.seal && (
                                    <img src={selectedSub.seal} alt="Seal" className="max-h-32 mx-auto object-contain" />
                                )}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={() => setSelectedSub(null)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium"
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
