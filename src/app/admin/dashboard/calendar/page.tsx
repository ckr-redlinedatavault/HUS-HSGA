'use client';

import { useState, useEffect } from 'react';

type Event = {
    id: string;
    title: string;
    date: string;
    description: string;
};

export default function CalendarManager() {
    const [events, setEvents] = useState<Event[]>([]);
    const [formData, setFormData] = useState({ title: '', date: '', description: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/events');
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to fetch events');
            }

            if (Array.isArray(data)) {
                setEvents(data);
                setError('');
            } else {
                setEvents([]);
                console.error('API returned non-array data:', data);
            }
        } catch (err: any) {
            console.error('Fetch error:', err);
            setError('Could not load events. Database might be syncing.');
            setEvents([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            setFormData({ title: '', date: '', description: '' });
            fetchEvents();
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        const res = await fetch(`/api/events?id=${id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            fetchEvents();
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">Manage Calendar Events</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
                    {error}
                </div>
            )}

            {/* Add Event Form */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
                    Add New Event
                </h2>
                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">Event Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white text-gray-900 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-gray-400"
                            placeholder="e.g. Annual Scout Rally"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">Event Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white text-gray-900 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-gray-900 placeholder:text-gray-400"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-1">Description (Optional)</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white text-gray-900 focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all h-32 resize-none placeholder:text-gray-400"
                            placeholder="Details about the event..."
                        />
                    </div>
                    <div className="md:col-span-2 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-200 disabled:opacity-50 disabled:shadow-none font-semibold transition-all w-full md:w-auto"
                        >
                            {loading ? 'Adding Event...' : 'Add Event to Calendar'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Events List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-900">Current Events ({events.length})</h2>
                </div>
                <div className="divide-y divide-gray-100">
                    {events.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 italic">No events found. Add one above!</div>
                    ) : (
                        events.map((event) => (
                            <div key={event.id} className="p-5 flex items-center justify-between hover:bg-orange-50/30 transition-colors group">
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-700 transition-colors">{event.title}</h3>
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="font-mono text-orange-600 bg-orange-50 px-2 py-0.5 rounded text-xs border border-orange-100">{event.date}</span>
                                        {event.description && <span className="text-gray-500 text-xs truncate max-w-md">{event.description}</span>}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(event.id)}
                                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all"
                                    title="Delete Event"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
