import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/admin/auth';
import { DsrService } from '@/lib/privacy/dsrService';

export async function POST(req: NextRequest) {
    try {
        const admin = await checkAdminAccess('admin.override'); // Higher perm required

        const { store_id, identifier, reason } = await req.json();

        if (!reason) return new NextResponse('Reason is required for anonymization', { status: 400 });

        const result = await DsrService.anonymizeUser(store_id, identifier, reason, admin.user.email || 'system');

        return NextResponse.json(result);

    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 });
    }
}
