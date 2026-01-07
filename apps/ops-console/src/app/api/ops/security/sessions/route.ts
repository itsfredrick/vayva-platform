import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const { user } = await OpsAuthService.requireSession();
    if (!["OPS_OWNER", "OPS_ADMIN", "OPS_SECURITY"].includes(user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const sessions = await prisma.merchantSession.findMany({
        where: {
            expiresAt: { gt: new Date() }
        },
        orderBy: { createdAt: "desc" },
        take: 50
    });

    const userIds = [...new Set(sessions.map(s => s.userId))];

    const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, email: true, firstName: true, lastName: true }
    });

    const data = sessions.map(session => ({
        ...session,
        user: users.find(u => u.id === session.userId) || null
    }));

    return NextResponse.json({ data });
}
