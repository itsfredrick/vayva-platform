'use client';

import React, { useState, useEffect } from 'react';
import { Button, cn } from '@vayva/ui';

export default function ModerationPage() {
    const [reviews, setReviews] = useState<any[]>([]);

    return (
        <div className="min-h-screen bg-[#F7FAF7] p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-[#0B1220] mb-8">Moderation Queue</h1>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Review</th>
                                <th className="px-6 py-4">Store</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <tr><td colSpan={5} className="p-12 text-center text-gray-400">No pending reviews.</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
