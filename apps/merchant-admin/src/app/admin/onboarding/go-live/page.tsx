'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon, cn } from '@vayva/ui';
import { api } from '@/services/api';

export default function GoLivePage() {
    const [checklist, setChecklist] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchChecklist = async () => {
        try {
            const res = await api.get('/onboarding/checklist');
            setChecklist(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchChecklist();
    }, []);

    const blockers = checklist.filter(item => item.status === 'BLOCKED' || (item.status === 'TODO' && item.category === 'PAYMENTS'));
    const canGoLive = blockers.length === 0;

    return (
        <AdminShell title="Go Live" breadcrumb="Onboarding">
            <div className="max-w-4xl mx-auto flex flex-col gap-8">

                {/* Header */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-[#0B1220] mb-2">Ready to Go Live?</h1>
                            <p className="text-[#525252]">Complete the checklist below to launch your store.</p>
                        </div>
                        <div className="w-20 h-20 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-green-200">
                            <Icon name="Rocket" size={40} className="text-green-600" />
                        </div>
                    </div>
                </div>

                {/* Blockers Alert */}
                {!canGoLive && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
                        <Icon name="AlertTriangle" size={20} className="text-orange-600 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-orange-900 mb-1">Action Required</h3>
                            <p className="text-sm text-orange-700">You have {blockers.length} item(s) that need attention before going live.</p>
                        </div>
                    </div>
                )}

                {/* Checklist */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50">
                        <h2 className="font-bold text-[#0B1220]">Launch Checklist</h2>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {isLoading ? (
                            <div className="p-12 text-center text-gray-400">Loading checklist...</div>
                        ) : (
                            checklist.map(item => (
                                <div key={item.id} className="p-6 flex items-start gap-4">
                                    <div className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                                        item.status === 'DONE' ? "bg-green-100 text-green-600" :
                                            item.status === 'BLOCKED' ? "bg-red-100 text-red-600" :
                                                "bg-gray-100 text-gray-400"
                                    )}>
                                        {item.status === 'DONE' ? <Icon name="Check" size={14} /> : <Icon name="Circle" size={14} />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-[#0B1220] mb-1">{item.title}</h3>
                                        <p className="text-sm text-[#525252]">{item.description}</p>
                                        {item.status === 'BLOCKED' && item.blockerReason && (
                                            <p className="text-xs text-red-600 mt-2">⚠️ {item.blockerReason}</p>
                                        )}
                                    </div>
                                    <span className={cn(
                                        "text-xs font-bold uppercase px-2 py-1 rounded",
                                        item.status === 'DONE' ? "bg-green-50 text-green-600" :
                                            item.status === 'BLOCKED' ? "bg-red-50 text-red-600" :
                                                "bg-gray-50 text-gray-500"
                                    )}>
                                        {item.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                    <Button variant="outline" href="/admin/onboarding">
                        <Icon name="ArrowLeft" size={16} className="mr-2" />
                        Back to Setup
                    </Button>
                    <div className="flex gap-3">
                        <Button variant="outline">Preview Store</Button>
                        <Button disabled={!canGoLive}>
                            <Icon name="Rocket" size={16} className="mr-2" />
                            {canGoLive ? 'Launch Store' : 'Complete Checklist First'}
                        </Button>
                    </div>
                </div>

            </div>
        </AdminShell>
    );
}
