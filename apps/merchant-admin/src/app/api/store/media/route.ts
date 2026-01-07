import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { prisma } from "@vayva/db";

export async function GET() {
    try {
        const user = await requireAuth();
        const media = await prisma.storeMedia.findMany({
            where: { storeId: user.storeId },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(media);
    } catch (error) {
        console.error("[API] Get Media Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch media assets" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const user = await requireAuth();
        const body = await req.json();
        const { name, url, type, size } = body;

        // In a real app, we would validate the URL or handle file upload here.
        // For now, we trust the client has uploaded to Blob/S3 and is giving us the URL.

        const newMedia = await prisma.storeMedia.create({
            data: {
                storeId: user.storeId,
                name,
                url,
                type: type || "image",
                size: size || "unknown",
            },
        });

        return NextResponse.json(newMedia);
    } catch (error) {
        console.error("[API] Upload Media Error:", error);
        return NextResponse.json(
            { error: "Failed to create media record" },
            { status: 500 }
        );
    }
}
