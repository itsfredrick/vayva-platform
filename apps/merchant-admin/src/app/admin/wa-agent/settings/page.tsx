'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { WaAgentService, WaSettings } from '@/services/wa-agent';
import { Button, Icon, cn } from '@vayva/ui';
import { motion } from 'framer-motion';

export default function WaSettingsPage() {
    const router = useRouter();
    const [settings, setSettings] = useState<WaSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDirty, setIsDirty] = useState(false);
    const [activeTab, setActiveTab] = useState('greeting');

    useEffect(() => {
        const load = async () => {
            const data = await WaAgentService.getSettings();
            setSettings(data);
            setIsLoading(false);
        };
        load();
    }, []);

    const handleChange = (section: keyof WaSettings, key: string, value: any) => {
        if (!settings) return;
        setSettings({
            ...settings,
            [section]: {
                ...settings[section as keyof WaSettings],
                [key]: value
            }
        });
        setIsDirty(true);
    };

    const handleSave = async () => {
        if (!settings) return;
        setIsLoading(true);
        await WaAgentService.updateSettings(settings);
        setIsLoading(false);
        setIsDirty(false);
    };

    if (isLoading && !settings) return <AdminShell title="Loading..."><div className="p-12 text-center">Loading Settings...</div></AdminShell>;
    if (!settings) return null;

    return (
        <AdminShell title="Agent Settings" breadcrumb="WhatsApp Agent">
            <div className="flex flex-col lg:flex-row gap-8 items-start max-w-6xl mx-auto pb-24 relative">

                {/* Left: Confg Panel */}
                <div className="flex-1 w-full bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-100 overflow-x-auto">
                        {['greeting', 'tone', 'handoff', 'compliance', 'flags'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-6 py-4 text-sm font-bold capitalize transition-colors whitespace-nowrap",
                                    activeTab === tab ? "text-black border-b-2 border-black" : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {activeTab === 'compliance' && (
                            <div className="flex flex-col gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-black uppercase tracking-wider">Messaging Safeguards</h4>
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={settings.compliance?.onlyInitiatedChat}
                                            onChange={e => handleChange('compliance', 'onlyInitiatedChat', e.target.checked)}
                                            className="mt-1 w-4 h-4 accent-black"
                                        />
                                        <div>
                                            <span className="text-sm font-bold text-black block">Only message customers who initiated chat</span>
                                            <p className="text-xs text-gray-500">Prevents the AI from starting new conversations without user interaction.</p>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={settings.compliance?.requireApprovalForPayments}
                                            onChange={e => handleChange('compliance', 'requireApprovalForPayments', e.target.checked)}
                                            className="mt-1 w-4 h-4 accent-black"
                                        />
                                        <div>
                                            <span className="text-sm font-bold text-black block">Require approval for payment links</span>
                                            <p className="text-xs text-gray-500">The agent will ask for your confirmation before sending checkout links or refund notices.</p>
                                        </div>
                                    </label>
                                </div>

                                <div className="pt-6 border-t border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Legal & Policy Links</h4>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <a href="/legal/acceptable-use" target="_blank" className="text-gray-600 hover:text-black hover:underline">• Acceptable Use Policy</a>
                                        <a href="/legal/prohibited-items" target="_blank" className="text-gray-600 hover:text-black hover:underline">• Prohibited Items</a>
                                        <a href="/legal/privacy" target="_blank" className="text-gray-600 hover:text-black hover:underline">• Vayva Privacy Policy</a>
                                        <a href="/legal/terms" target="_blank" className="text-gray-600 hover:text-black hover:underline">• Merchant Agreement</a>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'greeting' && (
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-[#0B0B0B]">Greeting Message</label>
                                    <textarea
                                        className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 outline-none resize-none text-sm"
                                        value={settings.greeting.message}
                                        onChange={(e) => handleChange('greeting', 'message', e.target.value)}
                                    />
                                    <div className="flex gap-2 flex-wrap">
                                        {['{customer_name}', '{store_name}', '{store_link}'].map(chip => (
                                            <button key={chip} className="bg-gray-100 hover:bg-gray-200 text-xs px-2 py-1 rounded text-gray-600 font-medium transition-colors">
                                                {chip}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" checked={settings.greeting.sendOnFirstMessage} onChange={e => handleChange('greeting', 'sendOnFirstMessage', e.target.checked)} className="accent-black w-4 h-4" />
                                        <span className="text-sm font-medium text-[#0B0B0B]">Send automatically on first message</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" checked={settings.greeting.showProducts} onChange={e => handleChange('greeting', 'showProducts', e.target.checked)} className="accent-black w-4 h-4" />
                                        <span className="text-sm font-medium text-[#0B0B0B]">Include top product recommendations</span>
                                    </label>
                                </div>
                            </div>
                        )}
                        {activeTab === 'tone' && (
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-[#0B0B0B]">Conversation Style</label>
                                    <select
                                        className="h-10 border border-gray-200 rounded-lg px-3 bg-white text-sm"
                                        value={settings.tone.style}
                                        onChange={(e) => handleChange('tone', 'style', e.target.value)}
                                    >
                                        <option value="friendly">Friendly & Helpful (Default)</option>
                                        <option value="professional">Strictly Professional</option>
                                        <option value="playful">Playful & Casual</option>
                                    </select>
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={settings.tone.useEmoji} onChange={e => handleChange('tone', 'useEmoji', e.target.checked)} className="accent-black w-4 h-4" />
                                    <span className="text-sm font-medium text-[#0B0B0B]">Use Emojis in responses ☺️</span>
                                </label>
                            </div>
                        )}
                        {activeTab === 'handoff' && (
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-[#0B0B0B]">Escalation Keywords</label>
                                    <p className="text-xs text-gray-400">Comma separated keywords that trigger human takeover</p>
                                    <input
                                        type="text"
                                        className="h-10 border border-gray-200 rounded-lg px-3 text-sm focus:ring-2 focus:ring-black/5 outline-none"
                                        value={settings.handoff.escalateKeywords.join(', ')}
                                        onChange={(e) => handleChange('handoff', 'escalateKeywords', e.target.value.split(',').map(s => s.trim()))}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-[#0B0B0B]">Human Handover Contact</label>
                                    <input
                                        type="text"
                                        className="h-10 border border-gray-200 rounded-lg px-3 text-sm focus:ring-2 focus:ring-black/5 outline-none"
                                        value={settings.handoff.humanContact}
                                        onChange={(e) => handleChange('handoff', 'humanContact', e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Preview */}
                <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
                    <div className="bg-[#E5DDD5] rounded-xl overflow-hidden shadow-sm border border-gray-200 h-[500px] flex flex-col">
                        <div className="bg-[#075E54] p-3 flex items-center gap-2 text-white">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">{'{S}'}</div>
                            <span className="font-bold text-sm">Vayva Store</span>
                        </div>
                        <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
                            <div className="self-start bg-white rounded-lg p-2 rounded-tl-none shadow-sm max-w-[85%]">
                                <p className="text-xs text-black leading-relaxed">
                                    {settings.greeting.message
                                        .replace('{customer_name}', 'Amaka')
                                        .replace('{store_name}', 'Vayva Demo')
                                        .replace('{store_link}', 'vayva.shop/demo')}
                                </p>
                                <span className="text-[10px] text-gray-400 block text-right mt-1">10:05 AM</span>
                            </div>
                            {settings.greeting.showProducts && (
                                <div className="self-start bg-white rounded-lg p-2 rounded-tl-none shadow-sm max-w-[85%]">
                                    <p className="text-xs text-black font-bold mb-1">🔥 Top Picks For You:</p>
                                    <div className="flex gap-2 overflow-x-auto pb-1">
                                        <div className="w-16 h-16 bg-gray-100 rounded shrink-0"></div>
                                        <div className="w-16 h-16 bg-gray-100 rounded shrink-0"></div>
                                    </div>
                                    <span className="text-[10px] text-gray-400 block text-right mt-1">10:05 AM</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => router.push('/admin/wa-agent/test-message')}>
                        <Icon name="Send" size={14} className="mr-2" /> Send Test Message
                    </Button>
                </div>

                {/* Sticky Save Bar */}
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: isDirty ? 0 : 100 }}
                    className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 z-50"
                >
                    <span className="text-sm font-medium">You have unsaved changes</span>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 hover:bg-white/20 rounded text-sm font-medium transition-colors" onClick={() => setIsDirty(false)}>Discard</button>
                        <button className="px-4 py-1.5 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-100 transition-colors" onClick={handleSave}>
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </motion.div>

            </div>
        </AdminShell>
    );
}
