'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { WaAgentService, WaThread } from '@/services/wa-agent';
import { InboxSidebar, ChatWindow, AiActionsPanel } from '@/components/wa-agent/WaInbox';

export default function WaInboxPage({ params }: { params: { threadId?: string } }) {
    const [threads, setThreads] = useState<WaThread[]>([]);
    const [activeThread, setActiveThread] = useState<WaThread | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const list = await WaAgentService.getConversations();
            setThreads(list);

            if (params.threadId) {
                const detail = await WaAgentService.getThread(params.threadId);
                setActiveThread(detail);
            }

            setIsLoading(false);
        };
        load();
    }, [params.threadId]);

    // Custom layout override for Inbox to maximize height
    return (
        <div className="h-screen flex text-[#0B0B0B] bg-[#F9FAFB] font-sans antialiased">
            {/* We manually reconstruct AdminShell's sidebar context or use it as a wrapper that allows full height content */}
            {/* For now, let's just use AdminShell but assume we'll custom styling for full-height. 
                 Actually, AdminShell enforces padding. Let's make a specialized AgentShell or just wrap inside AdminShell and accept padding.
                 To get the "App-like" feel, we might want to strip the header for this specific route.
                 However, to keep it simple and consistent:
             */}
            <AdminShell title="Inbox" className="h-[calc(100vh-64px)] !p-0 !max-w-none flex flex-row overflow-hidden absolute inset-0 top-0 pt-0">
                {/* This is a hacky way to remove padding using !p-0. In a real app we'd have a `layout="full"` prop on AdminShell. */}
                {/* Sidebar */}
                <div className="shrink-0 h-full">
                    <InboxSidebar threads={threads} activeId={params.threadId} />
                </div>

                {/* Main Content */}
                <div className="flex-1 flex h-full">
                    <ChatWindow thread={activeThread} />
                    <AiActionsPanel thread={activeThread} />
                </div>
            </AdminShell>
        </div>
    );
}
