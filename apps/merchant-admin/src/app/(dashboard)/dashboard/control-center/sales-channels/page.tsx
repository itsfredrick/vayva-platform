"use client";

import React, { useEffect, useState } from "react";
import { Icon, Button } from "@vayva/ui";
import { ControlCenterShell } from "@/components/control-center/ControlCenterShell";
import { toast } from "sonner";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/utils";

interface SalesChannel {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    type: string;
    canToggle: boolean;
    status?: string;
}

export default function SalesChannelsPage() {
    const [channels, setChannels] = useState<SalesChannel[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchChannels = async () => {
        try {
            const res = await fetch("/api/store/sales-channels");
            if (res.ok) {
                const data = await res.json();
                setChannels(data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load sales channels");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChannels();
    }, []);

    const toggleChannel = async (id: string, currentState: boolean) => {
        const channel = channels.find(c => c.id === id);
        if (!channel?.canToggle) {
            toast.info(`${channel?.name} requires setup to enable.`);
            return;
        }

        // Optimistic update
        setChannels(prev => prev.map(c => c.id === id ? { ...c, enabled: !currentState } : c));

        try {
            const res = await fetch("/api/store/sales-channels", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ channelId: id, enabled: !currentState }),
            });

            if (!res.ok) {
                throw new Error("Failed to update");
            }
            toast.success(`${channel?.name} ${!currentState ? "enabled" : "disabled"}`);
        } catch (error) {
            // Revert on failure
            setChannels(prev => prev.map(c => c.id === id ? { ...c, enabled: currentState } : c));
            toast.error("Failed to update channel status");
        }
    };

    return (
        <ControlCenterShell>
            <div className="p-8 space-y-8 max-w-5xl mx-auto">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-heading">
                        Sales Channels
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">
                        Manage the platforms where you sell your products.
                    </p>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {channels.map((channel) => (
                            <div
                                key={channel.id}
                                className={cn(
                                    "flex items-center justify-between p-6 rounded-2xl border transition-all",
                                    channel.enabled ? "bg-white border-gray-200 shadow-sm" : "bg-gray-50 border-transparent opacity-80"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0",
                                        channel.type === 'whatsapp' ? "bg-green-100 text-green-600" :
                                            channel.type === 'facebook' ? "bg-blue-100 text-blue-600" :
                                                channel.type === 'instagram' ? "bg-pink-100 text-pink-600" :
                                                    "bg-gray-100 text-gray-600"
                                    )}>
                                        <Icon name={
                                            channel.type === 'whatsapp' ? 'MessageCircle' :
                                                channel.type === 'facebook' ? 'Facebook' :
                                                    channel.type === 'instagram' ? 'Instagram' :
                                                        'Store'
                                        } size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{channel.name}</h3>
                                        <p className="text-xs text-gray-500">{channel.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {channel.status && channel.status !== 'CONNECTED' && channel.status !== 'ACTIVE' && (
                                        <span className="text-[10px] font-bold bg-gray-200 text-gray-600 px-2 py-1 rounded-full uppercase tracking-wider">
                                            {channel.status}
                                        </span>
                                    )}
                                    {channel.canToggle ? (
                                        <Switch
                                            checked={channel.enabled}
                                            onCheckedChange={() => toggleChannel(channel.id, channel.enabled)}
                                        />
                                    ) : (
                                        <Button variant="outline" className="h-8 text-xs rounded-lg" disabled>
                                            Manage
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </ControlCenterShell>
    );
}
