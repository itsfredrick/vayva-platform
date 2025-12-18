'use client';

import { useState } from 'react';
import { ApiKeysTab } from './ApiKeysTab';
import { WebhooksTab } from './WebhooksTab';
import { GlassPanel } from '@vayva/ui';

export function IntegrationsView({ keys, webhooks }: { keys: any[], webhooks: any[] }) {
    const [tab, setTab] = useState<'keys' | 'webhooks'>('keys');

    return (
        <div className="space-y-6">
            <div className="flex gap-4 border-b border-white/10">
                <button
                    onClick={() => setTab('keys')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors relative ${tab === 'keys' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    API Keys
                    {tab === 'keys' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
                <button
                    onClick={() => setTab('webhooks')}
                    className={`pb-3 px-1 text-sm font-medium transition-colors relative ${tab === 'webhooks' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    Webhooks
                    {tab === 'webhooks' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
            </div>

            <div className="min-h-[400px]">
                {tab === 'keys' ? (
                    <ApiKeysTab keys={keys} />
                ) : (
                    <WebhooksTab webhooks={webhooks} />
                )}
            </div>
        </div>
    );
}
