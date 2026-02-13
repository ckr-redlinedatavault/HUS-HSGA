'use client';

import { useState } from 'react';
import Navbar from "@/components/Navbar";

export default function StudentAdmissionForm() {
    const [formData, setFormData] = useState({
        district: '',
        schoolName: '',
        studentName: '',
        fatherName: '',
        dob: '',
        className: '',
        aadharNo: '',
        address: '',
        phoneNo: '',
        studentSignature: '',
        principalSignature: '',
        seal: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [agreements, setAgreements] = useState({
        student: false,
        principal: false
    });

    // Regex Patterns
    const patterns = {
        text: /^[a-zA-Z\s\.]+$/, // Only letters, spaces, dots
        phone: /^[6-9]\d{9}$/, // Indian phone numbers (10 digits, starts with 6-9)
        aadhar: /^\d{12}$/, // 12 digit numeric
        alphanumeric: /^[a-zA-Z0-9\s\-\/]+$/, // Class name can have numbers, slashes
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Real-time Validation (Optional: prevent invalid input)
        if (name === 'phoneNo' || name === 'aadharNo') {
            if (!/^\d*$/.test(value)) return; // Only allow numbers
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            const file = files[0];

            if (file.size > 1024 * 1024) { // 1MB limit
                alert('File size must be less than 1MB');
                e.target.value = ''; // Reset input
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, [name]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        if (!patterns.text.test(formData.district)) return "District Name should contain only letters.";
        if (!patterns.text.test(formData.schoolName)) return "School Name should contain only letters/dots.";
        if (!patterns.text.test(formData.studentName)) return "Student Name should contain only letters.";
        if (!patterns.text.test(formData.fatherName)) return "Father Name should contain only letters.";
        if (!patterns.alphanumeric.test(formData.className)) return "Class Name contains invalid characters.";
        if (!patterns.aadhar.test(formData.aadharNo)) return "Aadhar Number must be exactly 12 digits.";
        if (!patterns.phone.test(formData.phoneNo)) return "Phone Number must be a valid 10-digit Indian number.";
        if (formData.address.length < 10) return "Address is too short.";

        if (!agreements.student) return "Student must agree to the declaration.";
        if (!agreements.principal) return "Principal/Coordinator must agree to the declaration.";

        return null; // No errors
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
            window.scrollTo(0, 0); // Scroll to error
            return;
        }

        try {
            const res = await fetch('/api/forms/student-admission', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSuccess(true);
                window.scrollTo(0, 0);
            } else {
                const data = await res.json();
                setError(data.error || 'Submission failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center p-6">
                    <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Successful!</h2>
                        <p className="text-gray-600 mb-6">Your admission form has been submitted successfully to the administration.</p>
                        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">Submit Another</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-light selection:bg-orange-100">
            <Navbar />

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

                    {/* Header */}
                    <div className="bg-orange-600 p-8 text-center text-white">
                        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wide mb-2">Student Admission Form</h1>
                        <p className="text-orange-100 text-sm font-medium">Hindustan Scouts and Guides Association, Telangana</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* Section 1: Student Details */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Student Details</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">District <span className="text-red-500">*</span></label>
                                    <input name="district" required type="text" onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Name of School/College <span className="text-red-500">*</span></label>
                                    <input name="schoolName" required type="text" onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Name of Student <span className="text-red-500">*</span></label>
                                    <input name="studentName" required type="text" onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Father Name <span className="text-red-500">*</span></label>
                                    <input name="fatherName" required type="text" onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Date of Birth <span className="text-red-500">*</span></label>
                                    <input name="dob" required type="date" onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Class <span className="text-red-500">*</span></label>
                                    <input name="className" required type="text" onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Student Aadhar No. <span className="text-red-500">*</span></label>
                                    <input name="aadharNo" required type="text" onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phone No. <span className="text-red-500">*</span></label>
                                    <input name="phoneNo" required type="tel" onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Address <span className="text-red-500">*</span></label>
                                    <textarea name="address" required onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all h-24 resize-none"></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Declarations */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Student Declaration</h2>
                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex gap-3 items-start">
                                <input
                                    type="checkbox"
                                    id="studentAgreement"
                                    checked={agreements.student}
                                    onChange={(e) => setAgreements(prev => ({ ...prev, student: e.target.checked }))}
                                    className="mt-1 w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500 cursor-pointer"
                                />
                                <label htmlFor="studentAgreement" className="text-sm text-gray-700 italic leading-relaxed cursor-pointer">
                                    "I, Mr./Ms. <strong>{formData.studentName || '_________'}</strong>, voluntarily wish to join the Hindustan Scouting/Guiding Program in my School/College. I understand and agree to actively participate in all indoor and outdoor activities conducted as part of the program." <span className="text-red-500 font-bold">*</span>
                                </label>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Student Signature (Image &lt; 1MB) <span className="text-red-500">*</span></label>
                                <input name="studentSignature" required type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Declaration By Co-Ordinator / Principal</h2>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex gap-3 items-start">
                                <input
                                    type="checkbox"
                                    id="principalAgreement"
                                    checked={agreements.principal}
                                    onChange={(e) => setAgreements(prev => ({ ...prev, principal: e.target.checked }))}
                                    className="mt-1 w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500 cursor-pointer"
                                />
                                <label htmlFor="principalAgreement" className="text-sm text-gray-700 italic leading-relaxed cursor-pointer">
                                    "We have gone through the contents of this Scouting/Guiding programmed by our authorities and we support to conduct both the indoor and outdoor Scouting /Guiding program by our students, we have no objectionable contents in implementing this program in our school/College." <span className="text-red-500 font-bold">*</span>
                                </label>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Principal/Coordinator Signature (Image &lt; 1MB) <span className="text-red-500">*</span></label>
                                    <input name="principalSignature" required type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">School Seal (Image &lt; 1MB) <span className="text-red-500">*</span></label>
                                    <input name="seal" required type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-orange-600 text-white font-bold rounded-xl shadow-lg hover:bg-orange-700 hover:shadow-orange-200 transition-all disabled:opacity-50 text-lg uppercase tracking-wide"
                            >
                                {loading ? 'Submitting Application...' : 'Submit Application'}
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
}
