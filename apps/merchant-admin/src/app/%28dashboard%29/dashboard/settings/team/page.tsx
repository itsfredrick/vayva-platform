'use client';

import React, { useState } from 'react';

export default function TeamSettingsPage() {
    const [invited, setInvited] = useState(false);

    // Mock Data
    const members = [
        { id: '1', name: 'Fredrick (You)', email: 'fred@vayva.com', role: 'owner', status: 'active' },
        { id: '2', name: 'Sarah Ops', email: 'sarah@vayva.com', role: 'support', status: 'active' }
    ];

    const invites = [
        { id: 'inv_1', email: 'finance@external.com', role: 'finance', status: 'pending' }
    ];

    const handleInvite = () => {
        // Call API
        setInvited(true);
        setTimeout(() => setInvited(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Team Management</h1>
                    <p className="text-gray-500">Manage access and roles.</p>
                </div>
                <button
                    onClick={handleInvite}
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                    {invited ? 'Invite Sent!' : 'Invite Member'}
                </button>
            </div>

            <div className="bg-white border rounded-xl overflow-hidden shadow-sm mb-8">
                <div className="px-6 py-4 bg-gray-50 border-b flex justify-between">
                    <h3 className="font-medium">Active Members</h3>
                    <span className="text-sm text-gray-500">2 / 5 Seats Used</span>
                </div>
                <ul className="divide-y">
                    {members.map(m => (
                        <li key={m.id} className="px-6 py-4 flex justify-between items-center">
                            <div>
                                <div className="font-medium">{m.name}</div>
                                <div className="text-sm text-gray-500">{m.email}</div>
                            </div>
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs uppercase font-bold tracking-wide">
                                {m.role}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-gray-50 border-b">
                    <h3 className="font-medium">Pending Invites</h3>
                </div>
                <ul className="divide-y">
                    {invites.map(i => (
                        <li key={i.id} className="px-6 py-4 flex justify-between items-center">
                            <div>
                                <div className="font-medium">{i.email}</div>
                                <div className="text-sm text-gray-500">Promised Role: {i.role}</div>
                            </div>
                            <span className="text-yellow-600 text-sm font-medium">Pending</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
