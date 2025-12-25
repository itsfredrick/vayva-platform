
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';

export async function GET() {
    try {
        // Require authentication
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized - Please login' },
                { status: 401 }
            );
        }

        // TODO: Implement WhatsApp integration
        // For now, return empty array
        // When WhatsApp is integrated, query from whatsapp_conversation table
        const conversations: any[] = [];

        return NextResponse.json(conversations);
    } catch (error) {
        console.error("Fetch WhatsApp Conversations Error:", error);
        return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
    }
}
