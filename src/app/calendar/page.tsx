'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from "next/image";
import Navbar from "@/components/Navbar";

// HSGA Event Data for 2026 (Fallback/Initial Data)
const initialHsgaEvents = [
    { date: '2026-01-12', title: 'National Youth Day', description: 'Programs on youth empowerment, leadership workshops, and rallies' },
    { date: '2026-01-26', title: 'Republic Day', description: 'Flag hoisting, march past & parade at schools and colleges' },
    { date: '2026-02-22', title: 'World Scout Day', description: 'Baden Powell Birthday celebration – scouting programs' },
    { date: '2026-02-28', title: 'National Science Day', description: 'Science exhibitions, workshops, and innovation challenges' },
    { date: '2026-03-04', title: 'National Safety Day', description: 'Awareness programs on industrial safety & disaster management' },
    { date: '2026-03-08', title: 'World Women’s Day', description: 'Women’s Day programs conducted by Guides (Girls)' },
    { date: '2026-04-07', title: 'World Health Day', description: 'Health awareness campaigns, blood donation & medical camps' },
    { date: '2026-05-11', title: 'Mother’s Day', description: 'Motivational classes on parental relations, essay writing, debates' },
    { date: '2026-05-31', title: 'Anti-Tobacco Day', description: 'Rallies and awareness campaigns on usage & ban of tobacco' },
    { date: '2026-06-05', title: 'World Environment Day', description: 'Plantation, Clean & Green, Swachh Bharat programs' },
    { date: '2026-06-21', title: 'World Yoga Day', description: 'Yoga events highlighting the necessity of yoga' },
    { date: '2026-06-26', title: 'Intl Day Against Drug Abuse', description: 'Anti-drug awareness campaigns, rallies, and workshops' },
    { date: '2026-08-15', title: 'Indian Independence Day', description: 'Flag hoisting, parades, pyramids & independence-related events' },
    { date: '2026-09-05', title: 'Teachers’ Day', description: 'Teachers’ Day celebrations' },
    { date: '2026-09-16', title: 'World Ozone Day', description: 'Awareness programs on “Save the Earth”' },
    { date: '2026-10-02', title: 'Gandhi Jayanti', description: 'Campaigns & competitions on Gandhiji’s role in freedom struggle' },
    { date: '2026-10-21', title: 'Police Commemoration Day', description: 'Prayers for police officers who sacrificed their lives' },
    { date: '2026-11-14', title: 'Children’s Day', description: 'Children’s Day programs, games, sports & events' },
    { date: '2026-11-26', title: 'HSGA Formation Day', description: 'Scouts & Guides programs, events, pyramids & HSGA scout flag hoisting' },
    { date: '2026-12-01', title: 'World AIDS Day', description: 'Health & medical camps, hospital service & HIV/AIDS awareness' },
    { date: '2026-12-10', title: 'Human Rights Day', description: 'Rallies and motivational classes on human rights' },
];

