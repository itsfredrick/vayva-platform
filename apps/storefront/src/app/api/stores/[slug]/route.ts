import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const store = await prisma.store.findUnique({
      where: { slug },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Transform to PublicStore format
    const publicStore = {
      id: store.id,
      name: store.name,
      slug: store.slug,
      logo: store.logoUrl,
      description: (store.settings as any)?.description || "",
      brandColor: (store.settings as any)?.brandColor || "#000000",
      whatsapp: (store.settings as any)?.whatsapp || "",
      socials: (store.settings as any)?.socials || {},
      theme: (store.settings as any)?.theme || {},
      plan: "FREE",
    };

    return NextResponse.json(publicStore);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch store" },
      { status: 500 },
    );
  }
}
