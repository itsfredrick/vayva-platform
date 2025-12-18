'use client';

import React, { useState } from 'react';
import { Icon } from '@vayva/ui';
import Link from 'next/link';

export default function MerchantListPage() {
    const [q, setQ] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [searching, setSearching] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setSearching(true);
        try {
            const res = await fetch(`/api/admin/merchants?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            setResults(data.merchants || []);
        } finally {
            setSearching(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Merchants</h1>
            </div>

            <form onSubmit={handleSearch} className="mb-8 flex gap-2 max-w-lg">
                <input
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    type="text"
                    placeholder="Search name or slug..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                />
                <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg font-bold">
                    {searching ? '...' : 'Search'}
                </button>
            </form>

            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-bold text-gray-500">Store</th>
                            <th className="px-6 py-3 font-bold text-gray-500">Plan</th>
                            <th className="px-6 py-3 font-bold text-gray-500">Live Status</th>
                            <th className="px-6 py-3 font-bold text-gray-500">Created</th>
                            <th className="px-6 py-3 font-bold text-gray-500"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {results.map((m) => (
                            <tr key={m.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900">{m.name}</div>
                                    <div className="text-xs text-gray-500">/{m.slug}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="uppercase text-xs font-bold bg-gray-100 px-2 py-1 rounded">
                                        {m.subscription?.planSlug || 'Growth'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {m.isLive ? (
                                        <span className="text-green-600 font-bold flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full" /> Live</span>
                                    ) : (
                                        <span className="text-gray-400">Offline</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-gray-500">{new Date(m.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/admin/merchants/${m.id}`} className="text-blue-600 font-bold hover:underline">
                                        Manage
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {results.length === 0 && !searching && (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-400">No merchants found. Try searching.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
