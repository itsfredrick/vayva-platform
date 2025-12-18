import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/admin/auth';
import { TemplateSyncService } from '@/lib/templates/syncService';

export async function POST(req: NextRequest) {
    try {
        await checkAdminAccess('admin.templates.manage');

        const result = await TemplateSyncService.syncTemplates();

        return NextResponse.json(result);
    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 });
    }
}
