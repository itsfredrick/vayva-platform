import { NextResponse } from 'next/server';
import { BusinessType } from '@vayva/shared';

export async function GET(request: Request) {
    // In a real app, we'd get the session here.
    // const session = await getSession();

    // Mock Context Data based on "Master Execution" prompt requirements
    const data = {
        firstName: 'Fred',
        initials: 'FD',
        businessType: BusinessType.RETAIL, // Default, client override via URL handled in frontend for now, or here if we passed it.
        // For Review purposes, let's randomized or just hardcode a happy path
        storeStatus: 'LIVE',           // LIVE, DRAFT
        paymentStatus: 'CONNECTED',    // CONNECTED, PENDING
        whatsappStatus: 'ATTENTION',   // CONNECTED, ATTENTION
        kycStatus: 'VERIFIED',         // VERIFIED, REVIEW, ACTION
    };

    return NextResponse.json(data);
}
