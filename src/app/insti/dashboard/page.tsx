'use client';

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

type InstiProfile = {
    uniqueId: string;
    instiName: string;
    instiType: string;
    headName: string;
    phoneNo: string;
    email: string;
    district: string;
    status: string;
    trainerId?: string;
    trainerName?: string;
    createdAt: string;
    isProfileComplete: boolean;
    udise?: string;
    management?: string;
    address?: string;
    mandal?: string;
    chairmanName?: string;
    chairmanMobile?: string;
    headPhone?: string;
    altPhone?: string;
    principalEmail?: string;
    coordinatorName?: string;
    coordinatorMobile?: string;
    enrollmentEstimate?: string;
    notes?: string;
    staffCount?: string;
    studentCount?: string;
    totalClasses?: string;
    feesCollected?: string;
    recentUpdates?: string;
    mouStatus?: string;
    mouStart?: string;
    mouEnd?: string;
};

export default function InstiDashboard() {
    const [profile, setProfile] = useState<InstiProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {
        if (profile && !profile.isProfileComplete) {
            setShowProfileModal(true);
        }
    }, [profile]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

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

    if (loading) return <div className="text-gray-400 font-medium">Loading overview...</div>;
    if (!profile) return null;

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

    const downloadERPTemplate = () => {
        const template = [
            {
                'School ID': profile?.uniqueId || 'INST-001',
                'School Name': profile?.instiName || 'School Name',
                'UDISE': '',
                'Management': '',
                'District': profile?.district || 'District',
                'Mandal': '',
                'Address': '',
                'Chairman Name': '',
                'Mobile number': '',
                'Head Name': '',
                'Head Phone': '',
                'Alternative number': '',
                'Principal mail id': '',
                'Email': profile?.email || '',
                'Coordinator': '',
                'Mobile number 2': '',
                'MoUStatus': 'PENDING',
                'MoUStart': 'YYYY-MM-DD',
                'MoUEnd': 'YYYY-MM-DD',
                'Enrollment Estimate': '',
                'Notes': '',
                'Staff Count': '',
                'Student Count': '',
                'Total Classes': '',
                'Fees Collected': '',
                'Recent Updates': ''
            }
        ];
        const ws = XLSX.utils.json_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "ERP_Template");
        XLSX.writeFile(wb, "ERP_Data_Template.xlsx");
    };

    const handleProfileFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws, { raw: false });

                if (data.length === 0) {
                    alert('No data found in file');
                    return;
                }

                // Map the first row to profile fields
                const row: any = data[0];
                const mappedProfile = {
                    udise: row['UDISE'] || '',
                    management: row['Management'] || '',
                    district: row['District'] || '',
                    mandal: row['Mandal'] || '',
                    address: row['Address'] || '',
                    chairmanName: row['Chairman Name'] || '',
                    chairmanMobile: row['Mobile number'] || '',
                    headName: row['Head Name'] || '',
                    headPhone: row['Head Phone'] || '',
                    altPhone: row['Alternative number'] || '',
                    principalEmail: row['Principal mail id'] || '',
                    email: row['Email'] || '',
                    coordinatorName: row['Coordinator'] || '',
                    coordinatorMobile: row['Mobile number 2'] || '',
                    mouStatus: row['MoUStatus'] || 'PENDING',
                    mouStart: row['MoUStart'] || '',
                    mouEnd: row['MoUEnd'] || '',
                    enrollmentEstimate: row['Enrollment Estimate'] || '',
                    notes: row['Notes'] || '',
                    staffCount: row['Staff Count'] || '',
                    studentCount: row['Student Count'] || '',
                    totalClasses: row['Total Classes'] || '',
                    feesCollected: row['Fees Collected'] || '',
                    recentUpdates: row['Recent Updates'] || '',
                };

                // Send to API
                const res = await fetch('/api/insti/profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(mappedProfile),
                });

                if (res.ok) {
                    alert('Profile updated via ERP upload successfully!');
                    window.location.reload();
                } else {
                    alert('Failed to update profile from file');
                }
            } catch (err) {
                console.error(err);
                alert('Failed to parse ERP file');
            }
        };
        reader.readAsBinaryString(file);
    };



    return (
        <div className="space-y-6 relative">
            {/* Header */}
            <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                        {profile.instiName}
                    </h1>
                    <p className="text-sm text-gray-500">Welcome to the HSGA Institutional Management Portal.</p>
                </div>
                <div className="md:text-right space-y-2">
                    <div className="flex flex-col md:items-end">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{formatDate(currentTime)}</p>
                        <p className="text-xl font-bold text-gray-900">{formatTime(currentTime)}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={downloadERPTemplate}
                            className="inline-flex items-center gap-2 bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Template
                        </button>
                        <button
                            onClick={() => document.getElementById('erp-upload')?.click()}
                            className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            Upload ERP File
                        </button>
                    </div>
                    <input
                        type="file"
                        id="erp-upload"
                        className="hidden"
                        accept=".xlsx, .xls"
                        onChange={(e) => handleProfileFileUpload(e)}
                    />
                </div>
            </div>

            {/* Profile Completion Warning */}
            {!profile.isProfileComplete && (
                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 flex gap-4 animate-pulse">
                    <div className="p-2 bg-orange-100 rounded-lg h-fit text-orange-600 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-[10px] font-bold text-orange-900 uppercase tracking-widest">Action Required</h3>
                        <p className="text-sm text-orange-800/80 leading-relaxed font-medium">
                            You must complete your institutional profile before you can add students.
                        </p>
                        <button
                            onClick={() => setShowProfileModal(true)}
                            className="mt-2 text-xs font-black uppercase tracking-widest text-orange-600 hover:text-orange-800 underline"
                        >
                            Complete Profile Now &rarr;
                        </button>
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm transition-all hover:border-orange-100 hover:shadow-orange-50/50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Verification Status</p>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${profile.status === 'APPROVED' ? 'bg-green-500' :
                            profile.status === 'PENDING' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></div>
                        <span className="font-bold text-gray-900 text-sm tracking-tight">{profile.status}</span>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm transition-all hover:border-orange-100 hover:shadow-orange-50/50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Institutional ID</p>
                    <p className="font-mono font-bold text-orange-600 text-sm">{profile.uniqueId}</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm transition-all hover:border-orange-100 hover:shadow-orange-50/50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Assigned Trainer</p>
                    <p className="font-bold text-gray-900 text-sm truncate">{profile.trainerName || profile.trainerId || 'Not Assigned'}</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm transition-all hover:border-orange-100 hover:shadow-orange-50/50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">District</p>
                    <p className="font-bold text-gray-900 text-sm">{profile.district}</p>
                </div>
            </div>

            {/* Student List Section */}
            {profile.status === 'APPROVED' && (
                <InstitutionalStudentsSection
                    uniqueId={profile.uniqueId}
                    schoolName={profile.instiName}
                    district={profile.district}
                    isProfileComplete={profile.isProfileComplete}
                />
            )}

            {!profile.status && profile.status !== 'APPROVED' && (
                /* Notice */
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg h-fit text-blue-600 flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">Administrative Note</h3>
                        <p className="text-sm text-blue-800/80 leading-relaxed font-medium">
                            Your institutional registration is under review. Please ensure all official documents are submitted to the State HQ for final approval.
                        </p>
                    </div>
                </div>
            )}

            {/* Profile Completion Modal */}
            {showProfileModal && (
                <ProfileCompletionModal
                    profile={profile}
                    onClose={() => setShowProfileModal(false)}
                    onUpdate={() => window.location.reload()} // Simple reload to refresh data
                />
            )}
        </div>
    );
}

function InstitutionalStudentsSection({ uniqueId, schoolName, district, isProfileComplete }: { uniqueId: string, schoolName: string, district: string, isProfileComplete: boolean }) {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        // School Data Fields
        // School ID and Name will be passed from props/profile
        udise: '',
        management: '',
        mandal: '',
        address: '',
        chairmanName: '',
        chairmanMobile: '',
        headName: '',
        headPhone: '',
        altPhone: '',
        principalEmail: '',
        email: '',
        coordinatorName: '',
        coordinatorMobile: '',
        mouStatus: 'PENDING',
        mouStart: '',
        mouEnd: '',
        enrollmentEstimate: '',
        notes: '',
        staffCount: '',
        studentCount: '',
        totalClasses: '',
        feesCollected: '',
        recentUpdates: ''
    });

    // Bulk Upload State
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkData, setBulkData] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [bulkError, setBulkError] = useState('');

    // Column Mapping State
    const [showMappingModal, setShowMappingModal] = useState(false);
    const [rawFileHeader, setRawFileHeader] = useState<string[]>([]);
    const [rawFileData, setRawFileData] = useState<any[]>([]);
    const [columnMapping, setColumnMapping] = useState<Record<string, string>>({
        udise: '',
        management: '',
        mandal: '',
        address: '',
        chairmanName: '',
        chairmanMobile: '',
        headName: '',
        headPhone: '',
        altPhone: '',
        principalEmail: '',
        email: '',
        coordinatorName: '',
        coordinatorMobile: '',
        mouStatus: '',
        mouStart: '',
        mouEnd: '',
        enrollmentEstimate: '',
        notes: '',
        staffCount: '',
        studentCount: '',
        totalClasses: '',
        feesCollected: '',
        recentUpdates: ''
    });

    const fetchStudents = () => {
        setLoading(true);
        fetch(`/api/trainer/schools/${uniqueId}/students`)
            .then(res => res.json())
            .then(data => {
                setStudents(Array.isArray(data) ? data : []);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchStudents();
    }, [uniqueId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setError('');

        try {
            const res = await fetch('/api/forms/student-admission', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    schoolName,
                    district,
                    instiId: uniqueId
                }),
            });

            if (res.ok) {
                setShowModal(false);
                setFormData({
                    udise: '',
                    management: '',
                    mandal: '',
                    address: '',
                    chairmanName: '',
                    chairmanMobile: '',
                    headName: '',
                    headPhone: '',
                    altPhone: '',
                    principalEmail: '',
                    email: '',
                    coordinatorName: '',
                    coordinatorMobile: '',
                    mouStatus: 'PENDING',
                    mouStart: '',
                    mouEnd: '',
                    enrollmentEstimate: '',
                    notes: '',
                    staffCount: '',
                    studentCount: '',
                    totalClasses: '',
                    feesCollected: '',
                    recentUpdates: ''
                });
                fetchStudents();
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to register student');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setFormLoading(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];

                // Get headers row
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                if (data.length === 0) {
                    setBulkError('File is empty');
                    return;
                }
                const headers = data[0] as string[];
                const rows = XLSX.utils.sheet_to_json(ws, { raw: false, dateNF: 'yyyy-mm-dd' }); // Full data

                setRawFileHeader(headers);
                setRawFileData(rows);

                // Smart Auto-Mapping
                const newMapping = { ...columnMapping };
                headers.forEach(h => {
                    const lower = h.toLowerCase().replace(/[^a-z0-9]/g, '');
                    if (['udise', 'schoolid'].includes(lower)) newMapping.udise = h;
                    if (['management', 'mgmt'].includes(lower)) newMapping.management = h;
                    if (['mandal', 'block'].includes(lower)) newMapping.mandal = h;
                    if (['address', 'location'].includes(lower)) newMapping.address = h;
                    if (['chairmanname', 'chairman'].includes(lower)) newMapping.chairmanName = h;
                    if (['mobilenumber', 'mobile', 'phone'].includes(lower)) newMapping.chairmanMobile = h; // Default mobile to chairman
                    if (['headname', 'headmaster', 'principal'].includes(lower)) newMapping.headName = h;
                    if (['headphone', 'principalphone'].includes(lower)) newMapping.headPhone = h;
                    if (['alternativenumber', 'altphone'].includes(lower)) newMapping.altPhone = h;
                    if (['principalmailid', 'principalemail'].includes(lower)) newMapping.principalEmail = h;
                    if (['email', 'instiemail'].includes(lower)) newMapping.email = h;
                    if (['coordinator', 'coordinatorname'].includes(lower)) newMapping.coordinatorName = h;
                    if (['mobilenumber2', 'coordinatormobile'].includes(lower)) newMapping.coordinatorMobile = h;
                    if (['moustatus'].includes(lower)) newMapping.mouStatus = h;
                    if (['moustart', 'startdate'].includes(lower)) newMapping.mouStart = h;
                    if (['mouend', 'enddate'].includes(lower)) newMapping.mouEnd = h;
                    if (['enrollmentestimate', 'enrollment'].includes(lower)) newMapping.enrollmentEstimate = h;
                    if (['notes', 'remarks'].includes(lower)) newMapping.notes = h;
                    if (['staffcount', 'staff'].includes(lower)) newMapping.staffCount = h;
                    if (['studentcount', 'students'].includes(lower)) newMapping.studentCount = h;
                    if (['totalclasses', 'classes'].includes(lower)) newMapping.totalClasses = h;
                    if (['feescollected', 'fees'].includes(lower)) newMapping.feesCollected = h;
                    if (['recentupdates', 'updates'].includes(lower)) newMapping.recentUpdates = h;
                });
                setColumnMapping(newMapping);
                setShowMappingModal(true);
                setBulkError('');
            } catch (err) {
                setBulkError('Failed to parse Excel file.');
            }
        };
        reader.readAsBinaryString(file);
    };

    const processMappedData = () => {
        // Relaxed Validation: Allow proceeding even if keys are missing
        // User requested "no mapping is required" -> proceed with partial matches

        const mappedData = rawFileData.map((item: any) => ({
            udise: item[columnMapping.udise] || '',
            management: item[columnMapping.management] || '',
            mandal: item[columnMapping.mandal] || '',
            address: item[columnMapping.address] || '',
            chairmanName: item[columnMapping.chairmanName] || '',
            chairmanMobile: item[columnMapping.chairmanMobile] || '',
            headName: item[columnMapping.headName] || '',
            headPhone: item[columnMapping.headPhone] || '',
            altPhone: item[columnMapping.altPhone] || '',
            principalEmail: item[columnMapping.principalEmail] || '',
            email: item[columnMapping.email] || '',
            coordinatorName: item[columnMapping.coordinatorName] || '',
            coordinatorMobile: item[columnMapping.coordinatorMobile] || '',
            mouStatus: item[columnMapping.mouStatus] || 'PENDING',
            mouStart: item[columnMapping.mouStart] || '',
            mouEnd: item[columnMapping.mouEnd] || '',
            enrollmentEstimate: item[columnMapping.enrollmentEstimate] || '',
            notes: item[columnMapping.notes] || '',
            staffCount: item[columnMapping.staffCount] || '',
            studentCount: item[columnMapping.studentCount] || '',
            totalClasses: item[columnMapping.totalClasses] || '',
            feesCollected: item[columnMapping.feesCollected] || '',
            recentUpdates: item[columnMapping.recentUpdates] || ''
        }));

        // Removed filter for empty UDISE - allow all rows even if empty/partial

        if (mappedData.length === 0) {
            setBulkError('No valid data found after mapping.');
            return;
        }

        setBulkData(mappedData);
        setShowMappingModal(false);
    };

    const handleBulkSubmit = async () => {
        if (bulkData.length === 0) return;
        setIsUploading(true);
        setBulkError('');

        try {
            const res = await fetch('/api/insti/students/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    students: bulkData,
                    schoolName,
                    district
                }),
            });

            if (res.ok) {
                setShowBulkModal(false);
                setBulkData([]);
                fetchStudents();
            } else {
                const data = await res.json();
                setBulkError(data.error || 'Bulk registration failed');
            }
        } catch (err) {
            setBulkError('An error occurred during upload.');
        } finally {
            setIsUploading(false);
        }
    };

    const downloadTemplate = () => {
        const template = [
            {
                'School ID': 'S123',
                'School Name': 'Sample School',
                'UDISE': 'UDISE123',
                'Management': 'Private',
                'District': 'Hyderabad',
                'Mandal': 'Mandal A',
                'Address': '123 Street',
                'Chairman Name': 'Mr. Chairman',
                'Mobile number': '9876543210',
                'Head Name': 'Mr. Head',
                'Head Phone': '9876543211',
                'Alternative number': '9876543212',
                'Principal mail id': 'principal@school.com',
                'Email': 'school@school.com',
                'Coordinator': 'Mr. Coord',
                'Mobile number 2': '9876543213',
                'MoUStatus': 'PENDING',
                'MoUStart': '2025-01-01',
                'MoUEnd': '2026-01-01',
                'Enrollment Estimate': '500',
                'Notes': 'Sample Notes',
                'Staff Count': '50',
                'Student Count': '450',
                'Total Classes': '12',
                'Fees Collected': '500000',
                'Recent Updates': 'None'
            }
        ];
        const ws = XLSX.utils.json_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "SchoolDataTemplate");
        XLSX.writeFile(wb, "School_Data_Entry_Template.xlsx");
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">School Data Entries</h2>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowBulkModal(true)}
                        disabled={!isProfileComplete}
                        className={`flex items-center gap-2 border px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${isProfileComplete
                            ? 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                            : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        title={!isProfileComplete ? "Complete profile first" : ""}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Bulk Upload
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        disabled={!isProfileComplete}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${isProfileComplete
                            ? 'bg-orange-600 text-white hover:bg-orange-700 shadow-orange-100'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                            }`}
                        title={!isProfileComplete ? "Complete profile first" : ""}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add School Entry
                    </button>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">School ID</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">School Name</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">UDISE</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Management</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">District</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mandal</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Address</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Chairman Name</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mobile Number</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Head Name</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Head Phone</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Alt Number</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Principal Email</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Coordinator</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mobile No 2</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">MoU Status</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">MoU Start</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">MoU End</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Enrollment Est.</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Notes</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Staff Count</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Count</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Classes</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Fees Collected</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent Updates</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={26} className="p-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Updating list...</td>
                                </tr>
                            ) : students.map((entry) => (
                                <tr key={entry.id} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="p-4 text-xs font-bold text-gray-900">{entry.instiId || uniqueId}</td>
                                    <td className="p-4 text-xs font-bold text-gray-900">{entry.schoolName || schoolName}</td>
                                    <td className="p-4 text-xs font-bold text-gray-900">{entry.udise || '-'}</td>
                                    <td className="p-4 text-xs text-gray-500 font-bold">{entry.management || '-'}</td>
                                    <td className="p-4 text-xs text-gray-500 font-bold">{entry.district || district}</td>
                                    <td className="p-4 text-xs text-gray-500 font-bold">{entry.mandal || '-'}</td>
                                    <td className="p-4 text-xs text-gray-500 font-bold max-w-xs truncate" title={entry.address}>{entry.address || '-'}</td>
                                    <td className="p-4 text-xs text-gray-500 font-bold">{entry.chairmanName || '-'}</td>
                                    <td className="p-4 text-xs text-gray-500 font-bold">{entry.chairmanMobile || '-'}</td>
                                    <td className="p-4 text-xs text-gray-500 font-bold">{entry.headName || '-'}</td>
                                    <td className="p-4 text-xs text-gray-500 font-bold">{entry.headPhone || '-'}</td>
                                    <td className="p-4 text-xs text-gray-500 font-bold">{entry.altPhone || '-'}</td>
                                    <td className="p-4 text-xs text-gray-500 font-bold">{entry.principalEmail || '-'}</td>
                                    <td className="p-4 text-xs text-gray-500 font-bold">{entry.instiEmail || entry.email || '-'}</td>
                                    <td className="p-4 text-xs text-gray-500 font-bold">{entry.coordinatorName || '-'}</td>
                                    <td className="p-4 text-xs text-gray-500 font-bold">{entry.coordinatorMobile || '-'}</td>
                                    <td className="p-4 text-xs text-gray-500 font-bold">
                                        <span className={`px-2 py-1 rounded-md text-[10px] ${entry.mouStatus === 'SIGNED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {entry.mouStatus || 'PENDING'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-xs text-gray-500 font-bold">{entry.mouStart || '-'}</td>
                                    <td className="p-4 text-xs text-gray-500 font-bold">{entry.mouEnd || '-'}</td>
                                    <td className="p-4 text-xs text-gray-500 font-bold">{entry.enrollmentEstimate || '-'}</td>
                                    <td className="p-4 text-xs text-gray-500 font-bold max-w-xs truncate">{entry.notes || '-'}</td>
                                    <td className="p-4 text-xs text-gray-500 font-bold">{entry.staffCount || '-'}</td>
                                    <td className="p-4 text-xs text-gray-500 font-bold">{entry.studentCount || '-'}</td>
                                    <td className="p-4 text-xs text-gray-500 font-bold">{entry.totalClasses || '-'}</td>
                                    <td className="p-4 text-xs text-gray-500 font-bold">{entry.feesCollected || '-'}</td>
                                    <td className="p-4 text-xs text-gray-500 font-bold max-w-xs truncate">{entry.recentUpdates || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!loading && students.length === 0 && (
                        <div className="p-10 text-center">
                            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">No entries found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Registration Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
                        <div className="bg-orange-600 p-6 text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-tight">Add School Data Entry</h3>
                                <p className="text-[10px] font-bold text-orange-100 uppercase tracking-widest">Adding to {schoolName}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-[10px] font-black uppercase tracking-widest">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Auto-filled / Read-only */}
                                <div className="space-y-1.5 opacity-60">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">School ID</label>
                                    <input disabled className="w-full bg-gray-100 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 cursor-not-allowed" value={uniqueId} />
                                </div>
                                <div className="space-y-1.5 opacity-60">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">School Name</label>
                                    <input disabled className="w-full bg-gray-100 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 cursor-not-allowed" value={schoolName} />
                                </div>
                                <div className="space-y-1.5 opacity-60 md:col-span-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">District</label>
                                    <input disabled className="w-full bg-gray-100 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 cursor-not-allowed" value={district} />
                                </div>

                                {/* Inputs */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">UDISE</label>
                                    <input required className="w-full input-field" value={formData.udise} onChange={(e) => setFormData({ ...formData, udise: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Management</label>
                                    <input required className="w-full input-field" value={formData.management} onChange={(e) => setFormData({ ...formData, management: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mandal</label>
                                    <input required className="w-full input-field" value={formData.mandal} onChange={(e) => setFormData({ ...formData, mandal: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Address</label>
                                    <input required className="w-full input-field" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                                </div>

                                <div className="md:col-span-2 pb-2 mt-2 border-b border-gray-100"><h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Key Contacts</h4></div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Chairman Name</label>
                                    <input className="w-full input-field" value={formData.chairmanName} onChange={(e) => setFormData({ ...formData, chairmanName: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
                                    <input className="w-full input-field" value={formData.chairmanMobile} onChange={(e) => setFormData({ ...formData, chairmanMobile: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Head Name</label>
                                    <input className="w-full input-field" value={formData.headName} onChange={(e) => setFormData({ ...formData, headName: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Head Phone</label>
                                    <input className="w-full input-field" value={formData.headPhone} onChange={(e) => setFormData({ ...formData, headPhone: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Alternative Number</label>
                                    <input className="w-full input-field" value={formData.altPhone} onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Principal Mail ID</label>
                                    <input type="email" className="w-full input-field" value={formData.principalEmail} onChange={(e) => setFormData({ ...formData, principalEmail: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                                    <input type="email" className="w-full input-field" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Coordinator</label>
                                    <input className="w-full input-field" value={formData.coordinatorName} onChange={(e) => setFormData({ ...formData, coordinatorName: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile Number 2</label>
                                    <input className="w-full input-field" value={formData.coordinatorMobile} onChange={(e) => setFormData({ ...formData, coordinatorMobile: e.target.value })} />
                                </div>

                                <div className="md:col-span-2 pb-2 mt-2 border-b border-gray-100"><h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Stats & Updates</h4></div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">MoU Status</label>
                                    <select className="w-full input-field" value={formData.mouStatus} onChange={(e) => setFormData({ ...formData, mouStatus: e.target.value })}>
                                        <option value="PENDING">PENDING</option>
                                        <option value="SIGNED">SIGNED</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">MoU Start</label>
                                    <input type="date" className="w-full input-field" value={formData.mouStart} onChange={(e) => setFormData({ ...formData, mouStart: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">MoU End</label>
                                    <input type="date" className="w-full input-field" value={formData.mouEnd} onChange={(e) => setFormData({ ...formData, mouEnd: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Enrollment Estimate</label>
                                    <input className="w-full input-field" value={formData.enrollmentEstimate} onChange={(e) => setFormData({ ...formData, enrollmentEstimate: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Staff Count</label>
                                    <input type="number" className="w-full input-field" value={formData.staffCount} onChange={(e) => setFormData({ ...formData, staffCount: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Student Count</label>
                                    <input type="number" className="w-full input-field" value={formData.studentCount} onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Total Classes</label>
                                    <input className="w-full input-field" value={formData.totalClasses} onChange={(e) => setFormData({ ...formData, totalClasses: e.target.value })} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Fees Collected</label>
                                    <input className="w-full input-field" value={formData.feesCollected} onChange={(e) => setFormData({ ...formData, feesCollected: e.target.value })} />
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Recent Updates</label>
                                    <textarea rows={2} className="w-full input-field" value={formData.recentUpdates} onChange={(e) => setFormData({ ...formData, recentUpdates: e.target.value })} />
                                </div>
                                <div className="md:col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Notes</label>
                                    <textarea rows={2} className="w-full input-field" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                                </div>
                            </div>

                            <style jsx>{`
                                .input-field {
                                    @apply bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-orange-500 transition-all;
                                }
                            `}</style>
                            <button
                                type="submit"
                                disabled={formLoading}
                                className="w-full bg-gray-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-gray-200 hover:shadow-orange-200 disabled:opacity-50"
                            >
                                {formLoading ? 'Saving Entry...' : 'Confirm Entry'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Column Mapping Modal */}
            {showMappingModal && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto flex flex-col max-h-[90vh]">
                        <div className="bg-orange-600 p-6 text-white flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-tight">Map Excel Columns</h3>
                                <p className="text-[10px] font-bold text-orange-100 uppercase tracking-widest">Match your file headers to system fields</p>
                            </div>
                            <button onClick={() => setShowMappingModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-8 space-y-4 overflow-y-auto">
                            <p className="text-sm text-gray-500 mb-4">We found the following columns in your file. Please select which column corresponds to each field below.</p>

                            {[
                                { key: 'udise', label: 'UDISE', required: true },
                                { key: 'management', label: 'Management', required: true },
                                { key: 'mandal', label: 'Mandal', required: true },
                                { key: 'address', label: 'Full Address', required: true },
                                { key: 'chairmanName', label: 'Chairman Name', required: false },
                                { key: 'chairmanMobile', label: 'Mobile Number', required: false },
                                { key: 'headName', label: 'Head Name', required: false },
                                { key: 'headPhone', label: 'Head Phone', required: false },
                                { key: 'altPhone', label: 'Alternative Number', required: false },
                                { key: 'principalEmail', label: 'Principal Mail ID', required: false },
                                { key: 'email', label: 'Email', required: false },
                                { key: 'coordinatorName', label: 'Coordinator', required: false },
                                { key: 'coordinatorMobile', label: 'Mobile Number 2', required: false },
                                { key: 'mouStatus', label: 'MoU Status', required: false },
                                { key: 'mouStart', label: 'MoU Start', required: false },
                                { key: 'mouEnd', label: 'MoU End', required: false },
                                { key: 'enrollmentEstimate', label: 'Enrollment Estimate', required: false },
                                { key: 'notes', label: 'Notes', required: false },
                                { key: 'staffCount', label: 'Staff Count', required: false },
                                { key: 'studentCount', label: 'Student Count', required: false },
                                { key: 'totalClasses', label: 'Total Classes', required: false },
                                { key: 'feesCollected', label: 'Fees Collected', required: false },
                                { key: 'recentUpdates', label: 'Recent Updates', required: false },
                            ].map((field) => (
                                <div key={field.key} className="space-y-1">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-orange-500 transition-all"
                                        value={columnMapping[field.key] || ''}
                                        onChange={(e) => setColumnMapping({ ...columnMapping, [field.key]: e.target.value })}
                                    >
                                        <option value="">-- Select Column --</option>
                                        {rawFileHeader.map((h, i) => (
                                            <option key={i} value={h}>{h}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 border-t border-gray-100 shrink-0">
                            <button
                                onClick={processMappedData}
                                className="w-full bg-gray-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-gray-200 hover:shadow-orange-200"
                            >
                                Import Data
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Upload Modal (Preview) */}
            {showBulkModal && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
                        <div className="bg-orange-600 p-6 text-white flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-tight">Bulk Student Upload</h3>
                                <p className="text-[10px] font-bold text-orange-100 uppercase tracking-widest">Excel Import Tool</p>
                            </div>
                            <button onClick={() => setShowBulkModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-8 space-y-6">
                            {bulkError && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-[10px] font-black uppercase tracking-widest">
                                    {bulkError}
                                </div>
                            )}

                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-3xl p-10 hover:border-orange-500 transition-colors bg-gray-50/50 group">
                                <input
                                    type="file"
                                    accept=".xlsx, .xls"
                                    className="hidden"
                                    id="excel-upload"
                                    onChange={handleFileUpload}
                                />
                                <label htmlFor="excel-upload" className="cursor-pointer flex flex-col items-center">
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 mb-1">Drop your Excel file here</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">or click to browse files</p>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest leading-none mb-1">New to bulk upload?</p>
                                        <p className="text-xs font-bold text-orange-900 leading-none">Use our formatted template</p>
                                    </div>
                                </div>
                                <button
                                    onClick={downloadTemplate}
                                    className="px-4 py-2 bg-white text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-orange-200 hover:bg-orange-100 transition-colors"
                                >
                                    Download Template
                                </button>
                            </div>

                            {bulkData.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data Preview ({bulkData.length} Students)</h4>
                                        <button onClick={() => setBulkData([])} className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:underline">Clear</button>
                                    </div>
                                    <div className="max-h-48 overflow-y-auto border border-gray-100 rounded-2xl">
                                        <table className="w-full text-left text-[10px]">
                                            <thead className="sticky top-0 bg-gray-50">
                                                <tr className="border-b border-gray-100">
                                                    <th className="p-2 font-black uppercase text-gray-500">Name</th>
                                                    <th className="p-2 font-black uppercase text-gray-500">Class</th>
                                                    <th className="p-2 font-black uppercase text-gray-500">Phone</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50 bg-white">
                                                {bulkData.slice(0, 5).map((row, i) => (
                                                    <tr key={i}>
                                                        <td className="p-2 font-bold">{row.studentName}</td>
                                                        <td className="p-2 text-gray-500">{row.className}</td>
                                                        <td className="p-2 text-gray-500">{row.phoneNo}</td>
                                                    </tr>
                                                ))}
                                                {bulkData.length > 5 && (
                                                    <tr>
                                                        <td colSpan={3} className="p-2 text-center text-gray-400 font-bold italic">... and {bulkData.length - 5} more</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <button
                                        onClick={handleBulkSubmit}
                                        disabled={isUploading}
                                        className="w-full bg-orange-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 disabled:opacity-50"
                                    >
                                        {isUploading ? 'Registering Students...' : 'Confirm and Register All'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


function ProfileCompletionModal({ profile, onClose, onUpdate }: { profile: InstiProfile & any, onClose: () => void, onUpdate: () => void }) {
    const [formData, setFormData] = useState({
        udise: profile.udise || '',
        management: profile.management || '',
        district: profile.district || '',
        mandal: profile.mandal || '',
        address: profile.address || '',
        chairmanName: profile.chairmanName || '',
        chairmanMobile: profile.chairmanMobile || '',
        headName: profile.headName || '',
        headPhone: profile.headPhone || '',
        altPhone: profile.altPhone || '',
        email: profile.email || '',
        principalEmail: profile.principalEmail || '',
        coordinatorName: profile.coordinatorName || '',
        coordinatorMobile: profile.coordinatorMobile || '',
        phoneNo: profile.phoneNo || '',
        enrollmentEstimate: profile.enrollmentEstimate || '',
        notes: profile.notes || '',
        staffCount: profile.staffCount || '',
        studentCount: profile.studentCount || '',
        totalClasses: profile.totalClasses || '',
        feesCollected: profile.feesCollected || '',
        recentUpdates: profile.recentUpdates || '',
        mouStatus: profile.mouStatus || 'PENDING',
        mouStart: profile.mouStart || '',
        mouEnd: profile.mouEnd || '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/insti/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                onUpdate();
                onClose();
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to update profile');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto max-h-[90vh] flex flex-col">
                <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-6 text-white flex justify-between items-center shrink-0">
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tight">Complete Institutional Profile</h3>
                        <p className="text-[10px] font-bold text-orange-100 uppercase tracking-widest">Mandatory Step</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-[10px] font-black uppercase tracking-widest">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Section 1: Basic Info */}
                        <div className="md:col-span-3 pb-2 border-b border-gray-100">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Basic Information</h4>
                        </div>

                        <div className="space-y-1.5 opacity-60">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">School ID</label>
                            <input disabled className="w-full input-field bg-gray-200 cursor-not-allowed text-gray-500" value={profile.uniqueId} />
                        </div>
                        <div className="space-y-1.5 opacity-60">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">School Name</label>
                            <input disabled className="w-full input-field bg-gray-100 cursor-not-allowed" value={profile.instiName} />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">UDISE Code</label>
                            <input required name="udise" className="w-full input-field" value={formData.udise} onChange={handleChange} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Management</label>
                            <input required name="management" className="w-full input-field" value={formData.management} onChange={handleChange} placeholder="e.g. Private, Govt" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">District</label>
                            <input required name="district" className="w-full input-field" value={formData.district} onChange={handleChange} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mandal</label>
                            <input required name="mandal" className="w-full input-field" value={formData.mandal} onChange={handleChange} />
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Address</label>
                            <input required name="address" className="w-full input-field" value={formData.address} onChange={handleChange} />
                        </div>

                        {/* Section 2: Contact Persons */}
                        <div className="md:col-span-3 pb-2 border-b border-gray-100 mt-4">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Key Contacts</h4>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Chairman Name</label>
                            <input required name="chairmanName" className="w-full input-field" value={formData.chairmanName} onChange={handleChange} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile number</label>
                            <input required name="chairmanMobile" className="w-full input-field" value={formData.chairmanMobile} onChange={handleChange} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Head Name</label>
                            <input required name="headName" className="w-full input-field" value={formData.headName} onChange={handleChange} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Head Phone</label>
                            <input required name="headPhone" className="w-full input-field" value={formData.headPhone} onChange={handleChange} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Alternative number</label>
                            <input name="altPhone" className="w-full input-field" value={formData.altPhone} onChange={handleChange} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Principal mail id</label>
                            <input required name="principalEmail" type="email" className="w-full input-field" value={formData.principalEmail} onChange={handleChange} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Coordinator</label>
                            <input name="coordinatorName" className="w-full input-field" value={formData.coordinatorName} onChange={handleChange} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile number 2</label>
                            <input name="coordinatorMobile" className="w-full input-field" value={formData.coordinatorMobile} onChange={handleChange} />
                        </div>

                        {/* Section 3: Stats & Report */}
                        <div className="md:col-span-3 pb-2 border-b border-gray-100 mt-4">
                            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Statistics & Reporting</h4>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Staff Count</label>
                            <input name="staffCount" type="number" className="w-full input-field" value={formData.staffCount} onChange={handleChange} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Student Count</label>
                            <input name="studentCount" type="number" className="w-full input-field" value={formData.studentCount} onChange={handleChange} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Total Classes</label>
                            <input name="totalClasses" className="w-full input-field" value={formData.totalClasses} onChange={handleChange} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Fees Collected</label>
                            <input name="feesCollected" className="w-full input-field" value={formData.feesCollected} onChange={handleChange} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Recent Updates</label>
                            <input name="recentUpdates" className="w-full input-field" value={formData.recentUpdates} onChange={handleChange} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">MoUStatus</label>
                            <select name="mouStatus" className="w-full input-field" value={formData.mouStatus} onChange={handleChange}>
                                <option value="PENDING">PENDING</option>
                                <option value="SIGNED">SIGNED</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">MoUStart</label>
                            <input name="mouStart" type="date" className="w-full input-field" value={formData.mouStart} onChange={handleChange} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">MoUEnd</label>
                            <input name="mouEnd" type="date" className="w-full input-field" value={formData.mouEnd} onChange={handleChange} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Enrollment Estimate</label>
                            <input name="enrollmentEstimate" className="w-full input-field" value={formData.enrollmentEstimate} onChange={handleChange} />
                        </div>
                        <div className="md:col-span-3 space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Notes</label>
                            <textarea rows={3} name="notes" className="w-full input-field" value={formData.notes} onChange={handleChange} />
                        </div>

                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-gray-200 hover:shadow-orange-200 disabled:opacity-50"
                        >
                            {loading ? 'Saving Profile...' : 'Save & Complete Profile'}
                        </button>
                    </div>
                </form>

                <style jsx>{`
                    .input-field {
                        @apply bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-orange-500 transition-all;
                    }
                `}</style>
            </div >
        </div >
    );
}