type CalendarEvent = {
    id?: string;
    date: string;
    title: string;
    description?: string | null;
}

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date()); // Start at current date
    const [events, setEvents] = useState<CalendarEvent[]>(initialHsgaEvents);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/events');
                if (res.ok) {
                    const dbEvents = await res.json();
                    // Merge DB events with initial events (or replace if preferred)
                    // Here we simply add them to the list. 
                    // In a production app you might want to deduplicate or treat DB as source of truth.
                    // For now, let's treat DB as additional dynamic events.
                    setEvents([...initialHsgaEvents, ...dbEvents]);
                }
            } catch (error) {
                console.error("Failed to fetch calendar events", error);
            }
        };
        fetchEvents();
    }, []);

    const daysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const firstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const getEventsForDay = (day: number) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return events.filter(e => e.date === dateStr);
    };

    const renderCalendarDays = () => {
        const totalDays = daysInMonth(currentDate);
        const startDay = firstDayOfMonth(currentDate);
        const days = [];

        // Empty spaces for previous month's days
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-32 bg-gray-50/50 border border-gray-100"></div>);
        }

        // Days of the month
        for (let i = 1; i <= totalDays; i++) {
            const isToday =
                i === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear();

            const dayEvents = getEventsForDay(i);

            days.push(
                <div key={i} className={`min-h-[8rem] h-auto border border-gray-100 p-2 relative group hover:bg-orange-50/30 transition-colors ${isToday ? 'bg-orange-50' : 'bg-white'}`}>
                    <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-orange-600 text-white' : 'text-gray-700'}`}>
                        {i}
                    </span>

                    <div className="mt-2 space-y-1">
                        {dayEvents.map((event, idx) => (
                            <div key={idx} className="text-xs bg-orange-100 text-orange-800 p-1.5 rounded border border-orange-200">
                                <div className="font-semibold truncate">{event.title}</div>
                                <div className="text-[10px] opacity-80 line-clamp-2 leading-tight">{event.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return days;
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 font-light selection:bg-orange-100">

            {/* Navbar (Reusable Component) */}
            <Navbar />

            {/* Official Circular Header */}
            <div className="bg-orange-50 w-full py-4 border-b border-orange-100">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center">
                    <div className="text-xs font-mono text-gray-500 mb-1 tracking-widest uppercase">
                        HSGA/TG/025/2026
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight uppercase">
                        HSGA-SCOUTS & GUIDES CALENDER
                    </h1>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-10 pb-20">

                {/* Calendar Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 z-40 relative">
                    <div className="text-center md:text-left">
                        <h2 className="text-xl font-normal text-gray-900">Event Schedule <span className="text-orange-600 font-bold">2026</span></h2>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-lg border border-gray-200 shadow-sm">
                        <button onClick={prevMonth} className="p-2 hover:bg-white rounded-md transition-colors text-gray-600 shadow-sm">
                            &larr; Prev
                        </button>
                        <span className="font-semibold text-gray-900 w-40 text-center text-lg">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>
                        <button onClick={nextMonth} className="p-2 hover:bg-white rounded-md transition-colors text-gray-600 shadow-sm">
                            Next &rarr;
                        </button>
                    </div>
                </div>

                {/* Calendar Grid Header */}
                <div className="grid grid-cols-7 border-b border-gray-200 bg-orange-600 text-white text-xs font-bold uppercase tracking-wider text-center py-3 rounded-t-xl">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                </div>

                {/* Calendar Grid Body */}
                <div className="grid grid-cols-7 border-l border-b border-gray-200 shadow-sm rounded-b-xl overflow-hidden">
                    {renderCalendarDays()}
                </div>

                {/* Additional Schedule Sections */}
                <div className="mt-16 grid md:grid-cols-2 gap-12">

                    {/* Summer Camps & Exams */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-light text-gray-900 border-b border-orange-200 pb-2 flex items-center gap-2">
                            <span className="w-2 h-8 bg-orange-600 rounded-full"></span>
                            Summer Camps & Exams
                        </h2>
                        <div className="bg-orange-50 rounded-2xl p-6 space-y-6">
                            {[
                                { title: "Summer Camp & Tour", date: "May – June", desc: "Scheduled in schools/colleges as per Holidays calendar." },
                                { title: "Trekking & Camp Fire", date: "November – December", desc: "Scheduled in schools/colleges as per their interest." },
                                { title: "Service at Pilgrimage", date: "Various Dates", desc: "Volunteering at temples like Yadadri, Medaram, and Bhadradri." },
                                { title: "State & National Programs", date: "As per Govt Guidelines", desc: "Participation in events by Ministry of Youth Affairs & Sports." },
                                { title: "Annual Examination", date: "As per Schedule", desc: "Examinations for Cubs, Bulbuls, Scouters, Guiders, Rangers & Rovers." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white text-orange-600 flex items-center justify-center font-bold shadow-sm shrink-0 border border-orange-100">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                        <p className="text-xs text-orange-600 font-medium mb-1 uppercase tracking-wide">{item.date}</p>
                                        <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Scouts & Guides Classes */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-light text-gray-900 border-b border-orange-200 pb-2 flex items-center gap-2">
                            <span className="w-2 h-8 bg-orange-600 rounded-full"></span>
                            Scouts & Guides Classes
                        </h2>
                        <div className="bg-gray-50 rounded-2xl p-6 space-y-6 border border-gray-100">
                            {[
                                { title: "Class Curriculum", desc: "Pledge, Drill, Motivational Classes, Yoga, Sports, Self Defence & Trekking." },
                                { title: "Monthly Events", desc: "Swatch Bharath, Clean & Green, Traffic Awareness, Medical Camps, Rallies, etc." },
                                { title: "Time-Table", desc: "26 periods per annum, with at least 10 Calendar Programs per year." },
                                { title: "Innovative Classes", desc: "Moral Values, Parental Relations, Indian Heritage, Helping the needy." },
                                { title: "Disaster Management", desc: "Special classes on First Aid, Fire Safety & Disaster Management." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-full bg-white text-gray-500 group-hover:text-orange-600 group-hover:bg-orange-50 flex items-center justify-center font-bold shadow-sm shrink-0 border border-gray-200 transition-colors">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">{item.title}</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </main>
        </div>
    );
}
