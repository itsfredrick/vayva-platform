import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/admin/auth';
import { prisma } from '@vayva/db';
import { signReferralToken } from '@/lib/partners/referral';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        await checkAdminAccess('admin.partners.manage');
        const { partnerId, code } = await req.json();

        // 1. Create Code Record
        const refCode = await prisma.partnerReferralCode.create({
            data: {
                partnerId,
                code,
                codeHash: crypto.createHash('sha256').update(code).digest('hex')
            }
        });

        // 2. Generate Signed Link
        const signedToken = signReferralToken(partnerId, code);
        const link = `https://vayva.com/signup?ref=${signedToken}`; // Base URL should be env var

        return NextResponse.json({ refCode, link, token: signedToken });

    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 });
    }
}
