import { logger } from "../logger";

export class ImageService {
    /**
     * Remove background from an image URL using Remove.bg
     * Returns the processed image as a Buffer or throws if fails.
     */
    static async removeBackground(imageUrl: string): Promise<Buffer> {
        const apiKey = process.env.REMOVE_BG_API_KEY;

        if (!apiKey) {
            logger.warn("[ImageService] REMOVE_BG_API_KEY is not set. Using mock behavior.");
            // In dev/test without key, we just fetch the original image
            const response = await fetch(imageUrl);
            return Buffer.from(await response.arrayBuffer());
        }

        try {
            const response = await fetch("https://api.remove.bg/v1.0/removebg", {
                method: "POST",
                headers: {
                    "X-Api-Key": apiKey,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image_url: imageUrl,
                    size: "auto",
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Remove.bg failed: ${error}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            return Buffer.from(arrayBuffer);
        } catch (error: any) {
            logger.error("[ImageService] Background removal failed", { error: error.message, imageUrl });
            throw error;
        }
    }
}
