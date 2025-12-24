"use client";

import React, { useState, useEffect } from 'react';
import { ConversationList } from '@/components/whatsapp/ConversationList';
import { ChatWindow } from '@/components/whatsapp/ChatWindow';
import { ContextPanel } from '@/components/whatsapp/ContextPanel';
import { WhatsAppConversation, WhatsAppMessage, WhatsAppMessageSender } from '@vayva/shared';
import { Icon, cn } from '@vayva/ui';

export default function WhatsAppAgentPage() {
    const [conversations, setConversations] = useState<WhatsAppConversation[]>([]);
    const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isLoadingConvs, setIsLoadingConvs] = useState(true);
    const [isLoadingMsgs, setIsLoadingMsgs] = useState(false);
    const [isConnected, setIsConnected] = useState(true); // Mock status

    // Fetch Conversations on mount
    useEffect(() => {
        const fetchConvs = async () => {
            try {
                const res = await fetch('/api/whatsapp/conversations');
                const data = await res.json();
                setConversations(data);
                if (data.length > 0 && !selectedId) {
                    // Optionally select first one, but maybe better to verify empty state first? 
                    // Let's select first one for "Command Center" feel
                    setSelectedId(data[0].id);
                }
            } catch (e) {
                console.error("Failed to load conversations", e);
            } finally {
                setIsLoadingConvs(false);
            }
        };
        fetchConvs();
    }, []);

    // Fetch Messages when selection changes
    useEffect(() => {
        if (!selectedId) return;

        const fetchMessages = async () => {
            setIsLoadingMsgs(true);
            try {
                const res = await fetch(`/api/whatsapp/messages?conversationId=${selectedId}`);
                const data = await res.json();
                setMessages(data);

                // Mark as read locally (mock)
                setConversations(prev => prev.map(c =>
                    c.id === selectedId ? { ...c, unreadCount: 0 } : c
                ));
            } catch (e) {
                console.error("Failed to load messages", e);
            } finally {
                setIsLoadingMsgs(false);
            }
        };
        fetchMessages();
    }, [selectedId]);

    const handleSendMessage = async (content: string, linkedType?: any, linkedId?: any) => {
        if (!selectedId) return;

        // Optimistic UI update
        const tempId = `temp_${Date.now()}`;
        const newMsg: WhatsAppMessage = {
            id: tempId,
            conversationId: selectedId,
            sender: WhatsAppMessageSender.MERCHANT,
            content,
            linkedType: linkedType || 'none',
            linkedId: linkedId,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, newMsg]);

        // API Call
        try {
            const res = await fetch('/api/whatsapp/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMsg)
            });
            const savedMsg = await res.json();

            // Replace temp with real
            setMessages(prev => prev.map(m => m.id === tempId ? savedMsg : m));

            // Update conversation last message preview
            setConversations(prev => prev.map(c =>
                c.id === selectedId ? {
                    ...c,
                    lastMessageAt: savedMsg.timestamp,
                    lastMessagePreview: savedMsg.content
                } : c
            ));

        } catch (e) {
            console.error("Failed to send message", e);
            // Revert on error (simplified)
            setMessages(prev => prev.filter(m => m.id !== tempId));
        }
    };

    const selectedConversation = conversations.find(c => c.id === selectedId) || null;

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm ml-4 mr-4 mb-4">
            {/* Top Bar (Page Level) */}
            <header className="h-[60px] border-b border-gray-200 flex items-center justify-between px-6 shrink-0 bg-white rounded-t-2xl">
                <div className="flex items-center gap-3">
                    <h1 className="font-heading font-bold text-lg text-gray-900">WhatsApp Agent</h1>
                    {/* Status Badge */}
                    <div className={cn(
                        "flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide",
                        isConnected ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", isConnected ? "bg-green-500" : "bg-red-500")} />
                        {isConnected ? "Connected" : "Disconnected"}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <a href="#" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
                        <Icon name="Info" size={16} />
                        <span>Help</span>
                    </a>
                    <button className="relative p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <Icon name="Bell" size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                </div>
            </header>

            {/* 3-Panel Layout */}
            <div className="flex flex-1 overflow-hidden">

                {/* 1. LEFT PANEL: Conversation List */}
                <aside className="w-[320px] border-r border-gray-200 flex flex-col bg-white">
                    <div className="p-3 border-b border-gray-100">
                        <div className="relative">
                            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-gray-300 transition-colors"
                                placeholder="Search messages..."
                            />
                        </div>
                    </div>
                    <ConversationList
                        conversations={conversations}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                        isLoading={isLoadingConvs}
                    />
                </aside>

                {/* 2. CENTER PANEL: Chat Window */}
                <main className="flex-1 flex flex-col bg-gray-50/50 min-w-0">
                    <ChatWindow
                        conversation={selectedConversation}
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isLoadingMessages={isLoadingMsgs}
                    />
                </main>

                {/* 3. RIGHT PANEL: Context & Actions */}
                <aside className="w-[350px] bg-white border-l border-gray-200 flex flex-col hidden xl:flex">
                    <ContextPanel conversation={selectedConversation} />
                </aside>

            </div>
        </div>
    );
}
