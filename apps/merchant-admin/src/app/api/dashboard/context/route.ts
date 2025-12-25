import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@vayva/db';

export async function GET(request: Request) {
    try {
        // Get real session
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized - Please login' },
                { status: 401 }
            );
        }

        // Get store details
        const store = await prisma.store.findUnique({
            where: { id: user.storeId },
        });

        // Get wallet for KYC status
        const wallet = await prisma.wallet.findUnique({
            where: { storeId: user.storeId },
        });

        // Real context data from database
        const data = {
            firstName: user.firstName || 'User',
            initials: (user.firstName?.[0] || 'U') + (user.lastName?.[0] || ''),
            businessType: 'RETAIL', // TODO: Add to store schema
            storeStatus: store?.onboardingStatus === 'COMPLETE' ? 'LIVE' : 'DRAFT',
            paymentStatus: 'CONNECTED', // TODO: Check payment integration
            whatsappStatus: 'ATTENTION', // TODO: Check WhatsApp integration
            kycStatus: wallet?.kycStatus || 'NOT_STARTED',
        };

        return NextResponse.json(data);
    } catch (error) {
        console.error("Dashboard Context Error:", error);
        return NextResponse.json({ error: "Failed to fetch context" }, { status: 500 });
    }
}
