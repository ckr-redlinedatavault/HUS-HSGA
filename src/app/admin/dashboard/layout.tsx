'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard' },
        { name: 'Calendar Manager', href: '/admin/dashboard/calendar' },
        {
            name: 'Forms',
            children: [
                { name: 'Student Admission', href: '/admin/dashboard/forms/student-admission' },
                { name: 'Trainer Registration', href: '/admin/dashboard/forms/trainer-registration' }
            ]
        },
        { name: 'Unified Systems', href: '/admin/dashboard/systems' },
        { name: 'Institutional Management', href: '/admin/dashboard/institutions' },
        { name: 'Settings', href: '/admin/dashboard/settings' },
    ];

    const toggleMenu = (name: string) => {
        setExpandedMenu(expandedMenu === name ? null : name);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-orange-600">HSGA Admin</h1>
                    <p className="text-xs text-gray-500">Unified Systems Control</p>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        // Handle Dropdown Items
                        if (item.children) {
                            const isExpanded = expandedMenu === item.name;
                            const isActive = item.children.some(child => pathname === child.href);

                            return (
                                <div key={item.name} className="space-y-1">
                                    <button
                                        onClick={() => toggleMenu(item.name)}
                                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive || isExpanded
                                            ? 'bg-orange-50 text-orange-600'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            {item.name}
                                        </span>
                                        <svg
                                            className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {isExpanded && (
                                        <div className="pl-4 space-y-1">
                                            {item.children.map((child) => {
                                                const isChildActive = pathname === child.href;
                                                return (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        className={`block px-4 py-2 text-sm rounded-lg transition-colors ${isChildActive
                                                            ? 'text-orange-600 bg-orange-50/50 font-medium'
                                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {child.name}
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        // Handle Standard Links
                        const isActive = item.href ? pathname === item.href : false;
                        return (
                            <Link
                                key={item.name}
                                href={item.href || '#'} // Fallback
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                    ? 'bg-orange-50 text-orange-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
