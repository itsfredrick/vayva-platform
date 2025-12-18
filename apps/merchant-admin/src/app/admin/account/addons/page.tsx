'use client';

import React from 'react';
import { SettingsSection, SettingsCard } from '@/components/account/AccountComponents';
import { Button } from '@vayva/ui';

export default function AddonsPage() {
    return (
        <div className="flex flex-col gap-8">
            <header className="flex flex-col gap-1 border-b border-gray-100 pb-6">
                <h1 className="text-2xl font-bold text-[#0B0B0B]">Add-ons</h1>
                <p className="text-[#525252]">Enhance your store with extra features.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SettingsCard className="flex flex-col gap-4">
                    <h3 className="font-bold text-[#0B0B0B]">Custom Domain</h3>
                    <p className="text-sm text-[#525252]">Connect your own .com or .ng domain name.</p>
                    <div className="flex-1"></div>
                    <Button variant="outline">Connect Domain</Button>
                </SettingsCard>
                <SettingsCard className="flex flex-col gap-4">
                    <h3 className="font-bold text-[#0B0B0B]">WhatsApp Business Number</h3>
                    <p className="text-sm text-[#525252]">Get a dedicated Verified WhatsApp number from Vayva.</p>
                    <div className="flex-1"></div>
                    <Button variant="outline">Request Number</Button>
                </SettingsCard>
            </div>
        </div>
    );
}
