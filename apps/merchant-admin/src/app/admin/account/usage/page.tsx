'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Loader2, TrendingUp } from 'lucide-react';

interface UsageData {
    orders: { used: number; limit: number | string };
    whatsappMessages: { used: number; limit: number | string };
    staffSeats: { used: number; limit: number | string };
    templates: { unlocked: number | string };
}

export default function UsagePage() {
    const [data, setData] = useState<UsageData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsage();
    }, []);

    const fetchUsage = async () => {
        try {
            const res = await fetch('/api/account/usage');
            if (!res.ok) throw new Error('Failed to fetch');
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error('Failed to load usage', error);
        } finally {
            setLoading(false);
        }
    };

    const getPercentage = (used: number, limit: number | string): number => {
        if (limit === 'unlimited') return 0;
        return Math.min(100, (used / (limit as number)) * 100);
    };

    const getColorClass = (percentage: number): string => {
        if (percentage < 70) return 'bg-green-500';
        if (percentage < 90) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!data) {
        return <div className="text-center py-12 text-gray-500">Failed to load usage</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Usage & Limits</h1>
                <p className="text-gray-600 mt-1">
                    Monitor your plan usage and limits
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Orders */}
                <UsageCard
                    title="Orders This Month"
                    used={data.orders.used}
                    limit={data.orders.limit}
                    icon={<BarChart3 className="w-6 h-6" />}
                    getPercentage={getPercentage}
                    getColorClass={getColorClass}
                />

                {/* WhatsApp Messages */}
                <UsageCard
                    title="WhatsApp Messages"
                    used={data.whatsappMessages.used}
                    limit={data.whatsappMessages.limit}
                    icon={<TrendingUp className="w-6 h-6" />}
                    getPercentage={getPercentage}
                    getColorClass={getColorClass}
                />

                {/* Staff Seats */}
                <UsageCard
                    title="Staff Seats"
                    used={data.staffSeats.used}
                    limit={data.staffSeats.limit}
                    icon={<BarChart3 className="w-6 h-6" />}
                    getPercentage={getPercentage}
                    getColorClass={getColorClass}
                />

                {/* Templates */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Templates</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                        {data.templates.unlocked === 'unlimited' ? 'Unlimited' : data.templates.unlocked}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Available templates</p>
                </div>
            </div>

            {/* Upgrade Prompt */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Need More?</h3>
                <p className="text-gray-700 mb-4">
                    Upgrade your plan to unlock higher limits and more features
                </p>
                <a
                    href="/admin/account/subscription"
                    className="inline-block px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                    View Plans
                </a>
            </div>
        </div>
    );
}

function UsageCard({
    title,
    used,
    limit,
    icon,
    getPercentage,
    getColorClass,
}: {
    title: string;
    used: number;
    limit: number | string;
    icon: React.ReactNode;
    getPercentage: (used: number, limit: number | string) => number;
    getColorClass: (percentage: number) => string;
}) {
    const percentage = getPercentage(used, limit);
    const isUnlimited = limit === 'unlimited';

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                    {icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>

            <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900">
                    {used.toLocaleString()}
                    {!isUnlimited && (
                        <span className="text-lg font-normal text-gray-600">
                            {' '}/ {typeof limit === 'number' ? limit.toLocaleString() : limit}
                        </span>
                    )}
                </p>
            </div>

            {!isUnlimited && (
                <>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                            className={`h-2 rounded-full transition-all ${getColorClass(percentage)}`}
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                        {percentage.toFixed(0)}% used
                    </p>
                </>
            )}

            {isUnlimited && (
                <p className="text-sm text-green-600 font-medium">Unlimited usage</p>
            )}
        </div>
    );
}
