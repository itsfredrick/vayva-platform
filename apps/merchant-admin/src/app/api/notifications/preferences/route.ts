
import { NextResponse } from 'next/server';
import { NotificationPreferences } from '@vayva/shared';

const MOCK_PREFS: NotificationPreferences = {
    merchantId: 'mer_123',
    channels: {
        in_app: true,
        whatsapp: true,
        email: false
    },
    categories: {
        orders: true,
        payments: true,
        account: true,
        system: true
    },
    quietHours: {
        enabled: true,
        start: "22:00",
        end: "07:00"
    }
};

export async function GET() {
    return NextResponse.json(MOCK_PREFS);
}

export async function POST(request: Request) {
    const updates = await request.json();
    // Simulate DB update
    return NextResponse.json({
        success: true,
        message: 'Preferences updated',
        preferences: { ...MOCK_PREFS, ...updates }
    });
}
