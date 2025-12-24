
import { NextResponse } from 'next/server';
import { WhatsAppConversation, WhatsAppLinkedEntityType } from '@vayva/shared';

// Mock Data
const CONVERSATIONS: WhatsAppConversation[] = [
    {
        id: 'conv_1',
        customerId: 'cus_1',
        customerName: 'Alice Johnson',
        customerPhone: '+234 801 234 5678',
        status: 'open',
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
        lastMessagePreview: 'Is my order ready for pickup?',
        unreadCount: 2,
        tags: ['order'],
        linkedEntity: {
            type: WhatsAppLinkedEntityType.ORDER,
            id: 'ord_1024'
        }
    },
    {
        id: 'conv_2',
        customerId: 'cus_2',
        customerName: 'Chioma Okeke',
        customerPhone: '+234 809 876 5432',
        status: 'open',
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        lastMessagePreview: 'I would like to reschedule my appointment.',
        unreadCount: 0,
        tags: ['booking'],
        linkedEntity: {
            type: WhatsAppLinkedEntityType.BOOKING,
            id: 'bk_502'
        }
    },
    {
        id: 'conv_3',
        customerId: 'cus_3',
        customerName: 'Emeka U. (New)',
        customerPhone: '+234 705 555 1212',
        status: 'resolved',
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        lastMessagePreview: 'Thanks for the quick response!',
        unreadCount: 0,
        tags: ['inquiry'],
        linkedEntity: {
            type: WhatsAppLinkedEntityType.NONE,
            id: ''
        }
    }
];

export async function GET() {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return NextResponse.json(CONVERSATIONS);
}
