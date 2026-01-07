import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";



export async function GET(req: Request) {
  try {
    const user = await requireAuth();
    

    const store = await prisma.store.findUnique({
      where: { id: user.storeId },
      select: { settings: true }
    });

    if (!store) return new NextResponse("Store not found", { status: 404 });

    const settings = (store.settings as any) || {};
    const integrations = settings.integrations || {
      paystack: { enabled: false, publicKey: "", secretKey: "" },
      kwik: { enabled: false, apiKey: "" }
    };

    return NextResponse.json({ success: true, data: integrations });
  } catch (e) {
    console.error(e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    

    const body = await req.json();
    // body: { paystack: {...}, kwik: {...} }

    // Fetch current settings first to merge deep
    const store = await prisma.store.findUnique({
      where: { id: user.storeId }
    });

    if (!store) return new NextResponse("Store not found", { status: 404 });

    const currentSettings = (store.settings as any) || {};
    const currentIntegrations = currentSettings.integrations || {};

    // Merge logic (allow partial updates)
    const newIntegrations = {
      ...currentIntegrations,
      ...body
    };

    const updatedSettings = {
      ...currentSettings,
      integrations: newIntegrations
    };

    await prisma.store.update({
      where: { id: user.storeId },
      data: {
        settings: updatedSettings
      }
    });

    return NextResponse.json({ success: true, data: newIntegrations });
  } catch (e) {
    console.error(e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
