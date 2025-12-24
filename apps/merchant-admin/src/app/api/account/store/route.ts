import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@vayva/db';

export async function GET() {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;

        const store = await prisma.store.findUnique({
            where: { id: storeId },
            select: {
                id: true,
                name: true,
                slug: true,
                category: true,
                logoUrl: true,
                contacts: true,
                settings: true,
            },
        });

        if (!store) {
            return NextResponse.json(
                { error: 'Store not found' },
                { status: 404 }
            );
        }

        // Parse contacts and settings from JSON
        const contacts = store.contacts as any || {};
        const settings = store.settings as any || {};

        return NextResponse.json({
            id: store.id,
            name: store.name,
            slug: store.slug,
            businessType: store.category,
            description: settings.description || '',
            supportEmail: contacts.email || '',
            supportPhone: contacts.phone || '',
            address: {
                street: settings.address?.street || '',
                city: settings.address?.city || '',
                state: settings.address?.state || '',
                country: settings.address?.country || 'Nigeria',
            },
        });
    } catch (error: any) {
        console.error('Store profile fetch error:', error);

        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Failed to fetch store profile' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;

        const body = await request.json();
        const {
            name,
            businessType,
            description,
            supportEmail,
            supportPhone,
            address,
        } = body;

        // Validate required fields
        if (!name || !supportEmail) {
            return NextResponse.json(
                { error: 'Name and support email are required' },
                { status: 400 }
            );
        }

        // Get current store data
        const currentStore = await prisma.store.findUnique({
            where: { id: storeId },
            select: { contacts: true, settings: true },
        });

        const currentContacts = currentStore?.contacts as any || {};
        const currentSettings = currentStore?.settings as any || {};

        // Update store
        const updatedStore = await prisma.store.update({
            where: { id: storeId },
            data: {
                name,
                category: businessType,
                contacts: {
                    ...currentContacts,
                    email: supportEmail,
                    phone: supportPhone,
                },
                settings: {
                    ...currentSettings,
                    description,
                    address: address || currentSettings.address,
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Store profile updated successfully',
            store: {
                id: updatedStore.id,
                name: updatedStore.name,
            },
        });
    } catch (error: any) {
        console.error('Store profile update error:', error);

        if (error.message === 'Unauthorized') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        return NextResponse.json(
            { error: 'Failed to update store profile' },
            { status: 500 }
        );
    }
}
