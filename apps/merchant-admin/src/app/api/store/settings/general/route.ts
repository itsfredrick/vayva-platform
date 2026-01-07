import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { prisma } from "@vayva/db";

export async function GET() {
    try {
        const user = await requireAuth();

        // Find or create storefront settings
        let settings = await prisma.storefrontSettings.findUnique({
            where: { storeId: user.storeId },
        });

        if (!settings) {
            // Find store to get slug fallbacks
            const store = await prisma.store.findUnique({
                where: { id: user.storeId },
                include: { merchantOnboarding: true } // Assuming slug might be here or just use ID default
            });

            // Create default if missing
            settings = await prisma.storefrontSettings.create({
                data: {
                    storeId: user.storeId,
                    slug: store?.slug || `store-${user.storeId.substring(0, 8)}`, // Fallback slug
                    isLive: false
                }
            })
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("[SETTINGS_GET_ERROR]", error);
        return NextResponse.json(
            { error: "Failed to fetch settings" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const user = await requireAuth();
        const body = await request.json();

        const settings = await prisma.storefrontSettings.upsert({
            where: { storeId: user.storeId },
            update: {
                seoTitle: body.seoTitle,
                seoDescription: body.seoDescription,
                socialLinks: body.socialLinks, // Expecting JSON object
            },
            create: {
                storeId: user.storeId,
                slug: body.slug || `store-${user.storeId.substring(0, 8)}`,
                seoTitle: body.seoTitle,
                seoDescription: body.seoDescription,
                socialLinks: body.socialLinks,
            },
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error("[SETTINGS_UPDATE_ERROR]", error);
        return NextResponse.json(
            { error: "Failed to update settings" },
            { status: 500 }
        );
    }
}
