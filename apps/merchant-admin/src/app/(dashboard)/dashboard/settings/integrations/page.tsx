"use client";

import React, { useState, useEffect } from "react";
import { Icon, Button } from "@vayva/ui";
import { toast } from "sonner";

export default function IntegrationsPage() {
    const [loading, setLoading] = useState(true);
    const [integrations, setIntegrations] = useState({
        paystack: { enabled: false, publicKey: "", secretKey: "" },
        kwik: { enabled: false, apiKey: "" }
    });

    // WA State is separate or fetched? 
    // Usually WA is handled via its own detailed settings page, but we can show status here.
    const [waConnected, setWaConnected] = useState(true); // Placeholder for now or fetch

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings/integrations");
            const json = await res.json();
            if (json.success) {
                setIntegrations(prev => ({ ...prev, ...json.data }));
            }
        } catch (e) {
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async (section: 'paystack' | 'kwik', data: any) => {
        try {
            const payload = {
                [section]: { ...integrations[section], ...data }
            };
            const res = await fetch("/api/settings/integrations", {
                method: "POST",
                body: JSON.stringify(payload)
            });
            const json = await res.json();
            if (json.success) {
                setIntegrations(prev => ({
                    ...prev,
                    [section]: json.data[section]
                }));
                toast.success(`${section} settings saved`);
            }
        } catch (e) {
            toast.error("Failed to save");
        }
    };

    if (loading) return <div className="p-10">Loading...</div>;

    return (
        <div className="p-8 max-w-4xl">
            <h1 className="text-2xl font-bold mb-2 text-gray-900">Integrations</h1>
            <p className="text-gray-500 mb-8">Connect Vayva with your favorite tools.</p>

            <div className="space-y-6">
                {/* WhatsApp */}
                <div className="bg-white border border-green-200 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Icon name="MessageCircle" size={100} className="text-green-500" />
                    </div>
                    <div className="flex items-start justify-between relative z-10">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                                <Icon name="MessageCircle" size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">WhatsApp Business</h3>
                                <p className="text-sm text-gray-500 max-w-md mt-1">
                                    The heart of Vayva. Sync orders, inventory, and payments directly from your chats.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <Button variant="outline" onClick={() => window.location.href = '/dashboard/wa-agent'}>
                                Configure Agent
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Paystack */}
                <div className={`bg-white border rounded-xl p-6 transition-all ${integrations.paystack.enabled ? 'border-blue-200 ring-1 ring-blue-100' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                                <Icon name="CreditCard" size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Paystack</h3>
                                <p className="text-xs text-gray-500">Payments & Collections</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500">{integrations.paystack.enabled ? 'Active' : 'Inactive'}</span>
                            <button
                                onClick={() => saveSettings('paystack', { enabled: !integrations.paystack.enabled })}
                                className={`w-10 h-5 rounded-full relative transition-colors ${integrations.paystack.enabled ? 'bg-blue-600' : 'bg-gray-200'}`}
                            >
                                <span className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform ${integrations.paystack.enabled ? 'translate-x-5' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {integrations.paystack.enabled && (
                        <div className="mt-4 space-y-4 border-t pt-4 border-gray-100 animate-in fade-in slide-in-from-top-2">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Public Key</label>
                                <input
                                    type="text"
                                    className="w-full text-sm border border-gray-200 rounded px-3 py-2 font-mono"
                                    placeholder="pk_test_..."
                                    value={integrations.paystack.publicKey || ""}
                                    onChange={(e) => setIntegrations(prev => ({ ...prev, paystack: { ...prev.paystack, publicKey: e.target.value } }))}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Secret Key</label>
                                <input
                                    type="password"
                                    className="w-full text-sm border border-gray-200 rounded px-3 py-2 font-mono"
                                    placeholder="sk_test_..."
                                    value={integrations.paystack.secretKey || ""}
                                    onChange={(e) => setIntegrations(prev => ({ ...prev, paystack: { ...prev.paystack, secretKey: e.target.value } }))}
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button size="sm" onClick={() => saveSettings('paystack', {})}>Save Keys</Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Kwik */}
                <div className={`bg-white border rounded-xl p-6 transition-all ${integrations.kwik.enabled ? 'border-purple-200 ring-1 ring-purple-100' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-500">
                                <Icon name="Truck" size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Kwik Delivery</h3>
                                <p className="text-xs text-gray-500">Automated Dispatch</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500">{integrations.kwik.enabled ? 'Active' : 'Inactive'}</span>
                            <button
                                onClick={() => saveSettings('kwik', { enabled: !integrations.kwik.enabled })}
                                className={`w-10 h-5 rounded-full relative transition-colors ${integrations.kwik.enabled ? 'bg-purple-600' : 'bg-gray-200'}`}
                            >
                                <span className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform ${integrations.kwik.enabled ? 'translate-x-5' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {integrations.kwik.enabled && (
                        <div className="mt-4 space-y-4 border-t pt-4 border-gray-100 animate-in fade-in slide-in-from-top-2">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">API Key</label>
                                <input
                                    type="password"
                                    className="w-full text-sm border border-gray-200 rounded px-3 py-2 font-mono"
                                    placeholder="Enter Kwik API Key"
                                    value={integrations.kwik.apiKey || ""}
                                    onChange={(e) => setIntegrations(prev => ({ ...prev, kwik: { ...prev.kwik, apiKey: e.target.value } }))}
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button size="sm" onClick={() => saveSettings('kwik', {})}>Save Kwik Settings</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
