"use client";

import { useState, useEffect } from "react";
import { Icon, Button, Card, Badge } from "@vayva/ui";
import { toast } from "sonner";
import { CardSkeleton } from "@/components/LoadingSkeletons";

type AgentSettings = {
    enabled: boolean;
    autoDraft: boolean;
    smartReplies: boolean;
};

export default function WaAgentPage() {
    const [settings, setSettings] = useState<AgentSettings>({
        enabled: false,
        autoDraft: false,
        smartReplies: true
    });
    const [loading, setLoading] = useState(true);

    const [testMessage, setTestMessage] = useState("I want 2 bags of rice, deliver to Lekki.");
    const [extractedData, setExtractedData] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch("/api/wa-agent/settings");
            const data = await res.json();
            if (data.success) {
                setSettings(data.data);
            }
        } catch (e) {
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (newSettings: AgentSettings) => {
        // Optimistic Update
        setSettings(newSettings);
        try {
            await fetch("/api/wa-agent/settings", {
                method: "POST",
                body: JSON.stringify(newSettings)
            });
            toast.success("Settings saved");
        } catch (e) {
            toast.error("Failed to save");
            fetchSettings(); // Revert
        }
    };

    const handleToggle = () => {
        updateSettings({ ...settings, enabled: !settings.enabled });
    };

    const handleSimulate = async () => {
        setIsProcessing(true);
        setExtractedData(null);
        try {
            const res = await fetch("/api/wa-agent/simulate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: testMessage })
            });
            const data = await res.json();
            if (data.success) {
                setExtractedData(data.data);
            } else {
                toast.error("AI simulation failed");
            }
        } catch (e) {
            toast.error("Simulation error");
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />
                    <div className="h-10 w-32 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="grid lg:grid-cols-2 gap-8">
                    <CardSkeleton className="h-64" />
                    <CardSkeleton className="h-[500px]" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">WhatsApp AI Agent 🤖</h1>
                    <p className="text-gray-600 mt-2">
                        Configure automated order extraction.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-full border border-gray-200">
                    <div className={`w-3 h-3 rounded-full ml-4 ${settings.enabled ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                    <span className="font-semibold text-sm">{settings.enabled ? "Agent Active" : "Agent Paused"}</span>
                    <Button
                        size="sm"
                        variant={settings.enabled ? "destructive" : "primary"}
                        onClick={handleToggle}
                    >
                        {settings.enabled ? "Pause Agent" : "Activate Agent"}
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Icon name="Settings" size={20} /> Agent Settings
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-gray-900">Auto-Draft Orders</p>
                                    <p className="text-xs text-gray-500">Create DRAFT orders from chat automatically</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle"
                                    checked={settings.autoDraft}
                                    onChange={(e) => updateSettings({ ...settings, autoDraft: e.target.checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-gray-900">Smart Replies</p>
                                    <p className="text-xs text-gray-500">Enable AI response suggestions</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle"
                                    checked={settings.smartReplies}
                                    onChange={(e) => updateSettings({ ...settings, smartReplies: e.target.checked })}
                                />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-blue-50 border-blue-200">
                        <h3 className="text-blue-900 font-bold mb-2">How it works</h3>
                        <p className="text-sm text-blue-800 leading-relaxed">
                            Vayva listens to incoming WhatsApp messages. The AI processes natural language to extract orders.
                            Enable "Active" mode to start processing real messages.
                        </p>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="p-0 overflow-hidden flex flex-col h-[500px]">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <span className="font-bold text-gray-700">Extraction Playground</span>
                            <Badge variant="info">Simulation</Badge>
                        </div>
                        <div className="flex-1 p-6 bg-gray-100 flex flex-col gap-4 overflow-y-auto">
                            {/* Simplified simulator UI re-implementation */}
                            <div className="bg-white self-start rounded-2xl rounded-tl-none p-4 max-w-[80%] shadow-sm text-sm">
                                Test the AI extraction logic here.
                            </div>
                            <div className="bg-green-100 self-end rounded-2xl rounded-tr-none p-4 max-w-[80%] shadow-sm text-sm text-green-900">
                                {testMessage}
                            </div>
                            {extractedData && (
                                <div className="w-full bg-white border border-purple-100 rounded-xl overflow-hidden shadow-sm animate-in zoom-in slide-in-from-bottom-2 duration-300">
                                    <div className="bg-purple-50 p-2 px-3 border-b border-purple-100 flex justify-between items-center">
                                        <span className="text-xs font-bold text-purple-700">✨ AI RESULT</span>
                                    </div>
                                    <div className="p-3 space-y-2">
                                        {extractedData.entities.items.map((item: any, i: number) => (
                                            <div key={i} className="flex justify-between text-sm">
                                                <span>{item.qty}x {item.name}</span>
                                            </div>
                                        ))}
                                        <div className="font-bold text-sm mt-2 border-t pt-2">
                                            Total: ₦{extractedData.entities.total.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                            <input value={testMessage} onChange={(e) => setTestMessage(e.target.value)} className="flex-1 bg-gray-100 border-none rounded-lg px-4" />
                            <Button onClick={handleSimulate} disabled={isProcessing}><Icon name="Send" size={18} /></Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
