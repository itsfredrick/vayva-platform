import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";


import { logAudit } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rate-limit";
import { requireAuth } from "@/lib/session";

export async function GET() {
  try {
    const user = await requireAuth();
    if (!user || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const storeId = user.storeId;

    const jobs = await prisma.exportJob.findMany({
      where: { merchantId: storeId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Export jobs fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    if (!user || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const storeId = user.storeId;
    const userId = user.id;

    // Rate Limit: 3 per hour
    await checkRateLimit(userId, "export_request", 3, 3600, storeId);

    const body = await req.json();
    const { type } = body;

    if (!type) {
      return NextResponse.json(
        { error: "Missing export type" },
        { status: 400 },
      );
    }

    const job = await prisma.exportJob.create({
      data: {
        merchantId: storeId,
        userId,
        type,
        status: "PENDING",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    await logAudit({
      storeId,
      actor: {
        type: "USER",
        id: userId,
        label: user.email || "Merchant",
      },
      action: "EXPORT_GENERATED",
      entity: { type: "ExportJob", id: job.id },
      after: { type },
    });

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Export request error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
