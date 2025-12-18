'use client';

import React from 'react';
import { GoLiveCard } from '@/components/dashboard/GoLiveCard';

export default function DashboardPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                    Overview
                </h1>
                <p className="text-gray-500 mt-1">Welcome back to Vayva.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {/* Placeholder for Metrics/Recent Orders */}
                    <div className="bg-white p-6 rounded-xl border h-64 flex items-center justify-center text-gray-400">
                        Activity Chart Component
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Operations Column */}
                    <GoLiveCard />

                    {/* Placeholder for Quick Actions */}
                    <div className="bg-white p-6 rounded-xl border">
                        <h3 className="font-bold mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded">Add Product</button>
                            <button className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded">Edit Theme</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
