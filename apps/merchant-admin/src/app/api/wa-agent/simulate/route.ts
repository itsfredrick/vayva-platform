import { NextResponse } from "next/server";
import { GroqClient } from "@/lib/ai/groq-client";
import { requireAuth } from "@/lib/session";



export async function POST(req: Request) {
    try {
        const user = await requireAuth();
        
        const storeId = user.storeId;

        const { message } = await req.json();
        if (!message) return new NextResponse("Message required", { status: 400 });

        const groq = new GroqClient("WHATSAPP");

        const systemPrompt = `
        You are a Vayva Order Extraction Agent. 
        Analyze the WhatsApp message and extract order details in JSON format.
        
        Rules:
        1. Extract items (name, qty, price if mentioned).
        2. Extract delivery location if mentioned.
        3. Calculate total if prices are known.
        4. Suggest a polite response in the store's tone.
        
        Output format:
        {
            "intent": "ORDER_CREATION" | "INQUIRY" | "OTHER",
            "confidence": 0.0-1.0,
            "entities": {
                "items": [{ "name": string, "qty": number, "price": number | null }],
                "location": string | null,
                "total": number | null
            },
            "suggestedResponse": string
        }
        `;

        const response = await groq.chatCompletion([
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
        ], {
            jsonMode: true,
            model: "llama3-70b-8192",
            storeId: storeId
        });

        if (!response) {
            return NextResponse.json({
                success: false,
                error: "AI processing failed"
            }, { status: 500 });
        }

        const result = JSON.parse(response.choices[0].message.content || "{}");

        return NextResponse.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error("[SIMULATION ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
