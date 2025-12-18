'use client';

import React from 'react';
import { GlassPanel, Button, Icon } from '@vayva/ui';
import Link from 'next/link';

export default function DomainsPage() {
    return (
        <div className="mx-auto max-w-4xl p-6">
            <Link href="/admin/control-center" className="mb-6 flex items-center text-sm text-text-secondary hover:text-white">
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Back to Control Center
            </Link>

            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="relative mb-8">
                    <div className="absolute inset-0 animate-pulse bg-primary/20 blur-xl rounded-full"></div>
                    <GlassPanel className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-black/50">
                        <Icon name="Globe" size={48} className="text-primary" />
                    </GlassPanel>
                </div>

                <h1 className="mb-4 text-3xl font-bold text-white">Custom Domains</h1>
                <p className="mb-8 max-w-lg text-text-secondary text-lg">
                    Connect your own domain (e.g., yourstore.com) to professionalize your brand.
                    <br />This feature is coming in the next update.
                </p>

                <Button variant="outline" className="gap-2 cursor-not-allowed opacity-50" disabled>
                    <Icon name="Lock" size={16} />
                    Connect Domain (Coming Soon)
                </Button>

                <div className="mt-12 p-4 rounded-lg bg-white/5 border border-white/5 max-w-sm w-full">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-text-secondary">Current Subdomain</span>
                        <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-500 text-xs font-medium">Active</span>
                    </div>
                    <div className="font-mono text-white text-lg">mystore.vayva.shop</div>
                </div>
            </div>
        </div>
    );
}
