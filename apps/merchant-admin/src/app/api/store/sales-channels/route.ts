import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { prisma } from "@vayva/db";

export async function GET() {
    try {
        const user = await requireAuth();
        const store = await prisma.store.findUnique({
            where: { id: user.storeId },
            include: { whatsAppChannel: true },
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        const settings = (store.settings as any) || {};
        const salesChannels = settings.salesChannels || {};

        const channels = [
            {
                id: "website",
                name: "Online Store",
                description: "Your connected custom storefront",
                enabled: store.isLive,
                type: "website",
                canToggle: true,
            },
            {
                id: "whatsapp",
                name: "WhatsApp",
                description: "Sell directly on WhatsApp",
                enabled: store.whatsAppChannel?.status === "CONNECTED" || store.whatsAppChannel?.status === "ACTIVE",
                type: "whatsapp",
                canToggle: false, // Must be set up via dedicated flow
                status: store.whatsAppChannel?.status || "DISCONNECTED",
            },
            {
                id: "facebook",
                name: "Facebook Shop",
                description: "Sync products to Facebook",
                enabled: !!salesChannels.facebook,
                type: "facebook",
                canToggle: true,
            },
            {
                id: "instagram",
                name: "Instagram Shop",
                description: "Tag products in posts and stories",
                enabled: !!salesChannels.instagram,
                type: "instagram",
                canToggle: true,
            },
        ];

        return NextResponse.json(channels);
    } catch (error) {
        console.error("[SALES_CHANNELS_GET]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const user = await requireAuth();
        const body = await request.json();
        const { channelId, enabled } = body;

        const store = await prisma.store.findUnique({
            where: { id: user.storeId },
        });

        if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

        if (channelId === "website") {
            await prisma.store.update({
                where: { id: user.storeId },
                data: { isLive: enabled },
            });
        } else if (channelId === "facebook" || channelId === "instagram") {
            const settings = (store.settings as any) || {};
            const salesChannels = settings.salesChannels || {};

            await prisma.store.update({
                where: { id: user.storeId },
                data: {
                    settings: {
                        ...settings,
                        salesChannels: {
                            ...salesChannels,
                            [channelId]: enabled
                        }
                    }
                }
            });
        } else {
            return NextResponse.json({ error: "Cannot toggle this channel directly" }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[SALES_CHANNELS_PATCH]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
