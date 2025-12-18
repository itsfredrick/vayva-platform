'use client';

import React from 'react';
import { GlassPanel, Button, Icon } from '@vayva/ui';
import Link from 'next/link';

export default function ConnectedServicesPage() {
    // Static for demo, could be dynamic
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GlassPanel className="p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg">Paystack</h3>
                    <span className="text-xs font-bold bg-green-500/10 text-green-500 px-2 py-1 rounded uppercase">Connected</span>
                </div>
                <p className="text-sm text-text-secondary mb-6">
                    Used for processing payments and managing your wallet.
                </p>
                <Link href="/admin/payments">
                    <Button variant="outline" className="w-full">Manage Wallet</Button>
                </Link>
            </GlassPanel>

            <GlassPanel className="p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg">WhatsApp</h3>
                    <span className="text-xs font-bold bg-green-500/10 text-green-500 px-2 py-1 rounded uppercase">Connected</span>
                </div>
                <p className="text-sm text-text-secondary mb-6">
                    Connect your business number for AI automation.
                </p>
                <Link href="/admin/wa-agent/connect">
                    <Button variant="outline" className="w-full">Manage Connection</Button>
                </Link>
            </GlassPanel>

            <GlassPanel className="p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg">Domain</h3>
                    <span className="text-xs font-bold bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded uppercase">Not Connected</span>
                </div>
                <p className="text-sm text-text-secondary mb-6">
                    Connect a custom domain (e.g. yourstore.com).
                </p>
                <Link href="/admin/control-center/domains">
                    <Button variant="outline" className="w-full">Connect Domain</Button>
                </Link>
            </GlassPanel>
        </div>
    );
}
