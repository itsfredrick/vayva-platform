'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon } from '@vayva/ui';
import { api } from '@/services/api';

export default function ApiKeysPage() {
    const [keys, setKeys] = useState<any[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newKey, setNewKey] = useState<any>(null);

    const fetchKeys = async () => {
        const res = await api.get('/webhooks/api-keys');
        setKeys(res.data || []);
    };

    useEffect(() => {
        fetchKeys();
    }, []);

    const handleCreate = async (name: string, scopes: string[]) => {
        const res = await api.post('/webhooks/api-keys', { name, scopes });
        setNewKey(res.data);
        setShowCreateModal(false);
        fetchKeys();
    };

    return (
        <AdminShell title="API Keys" breadcrumb="Integrations">
            <div className="max-w-5xl mx-auto flex flex-col gap-8">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0B1220]">API Keys</h1>
                        <p className="text-[#525252]">Manage API access to your store.</p>
                    </div>
                    <Button onClick={() => setShowCreateModal(true)}>
                        <Icon name="Plus" size={16} className="mr-2" />
                        Create API Key
                    </Button>
                </div>

                {newKey && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <h3 className="font-bold text-green-900 mb-2">API Key Created!</h3>
                        <p className="text-sm text-green-700 mb-4">Copy this key now. You won't be able to see it again.</p>
                        <div className="bg-white rounded-lg p-3 font-mono text-sm break-all">
                            {newKey.rawKey}
                        </div>
                        <Button size="sm" className="mt-4" onClick={() => setNewKey(null)}>Done</Button>
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Scopes</th>
                                <th className="px-6 py-4">Last Used</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {keys.length === 0 ? (
                                <tr><td colSpan={5} className="p-12 text-center text-gray-400">No API keys yet.</td></tr>
                            ) : (
                                keys.map(key => (
                                    <tr key={key.id}>
                                        <td className="px-6 py-4 font-medium text-[#0B1220]">{key.name}</td>
                                        <td className="px-6 py-4 text-[#525252]">
                                            {key.scopes.slice(0, 2).join(', ')}
                                            {key.scopes.length > 2 && ` +${key.scopes.length - 2} more`}
                                        </td>
                                        <td className="px-6 py-4 text-[#525252]">
                                            {key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : 'Never'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${key.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'
                                                }`}>
                                                {key.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm">Revoke</Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </AdminShell>
    );
}
