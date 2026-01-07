import { logger } from "@/lib/logger";

export interface InstagramMessage {
    id: string;
    senderId: string;
    recipientId: string;
    text: string;
    timestamp: Date;
}

export class InstagramService {
    /**
     * Send a message to an Instagram user via Graph API
     */
    static async sendMessage(accessToken: string, recipientId: string, text: string) {
        try {
            const response = await fetch(`https://graph.facebook.com/v21.0/me/messages`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    recipient: { id: recipientId },
                    message: { text },
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Instagram API failed: ${error}`);
            }

            return await response.json();
        } catch (error: any) {
            logger.error("[Instagram] Failed to send message", { error: error.message, recipientId });
            throw error;
        }
    }

    /**
     * Handle incoming Instagram Webhook
     */
    static async handleWebhook(storeId: string, payload: any) {
        // Foundational logic for webhook processing
        // This will lead into the SalesAgent flow eventually
        logger.info("[Instagram] Received webhook", { storeId, entries: payload.entry?.length });

        // entries -> messaging -> message
        // 1. Identify customer/contact
        // 2. Route to AI Agent
        // 3. Respond via sendMessage
    }
}
