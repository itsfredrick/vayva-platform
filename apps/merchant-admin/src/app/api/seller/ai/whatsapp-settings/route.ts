import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { prisma } from "@vayva/db";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const storeId = user.storeId;

    if (!storeId)
      return NextResponse.json({ error: "No store found" }, { status: 400 });

    const settings = await prisma.whatsAppAgentSettings.findUnique({
      where: { storeId },
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch WhatsApp settings" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth();
    const storeId = user.storeId;
    const body = await request.json();

    if (!storeId)
      return NextResponse.json({ error: "No store found" }, { status: 400 });

    const settings = await prisma.whatsAppAgentSettings.upsert({
      where: { storeId },
      update: {
        ...body,
        updatedAt: new Date(),
      },
      create: {
        ...body,
        storeId,
      },
    });

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update WhatsApp settings" },
      { status: 500 },
    );
  }
}
