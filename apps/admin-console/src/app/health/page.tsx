'use client';

import React from 'react';

export default function SystemHealthPage() {
    return (
        <div className="min-h-screen bg-[#F7FAF7] p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-[#0B1220] mb-8">System Health</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-sm font-medium text-[#525252] mb-2">Webhook Queue</h3>
                        <p className="text-3xl font-bold text-[#0B1220]">0</p>
                        <p className="text-xs text-green-600 mt-1">All clear</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-sm font-medium text-[#525252] mb-2">Failed Deliveries</h3>
                        <p className="text-3xl font-bold text-[#0B1220]">0</p>
                        <p className="text-xs text-green-600 mt-1">All clear</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-sm font-medium text-[#525252] mb-2">Provider Status</h3>
                        <p className="text-3xl font-bold text-green-600">✓</p>
                        <p className="text-xs text-green-600 mt-1">Operational</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
