'use client';

import React, { useState } from 'react';
import { Button, Icon } from '@vayva/ui';

export default function MerchantsPage() {
    const [query, setQuery] = useState('');
    const [merchants, setMerchants] = useState<any[]>([]);

    const handleSearch = async () => {
        // Mock search
        setMerchants([
            { id: '1', name: 'Sample Store', slug: 'sample-store', plan: 'Starter', status: 'active' }
        ]);
    };

    return (
        <div className="min-h-screen bg-[#F7FAF7] p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-[#0B1220] mb-8">Merchant Management</h1>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Search by name, slug, or ID..."
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <Button onClick={handleSearch}>
                            <Icon name="Search" size={16} className="mr-2" />
                            Search
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    {merchants.map(merchant => (
                        <div key={merchant.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-[#0B1220] mb-1">{merchant.name}</h3>
                                    <p className="text-sm text-[#525252]">{merchant.slug} • {merchant.plan}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">View Details</Button>
                                    <Button variant="ghost" size="sm">Suspend</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
