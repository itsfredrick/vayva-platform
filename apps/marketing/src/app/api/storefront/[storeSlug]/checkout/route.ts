import { NextResponse } from "next/server";
import { PaystackService } from "@/lib/paystack";
import { prisma } from "@vayva/db";

export async function POST(
    request: Request,
    props: { params: Promise<{ storeSlug: string }> }
) {
    try {
        const body = await request.json();
        const params = await props.params;
        const { storeSlug } = params;

        // In a real implementation:
        // 1. Fetch Store by slug to get secret key (if custom) or use env
        // Also fetch subaccount code for split payments
        const store = await prisma.store.findUnique({
            where: { slug: storeSlug },
            select: {
                id: true,
                paystackSubaccountCode: true
            }
        });

        // 2. Validate items prices against DB
        // 3. Create Order record in DB (status: PENDING)

        console.log(`[Checkout] Processing order for store: ${storeSlug}`, body);

        // Calculate total amount in kobo (Assuming body.total is in NGN)
        const amountKobo = Math.round(body.total * 100);

        // Prepare Paystack Payload
        const payload: any = {
            email: body.email || "guest@example.com",
            amount: amountKobo,
            callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/store/${storeSlug}/verify`,
            metadata: {
                storeSlug,
                storeId: store?.id,
                cart: body.items,
                custom_fields: [
                    {
                        display_name: "Store",
                        variable_name: "store_slug",
                        value: storeSlug
                    }
                ]
            }
        };

        // If store has a subaccount, split payment
        if (store?.paystackSubaccountCode) {
            payload.subaccount = store.paystackSubaccountCode;
            // payload.bearer = "subaccount"; // Uncomment if merchant pays the fees
        }

        // Initialize Paystack
        const response = await PaystackService.initializeTransaction(payload);

        // Update Order record with reference... (Skipped for this audit scope but crucial)

        return NextResponse.json({
            success: true,
            message: "Payment initialized",
            authorization_url: response.data.authorization_url,
            reference: response.data.reference
        });

    } catch (error: any) {
        console.error("[Checkout] Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
