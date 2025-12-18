export interface WaSettings {
    greeting: {
        message: string;
        sendOnFirstMessage: boolean;
        proactive: boolean;
        showProducts: boolean;
    };
    tone: {
        style: 'friendly' | 'professional' | 'playful';
        useEmoji: boolean;
    };
    handoff: {
        escalateKeywords: string[];
        businessHoursOnly: boolean;
        humanContact: string;
    };
    flags: {
        autoFlag: boolean;
    };
    compliance?: {
        onlyInitiatedChat: boolean;
        requireApprovalForPayments: boolean;
    };
}

export interface WaMessage {
    id: string;
    text: string;
    sender: 'user' | 'agent' | 'system';
    timestamp: string;
    status: 'sent' | 'delivered' | 'read';
}

export interface WaThread {
    id: string;
    customerName: string;
    customerPhone: string;
    lastMessage: string;
    lastMessageTime: string;
    status: 'open' | 'waiting' | 'resolved';
    messages: WaMessage[];
    aiSuggestions?: {
        reply?: string;
        products?: any[];
        action?: WaApproval; // Current pending action
    };
}

export interface WaApproval {
    id: string;
    type: 'refund' | 'delivery_schedule' | 'discount' | 'order_cancel';
    description: string;
    risk: 'low' | 'medium' | 'high';
    details: any;
    status: 'pending' | 'approved' | 'rejected';
    createdTime: string;
    customerName: string;
}

export interface KbItem {
    id: string;
    question: string;
    answer: string;
    category: string;
    status: 'synced' | 'pending';
}

export const WaAgentService = {
    // 1. Settings
    getSettings: async (): Promise<WaSettings> => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return {
            greeting: {
                message: "Hi {customer_name}! Welcome to {store_name}. How can I help you today?",
                sendOnFirstMessage: true,
                proactive: false,
                showProducts: true
            },
            tone: { style: 'friendly', useEmoji: true },
            handoff: { escalateKeywords: ['speak to human', 'complaint', 'manager'], businessHoursOnly: true, humanContact: '+2348000000000' },
            flags: { autoFlag: true },
            compliance: {
                onlyInitiatedChat: true,
                requireApprovalForPayments: true
            }
        };
    },
    updateSettings: async (settings: WaSettings): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return true;
    },

    // 2. Inbox
    getConversations: async (): Promise<WaThread[]> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return [
            {
                id: 'th_1',
                customerName: 'Chioma Adebayo',
                customerPhone: '+2348012345678',
                lastMessage: 'Where is my order?',
                lastMessageTime: new Date().toISOString(),
                status: 'open',
                messages: [],
                aiSuggestions: {
                    reply: 'I can check that for you. It looks like Order #1024 is currently processing.',
                }
            },
            {
                id: 'th_2',
                customerName: 'Emmanuel Kalu',
                customerPhone: '+2348098765432',
                lastMessage: 'I want a refund please.',
                lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
                status: 'waiting',
                messages: [],
                aiSuggestions: {
                    action: {
                        id: 'app_1',
                        type: 'refund',
                        description: 'Refund Request for Order #1023',
                        risk: 'medium',
                        details: { amount: 10000, reason: 'Customer unhappy' },
                        status: 'pending',
                        createdTime: new Date().toISOString(),
                        customerName: 'Emmanuel Kalu'
                    }
                }
            }
        ];
    },
    getThread: async (id: string): Promise<WaThread> => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return {
            id: id,
            customerName: 'Chioma Adebayo',
            customerPhone: '+2348012345678',
            lastMessage: 'Where is my order?',
            lastMessageTime: new Date().toISOString(),
            status: 'open',
            messages: [
                { id: 'm1', text: 'Hi, I need help.', sender: 'user', timestamp: new Date(Date.now() - 100000).toISOString(), status: 'read' },
                { id: 'm2', text: 'Hello! How can I assist you today?', sender: 'agent', timestamp: new Date(Date.now() - 90000).toISOString(), status: 'read' },
                { id: 'm3', text: 'Where is my order?', sender: 'user', timestamp: new Date(Date.now() - 80000).toISOString(), status: 'read' }
            ],
            aiSuggestions: {
                reply: 'I can see Order #1024 is currently Processing and estimated to arrive tomorrow.'
            }
        };
    },
    sendMessage: async (threadId: string, text: string) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    },

    // 3. Approvals
    getApprovals: async (): Promise<WaApproval[]> => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return [
            {
                id: 'app_1',
                type: 'refund',
                description: 'Refund ₦10,000 for Order #1023',
                risk: 'medium',
                details: { amount: 10000 },
                status: 'pending',
                createdTime: new Date(Date.now() - 7200000).toISOString(),
                customerName: 'Emmanuel Kalu'
            },
            {
                id: 'app_2',
                type: 'delivery_schedule',
                description: 'Schedule Pickup for tomorrow 10am',
                risk: 'low',
                details: { time: '10:00 AM' },
                status: 'pending',
                createdTime: new Date(Date.now() - 14400000).toISOString(),
                customerName: 'Aisha Bello'
            }
        ];
    },
    actionApproval: async (id: string, action: 'approve' | 'reject') => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return true;
    },

    // 4. Knowledge Base
    getKnowledgeBase: async (): Promise<KbItem[]> => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return [
            { id: 'kb_1', question: 'What is your return policy?', answer: 'We accept returns within 7 days of delivery.', category: 'Policies', status: 'synced' },
            { id: 'kb_2', question: 'Do you deliver to Abuja?', answer: 'Yes, we deliver nationwide directly through our logistics partners.', category: 'Shipping', status: 'synced' }
        ];
    },
    updateKnowledgeBase: async (item: KbItem) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return true;
    },

    // 5. Test Message
    sendTestMessage: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
    }
};
