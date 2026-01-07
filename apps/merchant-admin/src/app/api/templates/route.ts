import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";


import { TEMPLATE_CATALOG } from "@/lib/templates/catalog";
import { requireAuth } from "@/lib/session";

// List Templates
export async function GET(req: Request) {
  try {
    const user = await requireAuth();
    

    const store = await prisma.store.findUnique({
      where: { id: user.storeId }
    });

    if (!store) return new NextResponse("Store not found", { status: 404 });

    const settings = (store.settings as any) || {};
    const purchasedIds = settings.purchasedTemplates || ["minimalist-v1", "marketplace-std"];
    const activeTemplateId = settings.activeTemplateId || "marketplace-std";

    const templates = TEMPLATE_CATALOG.map(t => {
      let status = 'LOCKED';
      if (purchasedIds.includes(t.id)) status = 'OWNED';
      if (t.price === 0) status = 'OWNED'; // Free are always owned
      if (activeTemplateId === t.id) status = 'ACTIVE';

      return {
        ...t,
        status
      };
    });

    return NextResponse.json({ success: true, data: templates });
  } catch (e) {
    console.error(e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Activate Template
export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    

    const body = await req.json();
    const { templateId } = body;

    if (!templateId) return NextResponse.json({ success: false, error: "Missing templateId" }, { status: 400 });

    // Update Store settings
    const store = await prisma.store.findUnique({ where: { id: user.storeId } });
    const currentSettings = (store?.settings as any) || {};

    await prisma.store.update({
      where: { id: user.storeId },
      data: {
        templateId, // Sync the actual templateId field
        templateConfig: {}, // Reset config when changing templates to avoid schema conflicts
        settings: {
          ...currentSettings,
          activeTemplateId: templateId
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
