'use client';

import React, { useState } from 'react';
import { Icon } from '@vayva/ui';

export default function AdminPrivacyPage() {
    const [storeId, setStoreId] = useState('');
    const [identifier, setIdentifier] = useState(''); // email or phone
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Modal state
    const [showAnonymizeModal, setShowAnonymizeModal] = useState(false);
    const [reason, setReason] = useState('');

    const handleExport = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/privacy/dsr/export', {
                method: 'POST',
                body: JSON.stringify({ store_id: storeId, identifier })
            });
            if (res.ok) {
                const data = await res.json();
                // Enable download
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dsr-export-${identifier}.json`;
                a.click();
                setResult({ type: 'success', msg: 'Export downloaded' });
            } else {
                setResult({ type: 'error', msg: 'Export failed or not found' });
            }
        } catch (e) {
            setResult({ type: 'error', msg: 'Error exporting' });
        } finally {
            setLoading(false);
        }
    };

    const handleAnonymize = async () => {
        if (!reason) return alert('Reason required');
        setLoading(true);
        try {
            const res = await fetch('/api/admin/privacy/dsr/anonymize', {
                method: 'POST',
                body: JSON.stringify({ store_id: storeId, identifier, reason })
            });
            if (res.ok) {
                setResult({ type: 'success', msg: 'User Anonymized Successfully' });
                setShowAnonymizeModal(false);
                setReason('');
            } else {
                setResult({ type: 'error', msg: 'Anonymize failed' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRunRetention = async () => {
        if (!confirm('Run global retention purge?')) return;
        const res = await fetch('/api/admin/privacy/retention/run', { method: 'POST' });
        const data = await res.json();
        alert(`Retention job finished. Purged: ${data.purgedCount || 0}`);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Icon name="Shield" className="text-purple-600" /> Privacy Operations
            </h1>

            <div className="bg-white border rounded-xl p-8 mb-8">
                <h2 className="font-bold mb-4">Data Subject Request (DSR)</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Store ID</label>
                        <input
                            value={storeId} onChange={e => setStoreId(e.target.value)}
                            className="w-full border p-2 rounded" placeholder="e.g. store_123"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">User Identifier</label>
                        <input
                            value={identifier} onChange={e => setIdentifier(e.target.value)}
                            className="w-full border p-2 rounded" placeholder="Email or Phone"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleExport} disabled={loading}
                        className="bg-gray-100 text-gray-900 border border-gray-300 px-4 py-2 rounded font-bold hover:bg-gray-200"
                    >
                        Export Data (JSON)
                    </button>
                    <button
                        onClick={() => setShowAnonymizeModal(true)} disabled={loading}
                        className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded font-bold hover:bg-red-100"
                    >
                        Anonymize User (Delete PII)
                    </button>
                </div>

                {result && (
                    <div className={`mt-4 p-4 rounded text-sm font-bold ${result.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                        {result.msg}
                    </div>
                )}
            </div>

            <div className="bg-gray-50 border rounded-xl p-6">
                <h2 className="font-bold mb-2">Retention Jobs</h2>
                <p className="text-sm text-gray-500 mb-4">Manually trigger retention policies to purge old data.</p>
                <button
                    onClick={handleRunRetention}
                    className="border border-gray-300 bg-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-gray-100"
                >
                    Run Daily Retention
                </button>
            </div>

            {showAnonymizeModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl max-w-md w-full">
                        <h3 className="font-bold text-xl mb-4 text-red-600">Confirm Anonymization</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            This action will permanently scrub PII (Name, Email, Phone) from Customer and Order records. Financial history will be preserved. This cannot be undone.
                        </p>
                        <textarea
                            value={reason} onChange={e => setReason(e.target.value)}
                            className="w-full border p-2 rounded mb-4" placeholder="DSR Ticket Number / Reason (Required)"
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowAnonymizeModal(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                            <button onClick={handleAnonymize} className="bg-red-600 text-white px-4 py-2 rounded font-bold">Confirm Anonymize</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
