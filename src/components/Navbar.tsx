'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <nav className="w-full z-50 bg-white border-b border-gray-100 flex-none h-20">
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">

                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-4">
                    <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                            src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770199908/1769454781522_pgepvr.png"
                            alt="HSGA Official Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900 leading-tight">
                            Hindustan Scouts and Guides
                        </span>
                        <span className="text-xs text-orange-600 font-medium">
                            Association, Telangana State
                        </span>
                    </div>
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-8 text-sm text-gray-500 font-normal relative">
                    <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>

                    {/* Forms Dropdown */}
                    <div
                        className="relative group h-full flex items-center"
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        <button className="flex items-center gap-1 hover:text-orange-600 transition-colors focus:outline-none py-6">
                            Forms
                            <svg className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        <div
                            className={`absolute top-full left-0 w-72 bg-white border border-gray-100 shadow-xl rounded-xl p-2 transition-all duration-200 origin-top-left z-50 ${isDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                        >
                            <div className="flex flex-col text-left">
                                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Admissions & Enrollment</div>
                                <Link href="/forms/student-admission" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-lg text-sm">Institutional Admission Form</Link>
                                <Link href="/forms/insti-registration" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-lg text-sm">Institution Registration Form</Link>
                                <Link href="/forms/trainer-registration" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-lg text-sm">Trainer Registration Form</Link>

                                <div className="border-t border-gray-100 my-2"></div>

                                <Link href="/trainer/login" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-lg text-sm">Trainer Login</Link>
                                <Link href="/insti/login" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-lg text-sm">Institutional Login</Link>
                                <Link href="/calendar" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded-lg text-sm font-medium">Download Calendar</Link>

                            </div>
                        </div>
                    </div>

                    <Link href="/calendar" className="hover:text-orange-600 transition-colors">Calendar</Link>
                    <Link href="#" className="hover:text-orange-600 transition-colors">About Organization</Link>
                    <Link href="#" className="hover:text-orange-600 transition-colors">Unified Systems</Link>
                    <Link href="#" className="hover:text-orange-600 transition-colors">Contact</Link>

                    {/* Login Button */}
                    <Link href="/admin/login" className="px-5 py-2.5 rounded-full bg-orange-600 text-white hover:bg-orange-700 transition-all font-medium text-xs shadow-sm hover:shadow-orange-200 ml-2">
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    );
}
