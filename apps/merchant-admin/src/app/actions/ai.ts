"use server"

import { IntentService } from "@/lib/ai/intent.service"

export async function classifyIntent(query: string) {
    const intentService = new IntentService();
    const result = await intentService.classify(query);
    return result;
}
