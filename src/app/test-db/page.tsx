'use client';

import { useState } from 'react';

export default function TestDBPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [status, setStatus] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Submitting...');

        try {
            const res = await fetch('/api/test-db', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (result.success) {
                setStatus('Success! Data saved to DB.');
                setFormData({ name: '', email: '', message: '' });
            } else {
                setStatus('Error: ' + result.error);
            }
        } catch (error) {
            console.error(error);
            setStatus('Details: ' + error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
            <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center text-orange-500">Database Connection Test</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-orange-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-orange-500 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Message</label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-orange-500 outline-none h-24"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 rounded transition-colors font-bold"
                    >
                        Test Connection
                    </button>
                </form>

                {status && (
                    <div className={`mt-4 p-3 rounded text-center ${status.includes('Success') ? 'bg-green-600' : 'bg-red-600'}`}>
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
}
