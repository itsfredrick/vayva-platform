import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { prisma } from "@vayva/db";
import { logAuditEvent, AuditEventType } from "@/lib/audit";

export async function GET() {
  try {
    const user = await requireAuth();
    const storeId = user.storeId;

    const domainMapping = await prisma.domainMapping.findFirst({
      where: { storeId },
    });

    return NextResponse.json(domainMapping || { status: "none" });
  } catch (error: any) {
    console.error("Domain fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch domain settings" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const { checkPermission } = await import("@/lib/team/rbac");
    const { PERMISSIONS } = await import("@/lib/team/permissions");
    const user = await checkPermission(PERMISSIONS.DOMAINS_MANAGE);

    const storeId = user.storeId;
    const body = await req.json();

    const { domain } = body;

    if (!domain) {
      return NextResponse.json(
        { error: "Domain name is required" },
        { status: 400 },
      );
    }

    const mapping = await prisma.domainMapping.upsert({
      where: { domain },
      create: {
        storeId,
        domain,
        status: "pending",
        verificationToken: `vayva-verify-${Math.random().toString(36).substring(7)}`,
      },
      update: {
        storeId,
        status: "pending",
      },
    });

    // Log audit event
    await logAuditEvent(storeId, user.id, AuditEventType.DOMAIN_CHANGED, {
      domain,
      mappingId: mapping.id,
    });

    return NextResponse.json(mapping);
  } catch (error: any) {
    console.error("Domain mapping error:", error);
    return NextResponse.json(
      { error: "Failed to initiate domain mapping" },
      { status: 500 },
    );
  }
}
