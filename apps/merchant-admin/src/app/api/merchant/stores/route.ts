import { NextRequest, NextResponse } from "next/server";
 // Test or real

import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = await requireAuth();
  

  try {
    // Find all stores where user is a member
    const memberships = await prisma.membership.findMany({
      where: { userId: user.id },
      include: { store: true },
    });

    const stores = memberships.map((m: any) => m.store);

    return NextResponse.json({ stores });
  } catch (e: any) {
    return new NextResponse(e.message, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await requireAuth();
  

  // Check if user is allowed to create more stores (Growth/Pro limit?)
  // For now, allow open creation.

  const body = await req.json();
  const { name, slug, category } = body;
  const { id: userId } = user as any;

  if (!name || !slug)
    return new NextResponse("Name and Slug required", { status: 400 });

  try {
    // Check slug uniqueness
    const existing = await prisma.store.findUnique({ where: { slug } });
    if (existing)
      return new NextResponse("Slug already taken", { status: 409 });

    const newStore = await prisma.store.create({
      data: {
        name,
        slug,
        category: category || "general",
        onboardingStatus: "NOT_STARTED", // Explicitly new
        memberships: {
          create: {
            userId: user.id,
            role: "OWNER",
          },
        },
      },
    });

    // Initialize default settings, policies etc if needed
    // ...

    return NextResponse.json({ store: newStore });
  } catch (e: any) {
    return new NextResponse(e.message, { status: 500 });
  }
}
