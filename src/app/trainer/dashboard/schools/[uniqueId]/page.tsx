'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function TrainerSchoolStudents() {
    const { uniqueId } = useParams();
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/trainer/schools/${uniqueId}/students`)
            .then(res => res.json())
            .then(data => {
                setStudents(Array.isArray(data) ? data : []);
                setLoading(false);
            });
    }, [uniqueId]);

    if (loading) return <div className="p-8 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading student list...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/trainer/dashboard" className="p-2 text-gray-400 hover:text-orange-600 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Institutional Student List</h1>
                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.2em]">{uniqueId}</p>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Name</th>
                                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Father's Name</th>
                                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Class</th>
                                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</th>
                                <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reg. Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="p-5 text-sm font-bold text-gray-900">{student.studentName}</td>
                                    <td className="p-5 text-sm text-gray-600 font-medium">{student.fatherName}</td>
                                    <td className="p-5 text-sm text-gray-600 font-medium">{student.className}</td>
                                    <td className="p-5 text-sm text-gray-600 font-medium">{student.phoneNo}</td>
                                    <td className="p-5 text-[10px] text-gray-400 font-bold uppercase">{new Date(student.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {students.length === 0 && (
                        <div className="p-20 text-center">
                            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">No students found for this institution</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
