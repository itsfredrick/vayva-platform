import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { prisma } from "@vayva/db";

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const user = await requireAuth();
        const { searchParams } = new URL(request.url);
        const filename = searchParams.get("filename");

        // Check if filename is provided
        if (!filename) {
            return NextResponse.json(
                { error: "Filename is required" },
                { status: 400 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "File is required" },
                { status: 400 }
            );
        }

        // 1. Upload to Vercel Blob
        const blob = await put(filename, file, {
            access: "public",
            // Add token if not in env automatically (for safety, though env is preferred)
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        // 2. Create Record in DB
        const media = await prisma.storeMedia.create({
            data: {
                storeId: user.storeId,
                name: filename,
                url: blob.url,
                type: file.type.split("/")[0] || "unknown", // e.g. "image"
                size: (file.size / 1024).toFixed(2) + " KB",
                source: "upload",
            },
        });

        return NextResponse.json(media);
    } catch (error) {
        console.error("[UPLOAD_ERROR]", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
