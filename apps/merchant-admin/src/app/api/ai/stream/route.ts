
import { GroqClient } from "@/lib/ai/groq-client";

export const runtime = "edge";

export async function POST(req: Request) {
    try {
        const { messages, storeId, requestId } = await req.json();

        const client = new GroqClient("MERCHANT");

        const result = await client.streamChat(messages, {
            storeId,
            requestId,
            model: "llama-3.1-8b-instant"
        });

        // Cast to any to bypass potential type definition mismatch in current env
        return (result as any).toDataStreamResponse();
    } catch (error) {
        return new Response(JSON.stringify({ error: "Streaming failed" }), { status: 500 });
    }
}
