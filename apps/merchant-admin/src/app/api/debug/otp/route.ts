
import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email") || "fred@123.design";

        const codes = await prisma.verification.findMany({
            orderBy: { createdAt: "desc" },
            take: 20
        });

        const user = await prisma.user.findUnique({
            where: { email }
        });

        return NextResponse.json({
            user: {
                id: user?.id,
                email: user?.email,
                emailVerified: user?.emailVerified
            },
            codes: codes.map(c => ({
                id: c.id,
                identifier: c.identifier,
                code: c.value,
                expiresAt: c.expiresAt,
                createdAt: c.createdAt,
                isExpired: new Date() > new Date(c.expiresAt),
                now: new Date()
            }))
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
