'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface PreferenceState {
    phoneMasked: string;
    marketingOptIn: boolean;
    transactionalAllowed: boolean;
    fullyBlocked: boolean;
}

export default function PreferenceForm({ token, initialState }: { token: string; initialState: PreferenceState }) {
    const [state, setState] = useState(initialState);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const handleSave = async () => {
        setSaving(true);
        setMessage('');

        try {
            const res = await fetch(`/api/preferences/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    marketingOptIn: state.marketingOptIn,
                    transactionalAllowed: state.transactionalAllowed,
                    fullyBlocked: state.fullyBlocked
                })
            });

            if (res.ok) {
                setMessage('Preferences saved successfully.');
            } else {
                setMessage('Failed to save. Please try again.');
            }
        } catch (e) {
            setMessage('An error occurred.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Marketing */}
            <div className="flex items-start space-x-4">
                <div className="flex h-5 items-center">
                    <input
                        id="marketing"
                        name="marketing"
                        type="checkbox"
                        disabled={state.fullyBlocked}
                        checked={state.marketingOptIn && !state.fullyBlocked}
                        onChange={(e) => setState({ ...state, marketingOptIn: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 disabled:opacity-50"
                    />
                </div>
                <div className="text-sm">
                    <label htmlFor="marketing" className="font-medium text-gray-900">
                        Offers & Promotions
                    </label>
                    <p className="text-gray-500">
                        Receive discounts, new arrival alerts, and exclusive offers.
                    </p>
                </div>
            </div>

            {/* Transactional */}
            <div className="flex items-start space-x-4">
                <div className="flex h-5 items-center">
                    <input
                        id="transactional"
                        name="transactional"
                        type="checkbox"
                        disabled={state.fullyBlocked}
                        checked={state.transactionalAllowed && !state.fullyBlocked}
                        onChange={(e) => setState({ ...state, transactionalAllowed: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 disabled:opacity-50"
                    />
                </div>
                <div className="text-sm">
                    <label htmlFor="transactional" className="font-medium text-gray-900">
                        Order Updates
                    </label>
                    <p className="text-gray-500">
                        Get message updates about your order status, delivery, and support.
                    </p>
                </div>
            </div>

            <hr className="border-gray-100" />

            {/* Block All */}
            <div className="flex items-start space-x-4 bg-red-50 p-4 rounded-lg">
                <div className="flex h-5 items-center">
                    <input
                        id="blockAll"
                        name="blockAll"
                        type="checkbox"
                        checked={state.fullyBlocked}
                        onChange={(e) => setState({ ...state, fullyBlocked: e.target.checked })}
                        className="h-4 w-4 rounded border-red-300 text-red-600 focus:ring-red-600"
                    />
                </div>
                <div className="text-sm">
                    <label htmlFor="blockAll" className="font-medium text-red-900">
                        Block all messages
                    </label>
                    <p className="text-red-700 mt-1">
                        Stop all WhatsApp messages, including delivery updates and receipts.
                    </p>
                </div>
            </div>

            <div className="pt-2">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                >
                    {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {saving ? 'Saving...' : 'Save Preferences'}
                </button>
                {message && (
                    <p className={`mt-3 text-sm text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}

// Dummy export to satisfy Next.js if it accidentally tries to route here directly (it shouldn't)
// But wait, page.tsx imports this.
