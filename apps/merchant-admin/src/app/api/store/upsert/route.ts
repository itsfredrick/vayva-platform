import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";

export async function GET() {
    try {
        const user = await requireAuth();
        const storeId = user.storeId;

        if (!storeId) {
            return NextResponse.json(
                { error: "Store not found" },
                { status: 404 }
            );
        }

        const store = await prisma.store.findUnique({
            where: { id: storeId },
        });

        return NextResponse.json({ store });
    } catch (error: any) {
        console.error("Store get error:", error);
        return NextResponse.json(
            { error: `Failed to get store: ${error.message}` },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const user = await requireAuth();
        const body = await request.json();

        // Get store directly from user
        const storeId = user.storeId;

        if (!storeId) {
            return NextResponse.json(
                { error: "Store not found. Please complete signup first." },
                { status: 404 }
            );
        }

        // Get current store settings
        const currentStore = await prisma.store.findUnique({
            where: { id: storeId },
            select: { settings: true }
        });

        const currentSettings = typeof currentStore?.settings === 'object' && currentStore.settings !== null
            ? currentStore.settings as Record<string, any>
            : {};

        // Update store with onboarding data
        const updatedStore = await prisma.store.update({
            where: { id: storeId },
            data: {
                ...(body.name && { name: body.name }),
                ...(body.category && { category: body.category }),
                ...(body.logo && { logoUrl: body.logo }),
                settings: {
                    ...currentSettings,
                    ...(body.city && { city: body.city }),
                    ...(body.state && { state: body.state }),
                    ...(body.country && { country: body.country }),
                    ...(body.description && { description: body.description }),
                    ...(body.brandColor && { brandColor: body.brandColor }),
                    ...(body.templateId && { templateId: body.templateId }),
                    ...(body.paymentMethods && { paymentMethods: body.paymentMethods }),
                    ...(body.paymentProofRule && { paymentProofRule: body.paymentProofRule }),
                    ...(body.deliveryPolicy && { deliveryPolicy: body.deliveryPolicy }),
                    ...(body.deliveryStages && { deliveryStages: body.deliveryStages }),
                    ...(body.deliveryProofRequired !== undefined && { deliveryProofRequired: body.deliveryProofRequired }),
                    ...(body.deliveryPickupAddress && { deliveryPickupAddress: body.deliveryPickupAddress }),
                    ...(body.deliveryPickupAddress && { deliveryPickupAddress: body.deliveryPickupAddress }),

                    // Allow arbitrary settings updates (for Team, KYC metadata, etc)
                    ...(body.settings || {})
                }
            }
        });

        return NextResponse.json({
            success: true,
            store: updatedStore,
            storeId: updatedStore.id
        });
    } catch (error: any) {
        console.error("Store upsert error:", error);
        return NextResponse.json(
            { error: `Failed to save store: ${error.message}` },
            { status: 500 }
        );
    }
}
