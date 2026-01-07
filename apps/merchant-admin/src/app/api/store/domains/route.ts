import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";
import { z } from "zod";

export async function GET() {
    try {
        const user = await requireAuth();
        const storeId = user.storeId;

        const domains = await prisma.customDomain.findMany({
            where: { storeId },
            orderBy: { createdAt: "desc" }
        });

        // Mock verification token if not present since schema might not have it exposed in the previous view
        const enriched = domains.map(d => ({
            ...d,
            verificationToken: d.expectedValue || "vayva-verify-" + d.id.slice(0, 8)
        }));

        return NextResponse.json(enriched);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await requireAuth();
        const storeId = user.storeId;
        const body = await req.json();

        // Validate domain format
        if (!body.domain || !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(body.domain)) {
            return NextResponse.json({ error: "Invalid domain format" }, { status: 400 });
        }

        const domain = await prisma.customDomain.create({
            data: {
                storeId,
                domain: body.domain,
                status: "pending_verification",
                verificationType: "cname",
                expectedValue: "cname.vayva.store"
            }
        });

        return NextResponse.json(domain);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Domain already registered" }, { status: 409 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
