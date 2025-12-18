'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@vayva/ui';

export default function PartnersPage() {
    const [partners, setPartners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [newType, setNewType] = useState('affiliate');

    const loadPartners = () => {
        setLoading(true);
        fetch('/api/admin/partners')
            .then(res => res.json())
            .then(data => {
                setPartners(data.partners || []);
                setLoading(false);
            });
    };

    useEffect(() => { loadPartners(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/admin/partners', {
            method: 'POST',
            body: JSON.stringify({ name: newName, type: newType })
        });
        setCreating(false);
        setNewName('');
        loadPartners();
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Partners & Affiliates</h1>
                <button
                    onClick={() => setCreating(true)}
                    className="bg-black text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                >
                    <Icon name="Plus" size={16} /> New Partner
                </button>
            </div>

            {creating && (
                <form onSubmit={handleCreate} className="bg-gray-50 p-4 rounded-xl mb-8 border border-gray-200 flex gap-4 items-end">
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Name</label>
                        <input value={newName} onChange={e => setNewName(e.target.value)} className="border p-2 rounded w-64" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase mb-1">Type</label>
                        <select value={newType} onChange={e => setNewType(e.target.value)} className="border p-2 rounded w-40 bg-white">
                            <option value="affiliate">Affiliate</option>
                            <option value="dispatch">Dispatch</option>
                            <option value="agency">Agency</option>
                            <option value="influencer">Influencer</option>
                        </select>
                    </div>
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-bold">Save</button>
                    <button type="button" onClick={() => setCreating(false)} className="text-gray-500 font-bold px-2">Cancel</button>
                </form>
            )}

            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-bold text-gray-500">Partner</th>
                            <th className="p-4 font-bold text-gray-500">Type</th>
                            <th className="p-4 font-bold text-gray-500">Status</th>
                            <th className="p-4 font-bold text-gray-500">Attributions</th>
                            <th className="p-4 font-bold text-gray-500">Created</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {partners.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50">
                                <td className="p-4 font-bold">{p.name}</td>
                                <td className="p-4 capitalize"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">{p.type}</span></td>
                                <td className="p-4 capitalize">{p.status}</td>
                                <td className="p-4">{p._count.attributions}</td>
                                <td className="p-4 text-gray-500 text-sm">{new Date(p.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {partners.length === 0 && !loading && (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-400">No partners yet</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
