'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon, cn } from '@vayva/ui';
import { api } from '@/services/api';

export default function SegmentsPage() {
    const [segments, setSegments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSegments = async () => {
        try {
            const res = await api.get('/marketing/segments');
            setSegments(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSegments();
    }, []);

    return (
        <AdminShell title="Segments" breadcrumb="Marketing">
            <div className="max-w-4xl mx-auto flex flex-col gap-8">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0B1220]">Customer Segments</h1>
                        <p className="text-[#525252]">Target specific groups for campaigns.</p>
                    </div>
                    <Button>
                        <Icon name="Plus" size={16} className="mr-2" />
                        Create Segment
                    </Button>
                </div>

                <div className="grid gap-4">
                    {isLoading ? (
                        <div className="text-center text-gray-400 py-12">Loading segments...</div>
                    ) : segments.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
                            <Icon name="Users" size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="font-bold text-[#0B1220] mb-2">No segments yet</h3>
                            <p className="text-[#525252] mb-6">Create customer segments to target your campaigns.</p>
                            <Button>Create Segment</Button>
                        </div>
                    ) : (
                        segments.map(segment => (
                            <div key={segment.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-[#0B1220]">{segment.name}</h3>
                                    <span className="text-sm text-[#525252]">~{segment.estimatedSize || 0} customers</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-[#525252]">Custom targeting rules</p>
                                    <Button variant="ghost" size="sm">Edit</Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </AdminShell>
    );
}
