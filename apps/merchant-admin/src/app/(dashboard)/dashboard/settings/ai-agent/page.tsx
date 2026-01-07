"use client";

import React, { useState, useEffect } from "react";
import { Icon, Button, Card, Input, Badge } from "@vayva/ui";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AiAgentSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        waAgent: {
            enabled: false,
            autoDraft: false,
            humanHandoffEnabled: true,
        },
        persona: {
            agentName: "Vayva Assistant",
            tonePreset: "Friendly",
            greetingTemplate: "",
            signoffTemplate: "",
        }
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/settings/ai-agent");
            const data = await res.json();
            if (data.success) {
                setSettings(data.data);
            }
        } catch (e) {
            toast.error("Failed to load AI settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/settings/ai-agent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings)
            });
            const data = await res.json();
            if (data.success) {
                toast.success("AI Agent settings saved");
            } else {
                toast.error("Failed to save settings");
            }
        } catch (e) {
            toast.error("Network error saving settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading AI Configuration...</div>;

    const tones = ["Friendly", "Professional", "Luxury", "Playful", "Minimal"];

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-10 pb-20">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Agent Settings</h1>
                <p className="text-gray-500 font-medium">Configure your intelligent assistant's behavior and personality.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Persona Section */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                                <Icon name="UserCircle" size={20} />
                            </div>
                            <h3 className="font-bold text-xl text-gray-900">Agent Persona</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Agent Name</label>
                                <Input
                                    value={settings.persona.agentName}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        persona: { ...settings.persona, agentName: e.target.value }
                                    })}
                                    placeholder="e.g. Vayva Assistant"
                                    className="rounded-xl h-11"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tone of Voice</label>
                                <div className="flex flex-wrap gap-2">
                                    {tones.map((tone) => (
                                        <button
                                            key={tone}
                                            onClick={() => setSettings({
                                                ...settings,
                                                persona: { ...settings.persona, tonePreset: tone }
                                            })}
                                            className={cn(
                                                "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                                                settings.persona.tonePreset === tone
                                                    ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-100"
                                                    : "bg-white border-gray-100 text-gray-500 hover:border-purple-200"
                                            )}
                                        >
                                            {tone}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Default Greeting</label>
                            <textarea
                                className="w-full min-h-[100px] p-4 rounded-2xl border border-gray-100 text-sm focus:ring-2 focus:ring-purple-500 outline-none bg-gray-50"
                                value={settings.persona.greetingTemplate}
                                onChange={(e) => setSettings({
                                    ...settings,
                                    persona: { ...settings.persona, greetingTemplate: e.target.value }
                                })}
                                placeholder="Hello! Welcome to [Store Name]. How can I help you today?"
                            />
                        </div>
                    </Card>

                    <Card className="p-8 space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                <Icon name="Settings" size={20} />
                            </div>
                            <h3 className="font-bold text-xl text-gray-900">Operations & Automation</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div>
                                    <p className="font-bold text-gray-900">Auto-Draft Orders</p>
                                    <p className="text-xs text-gray-500">Enable AI to create draft orders from WhatsApp messages automatically.</p>
                                </div>
                                <button
                                    onClick={() => setSettings({
                                        ...settings,
                                        waAgent: { ...settings.waAgent, autoDraft: !settings.waAgent.autoDraft }
                                    })}
                                    className={cn(
                                        "w-12 h-6 rounded-full p-1 transition-colors relative",
                                        settings.waAgent.autoDraft ? "bg-green-600" : "bg-gray-200"
                                    )}
                                >
                                    <div className={cn(
                                        "w-4 h-4 bg-white rounded-full transition-transform",
                                        settings.waAgent.autoDraft ? "translate-x-6" : "translate-x-0"
                                    )} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div>
                                    <p className="font-bold text-gray-900">Human Handoff</p>
                                    <p className="text-xs text-gray-500">Route complex queries to store staff when AI is uncertain.</p>
                                </div>
                                <button
                                    onClick={() => setSettings({
                                        ...settings,
                                        waAgent: { ...settings.waAgent, humanHandoffEnabled: !settings.waAgent.humanHandoffEnabled }
                                    })}
                                    className={cn(
                                        "w-12 h-6 rounded-full p-1 transition-colors relative",
                                        settings.waAgent.humanHandoffEnabled ? "bg-green-600" : "bg-gray-200"
                                    )}
                                >
                                    <div className={cn(
                                        "w-4 h-4 bg-white rounded-full transition-transform",
                                        settings.waAgent.humanHandoffEnabled ? "translate-x-6" : "translate-x-0"
                                    )} />
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="p-6 bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-none">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Icon name="Zap" size={20} />
                            </div>
                            <Badge className="bg-white/20 text-white border-none">ACTIVE</Badge>
                        </div>
                        <h4 className="font-bold mb-2">Power of Groq AI</h4>
                        <p className="text-xs text-purple-100 leading-relaxed mb-4">
                            Your agent is powered by Llama 3 via Groq, enabling lightning-fast extraction and natural conversations.
                        </p>
                        <Button
                            variant="primary"
                            className="w-full bg-white text-purple-700 font-bold hover:bg-white/90 border-none"
                            onClick={() => window.location.href = "/dashboard/wa-agent"}
                        >
                            Open Testing Room
                        </Button>
                    </Card>

                    <Card className="p-6">
                        <h4 className="font-bold text-gray-900 mb-4">Quick Tips</h4>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <div className="text-purple-600 mt-1"><Icon name="CheckCircle2" size={16} /></div>
                                <p className="text-xs text-gray-600">Give your agent a unique name to build brand personality.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="text-purple-600 mt-1"><Icon name="CheckCircle2" size={16} /></div>
                                <p className="text-xs text-gray-600">Use "Professional" tone for B2B or high-ticket luxury items.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="text-purple-600 mt-1"><Icon name="CheckCircle2" size={16} /></div>
                                <p className="text-xs text-gray-600">Enable Auto-Draft to save time on data entry from chats.</p>
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>

            {/* Sticky Action Bar */}
            <div className="bg-white/80 backdrop-blur-md border border-gray-100 p-6 rounded-3xl flex items-center justify-between shadow-xl sticky bottom-6 mr-6 ml-6 z-10">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-3 h-3 rounded-full animate-pulse",
                        settings.waAgent.enabled ? "bg-green-500" : "bg-gray-300"
                    )} />
                    <div>
                        <p className="text-sm font-bold text-gray-900">
                            {settings.waAgent.enabled ? "Agent is Live" : "Agent is Disabled"}
                        </p>
                        <p className="text-xs text-gray-500">Configure global AI behavior across all channels.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setSettings({
                            ...settings,
                            waAgent: { ...settings.waAgent, enabled: !settings.waAgent.enabled }
                        })}
                        className="rounded-2xl px-6 h-12 font-bold"
                    >
                        {settings.waAgent.enabled ? "Disable Agent" : "Enable Agent"}
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-purple-600 text-white font-bold h-12 px-10 rounded-2xl hover:scale-105 transition-transform"
                    >
                        {saving ? <Icon name="Loader" className="animate-spin" size={18} /> : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
