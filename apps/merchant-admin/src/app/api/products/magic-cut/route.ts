import { NextRequest, NextResponse } from "next/server";
import { getTenantContext } from "@/lib/auth/tenantContext";
import { ImageService } from "@/lib/image/ImageService";
import { StorageService } from "@/lib/storage/storageService";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
    try {
        const ctx = await getTenantContext(req);
        const { imageUrl } = await req.json();

        if (!imageUrl) {
            return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
        }

        logger.info("[MagicCut] Starting background removal", { merchantId: ctx.merchantId, imageUrl });

        // 1. Process Image
        const processedBuffer = await ImageService.removeBackground(imageUrl);

        // 2. Upload Result
        const filename = `cutpro_${Date.now()}.png`;
        const newUrl = await StorageService.upload(ctx, filename, processedBuffer);

        logger.info("[MagicCut] Background removal successful", { merchantId: ctx.merchantId, newUrl });

        return NextResponse.json({ url: newUrl });
    } catch (error: any) {
        logger.error("[MagicCut] background removal failed", { error: error.message });
        return NextResponse.json(
            { error: error.message || "Failed to process image" },
            { status: 500 }
        );
    }
}
