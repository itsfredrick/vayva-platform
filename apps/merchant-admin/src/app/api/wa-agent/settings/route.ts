import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";



export async function GET(req: Request) {
    try {
        const user = await requireAuth();
        
        

        let settings = await prisma.whatsAppAgentSettings.findUnique({
            where: { storeId: user.storeId }
        });

        if (!settings) {
            // Return default
            return NextResponse.json({
                success: true,
                data: {
                    enabled: false,
                    autoDraft: false, // Mapped
                    smartReplies: true
                }
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                enabled: settings.enabled,
                autoDraft: settings.catalogMode === 'CatalogPlusFAQ',
                smartReplies: !settings.humanHandoffEnabled // Loose mapping
            }
        });

    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await requireAuth();
        
        

        const body = await req.json();
        // Body: { enabled, autoDraft, smartReplies }

        const settings = await prisma.whatsAppAgentSettings.upsert({
            where: { storeId: user.storeId },
            update: {
                enabled: body.enabled,
                catalogMode: body.autoDraft ? 'CatalogPlusFAQ' : 'StrictCatalogOnly',
                humanHandoffEnabled: !body.smartReplies
            },
            create: {
                storeId: user.storeId,
                enabled: body.enabled,
                catalogMode: body.autoDraft ? 'CatalogPlusFAQ' : 'StrictCatalogOnly',
                humanHandoffEnabled: !body.smartReplies
            }
        });

        return NextResponse.json({ success: true, data: settings });

    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
