'use client';

import React, { useState, useEffect } from 'react';
import { WhatsAppService, WhatsAppThread } from '@/services/whatsapp.service';
import { Icon } from '@vayva/ui';

export default function InboxPage() {
    const [threads, setThreads] = useState<WhatsAppThread[]>([]);
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadThreads();
    }, []);

    const loadThreads = async () => {
        try {
            const data = await WhatsAppService.listThreads();
            setThreads(data);
            if (data.length > 0 && !selectedThreadId) {
                setSelectedThreadId(data[0].id);
            }
        } catch (err) {
            console.error('Failed to load threads', err);
        } finally {
            setLoading(false);
        }
    };

    const activeThread = threads.find((t) => t.id === selectedThreadId);

    return (
        <div className="h-[calc(100vh-6rem)] flex overflow-hidden rounded-2xl bg-white/50 border border-white/60 shadow-xl backdrop-blur-xl">
            {/* LEFT: Thread List */}
            <div className="w-80 border-r border-[#101828]/10 flex flex-col bg-white/40">
                <div className="p-4 border-b border-[#101828]/10 flex justify-between items-center">
                    <h2 className="font-semibold text-[#0B1220]">Inbox</h2>
                    <div className="flex gap-2">
                        {/* Filter Tabs placeholder */}
                        <button className="p-1.5 rounded-lg hover:bg-black/5 text-[#0B1220]/60"><Icon name="Filter" size={16} /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-sm text-[#0B1220]/40">Loading conversations...</div>
                    ) : threads.length === 0 ? (
                        <div className="p-6 text-center text-sm text-[#0B1220]/40">No messages yet.</div>
                    ) : (
                        threads.map((thread) => (
                            <div
                                key={thread.id}
                                onClick={() => setSelectedThreadId(thread.id)}
                                className={`p-4 border-b border-[#101828]/05 cursor-pointer transition-colors hover:bg-white/60 
                  ${selectedThreadId === thread.id ? 'bg-white/80 border-l-4 border-l-[#22C55E]' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-[#0B1220] truncate text-sm">{thread.contact?.displayName || thread.contact?.phoneE164 || 'Unknown'}</span>
                                    <span className="text-xs text-[#0B1220]/40 whitespace-nowrap ml-2">
                                        {new Date(thread.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="text-xs text-[#0B1220]/60 truncate">
                                    {thread.messages?.[0]?.content || 'Start a conversation'}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* CENTER: Thread View */}
            <div className="flex-1 flex flex-col bg-white/20 relative">
                {activeThread ? (
                    <>
                        {/* Header */}
                        <div className="h-16 border-b border-[#101828]/10 flex items-center px-6 justify-between bg-white/40 backdrop-blur-md sticky top-0 z-10">
                            <div>
                                <h3 className="font-semibold text-[#0B1220]">{activeThread.contact?.displayName || activeThread.contact?.phoneE164}</h3>
                                <div className="text-xs text-[#0B1220]/50 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    WhatsApp
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 text-xs font-medium bg-white/60 border border-[#101828]/10 rounded-lg hover:bg-white shadow-sm">
                                    Assign
                                </button>
                                <button className="px-3 py-1.5 text-xs font-medium bg-[#22C55E]/10 text-[#16A34A] border border-[#22C55E]/20 rounded-lg hover:bg-[#22C55E]/20 shadow-sm">
                                    Resolve
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {/* Messages will go here. For now, showing placeholder list */}
                            {/* We need to fetch full history for activeThread if not fully loaded */}
                            <div className="text-center text-xs text-[#0B1220]/30 py-4">This is the start of your conversation</div>
                        </div>

                        {/* Composer */}
                        <div className="p-4 border-t border-[#101828]/10 bg-white/60 backdrop-blur-md">
                            <div className="flex gap-2 items-end">
                                <button className="p-3 text-[#0B1220]/40 hover:text-[#0B1220] hover:bg-black/5 rounded-xl">
                                    <Icon name="Paperclip" size={20} />
                                </button>
                                <textarea
                                    className="flex-1 bg-white/80 border border-[#101828]/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 resize-none max-h-32"
                                    rows={1}
                                    placeholder="Type a message..."
                                />
                                <button className="p-3 bg-[#0B1220] text-white rounded-xl hover:bg-[#101828] shadow-lg shadow-black/10">
                                    <Icon name="Send" size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-[#0B1220]/30">
                        <Icon name="MessageSquare" size={48} className="mb-4 opacity-20" />
                        <p>Select a conversation to start messaging</p>
                    </div>
                )}
            </div>

            {/* RIGHT: AI Drawer (Collapsed by default logic to be added) */}
            <div className="w-80 border-l border-[#101828]/10 bg-white/30 backdrop-blur-md flex flex-col">
                <div className="p-4 border-b border-[#101828]/10">
                    <h4 className="font-semibold text-sm text-[#0B1220]">AI Assistant</h4>
                </div>
                <div className="p-4 space-y-4">
                    <div className="bg-white/60 p-3 rounded-xl border border-[#101828]/05 shadow-sm">
                        <div className="text-xs font-medium text-[#0B1220]/60 mb-2 uppercase tracking-wider">Suggested Action</div>
                        <p className="text-sm text-[#0B1220] mb-3">Customer is asking about order payload.</p>
                        <button className="w-full py-2 bg-[#22C55E] text-white text-xs font-bold rounded-lg shadow-md hover:bg-[#16A34A] flex items-center justify-center gap-2">
                            Check Order Status
                        </button>
                    </div>

                    <div className="bg-white/60 p-3 rounded-xl border border-[#101828]/05 shadow-sm">
                        <div className="text-xs font-medium text-[#0B1220]/60 mb-2 uppercase tracking-wider">Context</div>
                        <div className="text-sm">
                            <div className="flex justify-between py-1 border-b border-black/5"><span>LTV</span> <span className="font-mono">₦152k</span></div>
                            <div className="flex justify-between py-1 border-b border-black/5"><span>Orders</span> <span className="font-mono">12</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
