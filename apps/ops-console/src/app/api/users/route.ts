import { prisma } from "@vayva/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                emailVerified: true,
                image: true,
            },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}
