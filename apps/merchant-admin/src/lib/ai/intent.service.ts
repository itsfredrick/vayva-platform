
import { GroqClient } from "./groq-client";
import { logger } from "@/lib/logger";
import { AI_PROMPTS } from "./prompts";

export type IntentType = "NAVIGATE" | "SEARCH" | "ACTION" | "CHAT";

export interface IntentResult {
    intent: IntentType;
    confidence: number;
    payload: {
        path?: string;
        query?: string;
        action?: string;
        params?: Record<string, any>;
    };
    originalQuery: string;
}



export class IntentService {
    private groq: GroqClient;

    constructor() {
        this.groq = new GroqClient("SUPPORT"); // Uses MARKETING_KEY which is typically high-throughput
    }

    async classify(query: string): Promise<IntentResult> {
        try {
            const response = await this.groq.chatCompletion(
                [
                    { role: "system", content: AI_PROMPTS.INTENT.system },
                    { role: "user", content: query },
                ],
                {
                    model: "llama-3.1-8b-instant",
                    temperature: 0, // Deterministic
                    jsonMode: true,
                    maxTokens: 128,
                }
            );

            if (!response || !response.choices[0]?.message?.content) {
                return this.fallback(query);
            }

            const content = response.choices[0].message.content;
            const parsed = JSON.parse(content);

            return {
                intent: parsed.intent || "CHAT",
                confidence: parsed.confidence || 0,
                payload: parsed.payload || {},
                originalQuery: query,
            };
        } catch (error) {
            logger.error("[IntentService] Classification failed", { error, query });
            return this.fallback(query);
        }
    }

    private fallback(query: string): IntentResult {
        return {
            intent: "CHAT",
            confidence: 0,
            payload: {},
            originalQuery: query,
        };
    }
}
