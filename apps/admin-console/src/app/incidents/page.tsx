'use client';

import React, { useState } from 'react';
import { Button, cn } from '@vayva/ui';

export default function IncidentsPage() {
    const [killSwitches, setKillSwitches] = useState([
        { key: 'campaigns_disabled', label: 'Disable Campaigns Globally', enabled: false },
        { key: 'whatsapp_sending_disabled', label: 'Disable WhatsApp Sending', enabled: false },
        { key: 'webhooks_outbound_disabled', label: 'Disable Outbound Webhooks', enabled: false }
    ]);

    return (
        <div className="min-h-screen bg-[#F7FAF7] p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-[#0B1220] mb-8">Incident Controls</h1>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
                    <h3 className="font-bold text-orange-900 mb-2">⚠️ Global Kill Switches</h3>
                    <p className="text-sm text-orange-700">These controls affect all merchants. Use with caution and always provide a reason.</p>
                </div>

                <div className="space-y-4">
                    {killSwitches.map(ks => (
                        <div key={ks.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-[#0B1220] mb-1">{ks.label}</h3>
                                    <p className="text-sm text-[#525252]">{ks.key}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={ks.enabled} />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
