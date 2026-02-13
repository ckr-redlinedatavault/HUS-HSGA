'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function InstiLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const menuItems = [
        {
            name: 'Overview', href: '/insti/dashboard', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            )
        },
        {
            name: 'Settings', href: '/insti/dashboard/settings', icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            )
        },
    ];

    const handleLogout = async () => {
        await fetch('/api/insti/logout', { method: 'POST' });
        router.push('/insti/login');
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] flex">
            {/* Sidebar Desktop */}
            <aside className={`fixed inset-y-0 left-0 z-50 bg-orange-600 border-r border-orange-700 transition-all duration-300 flex flex-col translate-x-0 ${isSidebarOpen ? 'w-64' : 'w-20'} hidden md:flex`}>
                <div className="p-4 h-20 flex items-center border-b border-orange-500/30">
                    <div className="relative w-10 h-10 flex-shrink-0 bg-white rounded-lg p-1.5 shadow-sm">
                        <Image
                            src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770199908/1769454781522_pgepvr.png"
                            alt="HSGA Official Logo"
                            fill
                            className="object-contain p-0.5"
                        />
                    </div>
                    {isSidebarOpen && (
                        <div className="ml-3 overflow-hidden whitespace-nowrap">
                            <h1 className="font-bold text-white text-sm tracking-tight leading-tight uppercase font-black">Institutional</h1>
                            <p className="text-[10px] font-bold text-orange-200 uppercase tracking-[0.2em] leading-none mt-0.5">HSGA Telangana</p>
                        </div>
                    )}
                </div>
                <nav className="flex-grow p-4 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${pathname === item.href
                                    ? 'bg-white text-orange-600 shadow-md'
                                    : 'text-orange-100 hover:bg-orange-500/50 hover:text-white'
                                }`}
                        >
                            <span className="flex-shrink-0">{item.icon}</span>
                            {isSidebarOpen && <span className="font-bold text-[10px] uppercase tracking-widest">{item.name}</span>}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-orange-500/30">
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="w-full flex justify-center p-2 text-orange-200 hover:text-white rounded-lg hover:bg-orange-500/50"
                    >
                        <svg className={`w-5 h-5 transition-transform ${!isSidebarOpen && 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
                    </button>
                </div>
            </aside>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)} />
            )}

            {/* Sidebar Mobile */}
            <aside className={`fixed inset-y-0 left-0 z-[70] bg-orange-600 w-64 border-r border-orange-700 transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 h-20 flex items-center border-b border-orange-500/30">
                    <div className="relative w-10 h-10 bg-white rounded-lg p-1.5 flex-shrink-0 shadow-sm">
                        <Image
                            src="https://res.cloudinary.com/dsqqrpzfl/image/upload/v1770199908/1769454781522_pgepvr.png"
                            alt="HSGA Logo"
                            fill
                            className="object-contain p-0.5"
                        />
                    </div>
                    <span className="ml-3 font-bold text-white tracking-tight">HSGA Institutional</span>
                </div>
                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${pathname === item.href ? 'bg-white text-orange-600 shadow-md' : 'text-orange-100 hover:bg-orange-500/50 hover:text-white'
                                }`}
                        >
                            {item.icon}
                            <span className="font-bold text-xs uppercase tracking-widest">{item.name}</span>
                        </Link>
                    ))}
                    <div className="pt-4 mt-4 border-t border-orange-500/30">
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3 py-3 text-red-600 bg-red-50 border border-red-100 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Logout
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className={`flex-grow flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                <header className="h-16 bg-white border-b border-gray-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 text-gray-400 hover:text-orange-600 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                        <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] leading-none">
                            {menuItems.find(i => i.href === pathname)?.name || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={handleLogout} className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm active:transform active:scale-95">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Logout
                        </button>
                    </div>
                </header>

                <main className="p-4 md:p-8 w-full flex-grow">
                    {children}
                </main>
            </div>
        </div>
    );
}
