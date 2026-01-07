import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";



export async function GET(req: Request) {
    try {
        const user = await requireAuth();
        
        const storeId = user.storeId;

        const [waSettings, aiProfile] = await Promise.all([
            prisma.whatsAppAgentSettings.findUnique({ where: { storeId } }),
            prisma.merchantAiProfile.findUnique({ where: { storeId } })
        ]);

        return NextResponse.json({
            success: true,
            data: {
                waAgent: {
                    enabled: waSettings?.enabled ?? false,
                    autoDraft: waSettings?.catalogMode === 'CatalogPlusFAQ',
                    catalogMode: waSettings?.catalogMode ?? 'StrictCatalogOnly',
                    humanHandoffEnabled: waSettings?.humanHandoffEnabled ?? true,
                },
                persona: {
                    agentName: aiProfile?.agentName ?? "Vayva Assistant",
                    tonePreset: aiProfile?.tonePreset ?? "Friendly",
                    greetingTemplate: aiProfile?.greetingTemplate ?? "",
                    signoffTemplate: aiProfile?.signoffTemplate ?? "",
                }
            }
        });

    } catch (error) {
        console.error("[AI SETTINGS GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await requireAuth();
        
        const storeId = user.storeId;
        const body = await req.json();

        const { waAgent, persona } = body;

        await Promise.all([
            prisma.whatsAppAgentSettings.upsert({
                where: { storeId },
                update: {
                    enabled: waAgent.enabled,
                    catalogMode: waAgent.autoDraft ? 'CatalogPlusFAQ' : 'StrictCatalogOnly',
                    humanHandoffEnabled: waAgent.humanHandoffEnabled
                },
                create: {
                    storeId,
                    enabled: waAgent.enabled,
                    catalogMode: waAgent.autoDraft ? 'CatalogPlusFAQ' : 'StrictCatalogOnly',
                    humanHandoffEnabled: waAgent.humanHandoffEnabled
                }
            }),
            prisma.merchantAiProfile.upsert({
                where: { storeId },
                update: {
                    agentName: persona.agentName,
                    tonePreset: persona.tonePreset,
                    greetingTemplate: persona.greetingTemplate,
                    signoffTemplate: persona.signoffTemplate
                },
                create: {
                    storeId,
                    agentName: persona.agentName,
                    tonePreset: persona.tonePreset,
                    greetingTemplate: persona.greetingTemplate,
                    signoffTemplate: persona.signoffTemplate
                }
            })
        ]);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("[AI SETTINGS POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
