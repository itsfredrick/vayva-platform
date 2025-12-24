import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@vayva/db';

export async function GET() {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;

        const store = await prisma.store.findUnique({
            where: { id: storeId },
            include: {
                kycRecord: true,
            },
        });

        if (!store) {
            return NextResponse.json(
                { error: 'Store not found' },
                { status: 404 }
            );
        }

        const kycRecord = store.kycRecord;

        return NextResponse.json({
            status: kycRecord?.status || 'NOT_STARTED',
            businessType: kycRecord?.businessType || null,
            documents: kycRecord ? [
                {
                    type: 'BVN',
                    status: kycRecord.bvnVerified ? 'VERIFIED' : 'PENDING',
                    uploadedAt: kycRecord.createdAt,
                },
                {
                    type: 'ID',
                    status: kycRecord.idVerified ? 'VERIFIED' : 'PENDING',
                    uploadedAt: kycRecord.createdAt,
                },
                ...(kycRecord.businessType === 'REGISTERED' ? [{
                    type: 'CAC',
                    status: kycRecord.cacVerified ? 'VERIFIED' : 'PENDING',
                    uploadedAt: kycRecord.createdAt,
                }] : []),
            ] : [],
            canWithdraw: kycRecord?.status === 'VERIFIED',
        });
    } catch (error: any) {
        console.error('KYC status fetch error:', error);

        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Failed to fetch KYC status' },
            { status: 500 }
        );
    }
}
