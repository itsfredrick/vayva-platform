'use client';

import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';

interface StoreProfile {
    id: string;
    name: string;
    slug: string;
    businessType: string;
    description: string;
    supportEmail: string;
    supportPhone: string;
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
    };
}

const BUSINESS_TYPES = [
    { value: 'retail', label: 'Retail' },
    { value: 'food', label: 'Food & Beverage' },
    { value: 'services', label: 'Services' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'other', label: 'Other' },
];

export default function StoreProfilePage() {
    const [profile, setProfile] = useState<StoreProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/account/store');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setProfile(data);
        } catch (error) {
            console.error('Failed to load store profile', error);
            setMessage({ type: 'error', text: 'Failed to load store profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/account/store', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
            });

            if (!res.ok) throw new Error('Failed to update');

            setMessage({ type: 'success', text: 'Store profile updated successfully!' });

            // Refresh data
            await fetchProfile();
        } catch (error) {
            console.error('Failed to update store profile', error);
            setMessage({ type: 'error', text: 'Failed to update store profile' });
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field: string, value: any) => {
        if (!profile) return;

        if (field.startsWith('address.')) {
            const addressField = field.split('.')[1];
            setProfile({
                ...profile,
                address: {
                    ...profile.address,
                    [addressField]: value,
                },
            });
        } else {
            setProfile({
                ...profile,
                [field]: value,
            });
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Failed to load store profile</p>
            </div>
        );
    }

    return (
        <div className="max-w-3xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Store Profile</h1>
                <p className="text-gray-600 mt-1">
                    Manage your store information and contact details
                </p>
            </div>

            {message && (
                <div className={`
                    mb-6 p-4 rounded-lg border
                    ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}
                `}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Store Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        Store Name *
                    </label>
                    <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>

                {/* Business Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        Business Type
                    </label>
                    <select
                        value={profile.businessType}
                        onChange={(e) => updateField('businessType', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                        {BUSINESS_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        Description
                    </label>
                    <textarea
                        value={profile.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Tell customers about your business..."
                    />
                </div>

                {/* Support Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        Support Email *
                    </label>
                    <input
                        type="email"
                        value={profile.supportEmail}
                        onChange={(e) => updateField('supportEmail', e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>

                {/* Support Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                        Support Phone
                    </label>
                    <input
                        type="tel"
                        value={profile.supportPhone}
                        onChange={(e) => updateField('supportPhone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="+234 800 000 0000"
                    />
                </div>

                {/* Business Address */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Business Address</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Street Address
                        </label>
                        <input
                            type="text"
                            value={profile.address.street}
                            onChange={(e) => updateField('address.street', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                value={profile.address.city}
                                onChange={(e) => updateField('address.city', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                State
                            </label>
                            <input
                                type="text"
                                value={profile.address.state}
                                onChange={(e) => updateField('address.state', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Country
                        </label>
                        <input
                            type="text"
                            value={profile.address.country}
                            onChange={(e) => updateField('address.country', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center gap-4 pt-6 border-t">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>

                    <p className="text-sm text-gray-500">
                        Changes will reflect across your storefront, invoices, and emails
                    </p>
                </div>
            </form>
        </div>
    );
}
