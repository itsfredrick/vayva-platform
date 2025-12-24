'use client';

import React, { useState, useEffect } from 'react';
import { Plug, CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';

interface Integration {
    id: string;
    name: string;
    status: string;
    account: string | null;
    lastSync: string | null;
}

export default function ConnectedServicesPage() {
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIntegrations();
    }, []);

    const fetchIntegrations = async () => {
        try {
            const res = await fetch('/api/integrations');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setIntegrations(data.integrations || []);
        } catch (error) {
            console.error('Failed to load integrations', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Connected Services</h1>
                <p className="text-gray-600 mt-1">
                    Manage your third-party integrations
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {integrations.map((integration) => (
                    <IntegrationCard key={integration.id} integration={integration} />
                ))}

                {/* Logistics Partners - Coming Soon */}
                <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6">
                    <div className="text-center">
                        <Plug className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Logistics Partners</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            GIG Logistics, Kwik Delivery
                        </p>
                        <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full">
                            Coming Soon
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function IntegrationCard({ integration }: { integration: Integration }) {
    const isConnected = integration.status === 'CONNECTED';

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Plug className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                        {integration.account && (
                            <p className="text-sm text-gray-600">{integration.account}</p>
                        )}
                    </div>
                </div>
                {isConnected ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                )}
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Status</span>
                    <span className={`
                        px-2 py-1 rounded-full text-xs font-semibold
                        ${isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    `}>
                        {integration.status}
                    </span>
                </div>
                {integration.lastSync && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Last Sync</span>
                        <span className="text-gray-900">
                            {new Date(integration.lastSync).toLocaleDateString()}
                        </span>
                    </div>
                )}
            </div>

            <button
                className={`
                    w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2
                    ${isConnected
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }
                `}
            >
                {isConnected ? (
                    <>
                        <ExternalLink className="w-4 h-4" />
                        Manage
                    </>
                ) : (
                    'Connect'
                )}
            </button>
        </div>
    );
}
