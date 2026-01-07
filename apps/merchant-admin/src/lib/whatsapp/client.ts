
import { env } from "@/lib/config/env";

const BASE_URL = `https://graph.facebook.com/v19.0/${env.WHATSAPP_PHONE_NUMBER_ID}`;

export const WhatsAppClient = {
    async sendText(to: string, body: string, previewUrl = false) {
        if (!env.WHATSAPP_ACCESS_TOKEN || !env.WHATSAPP_PHONE_NUMBER_ID) {
            console.error("WhatsApp credentials missing");
            return null;
        }

        const response = await fetch(`${BASE_URL}/messages`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: to,
                type: "text",
                text: {
                    preview_url: previewUrl,
                    body: body
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("WhatsApp Send Error:", data);
            throw new Error(data.error?.message || "Failed to send message");
        }

        return data;
    },

    async markRead(messageId: string) {
        if (!env.WHATSAPP_ACCESS_TOKEN || !env.WHATSAPP_PHONE_NUMBER_ID) return;

        await fetch(`${BASE_URL}/messages`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                status: "read",
                message_id: messageId
            })
        }).catch(err => console.error("Mark read failed", err));
    }
};
