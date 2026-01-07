import { NextRequest, NextResponse } from "next/server";


import { prisma } from "@vayva/db";
import { cookies } from "next/headers";
import { requireAuth } from "@/lib/session";

export async function POST(req: NextRequest) {
  const user = await requireAuth();
  

  const { storeId } = await req.json();
  if (!storeId) return new NextResponse("Store ID required", { status: 400 });

  // Verify membership
  const membership = await prisma.membership.findFirst({
    where: {
      userId: user.id,
      storeId: storeId,
    },
  });

  if (!membership) {
    return new NextResponse("Access Denied", { status: 403 });
  }

  // Set Cookie for Persistence
  // In a real app we might verify this cookie in middleware
  const response = NextResponse.json({ success: true, storeId });
  response.cookies.set("x-active-store-id", storeId, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return response;
}
