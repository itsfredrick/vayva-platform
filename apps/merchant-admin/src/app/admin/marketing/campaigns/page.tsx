'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon, cn } from '@vayva/ui';
import { api } from '@/services/api';

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCampaigns = async () => {
        try {
            const res = await api.get('/marketing/campaigns');
            setCampaigns(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    return (
        <AdminShell title="Campaigns" breadcrumb="Marketing">
            <div className="max-w-5xl mx-auto flex flex-col gap-8">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0B1220]">WhatsApp Campaigns</h1>
                        <p className="text-[#525252]">Send targeted messages to your customers.</p>
                    </div>
                    <Button>
                        <Icon name="Plus" size={16} className="mr-2" />
                        Create Campaign
                    </Button>
                </div>

                {/* Consent Warning */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                    <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-blue-900 mb-1">Consent Enforcement</h3>
                        <p className="text-sm text-blue-700">Only customers who opted-in to marketing will receive promotional messages.</p>
                    </div>
                </div>

                <div className="grid gap-4">
                    {isLoading ? (
                        <div className="text-center text-gray-400 py-12">Loading campaigns...</div>
                    ) : campaigns.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
                            <Icon name="MessageCircle" size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="font-bold text-[#0B1220] mb-2">No campaigns yet</h3>
                            <p className="text-[#525252] mb-6">Create your first WhatsApp campaign to engage customers.</p>
                            <Button>Create Campaign</Button>
                        </div>
                    ) : (
                        campaigns.map(campaign => (
                            <div key={campaign.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                        <Icon name="MessageCircle" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#0B1220]">{campaign.name}</h3>
                                        <p className="text-sm text-[#525252]">{campaign.segment?.name || 'All customers'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={cn(
                                        "text-xs font-bold uppercase px-2 py-1 rounded",
                                        campaign.status === 'COMPLETED' ? "bg-green-50 text-green-600" :
                                            campaign.status === 'DRAFT' ? "bg-gray-50 text-gray-500" :
                                                "bg-blue-50 text-blue-600"
                                    )}>
                                        {campaign.status}
                                    </span>
                                    <Button variant="ghost" size="sm">View</Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </AdminShell>
    );
}
