'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@vayva/ui';

export default function AnalyticsPage() {
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock Fetch
        setTimeout(() => {
            setMetrics({
                visitors: 1240,
                pageViews: 4500,
                addToCart: 320,
                checkouts: 150,
                purchases: 85,
                conversionRate: 6.85
            });
            setLoading(false);
        }, 800);
    }, []);

    const cards = [
        { label: 'Total Visitors', value: metrics?.visitors, fmt: (v: any) => v },
        { label: 'Total Sales', value: metrics?.purchases, fmt: (v: any) => v },
        { label: 'Conversion Rate', value: metrics?.conversionRate, fmt: (v: any) => v + '%' },
        { label: 'Add to Carts', value: metrics?.addToCart, fmt: (v: any) => v },
    ];

    return (
        <div className="max-w-6xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Analytics 📊</h1>

            {loading ? (
                <div className="animate-pulse flex gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 w-64 bg-gray-200 rounded-xl"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {cards.map((c, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border shadow-sm">
                            <div className="text-sm font-medium text-gray-500 mb-1">{c.label}</div>
                            <div className="text-3xl font-bold">{c.fmt(c.value)}</div>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-white border rounded-xl p-6 shadow-sm">
                <h2 className="font-bold text-lg mb-4">Top Performing Products</h2>
                <table className="w-full text-left">
                    <thead className="text-gray-500 border-b">
                        <tr>
                            <th className="pb-3">Product</th>
                            <th className="pb-3 text-right">Views</th>
                            <th className="pb-3 text-right">Sales</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        <tr>
                            <td className="py-3 font-medium">Urban High-Tops</td>
                            <td className="py-3 text-right">854</td>
                            <td className="py-3 text-right">42</td>
                        </tr>
                        <tr>
                            <td className="py-3 font-medium">Classic Tee (Black)</td>
                            <td className="py-3 text-right">620</td>
                            <td className="py-3 text-right">28</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
