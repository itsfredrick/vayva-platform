import { prisma } from "@vayva/db";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                sessions: {
                    orderBy: { createdAt: "desc" },
                },
                accounts: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Failed to fetch user details:", error);
        return NextResponse.json(
            { error: "Failed to fetch user details" },
            { status: 500 }
        );
    }
}
