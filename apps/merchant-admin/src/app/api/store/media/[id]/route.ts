import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { prisma } from "@vayva/db";
import { del } from "@vercel/blob";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuth();
        const { id } = await params;

        const media = await prisma.storeMedia.findFirst({
            where: {
                id,
                storeId: user.storeId,
            },
        });

        if (!media) {
            return NextResponse.json(
                { error: "Media not found" },
                { status: 404 }
            );
        }

        // Delete from Blob if it's a blob URL
        if (media.url.includes("public.blob.vercel-storage.com")) {
            await del(media.url, {
                token: process.env.BLOB_READ_WRITE_TOKEN,
            });
        }

        // Delete from DB
        await prisma.storeMedia.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[DELETE_MEDIA_ERROR]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
