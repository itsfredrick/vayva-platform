import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { getDeliveryProvider } from "@/lib/delivery/DeliveryProvider";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { storeId, customerAddress, customerName, customerPhone, items } = body;

        if (!storeId || !customerAddress) {
            return NextResponse.json({ error: "Missing required fields: storeId, customerAddress" }, { status: 400 });
        }

        // 1. Fetch Store Delivery Settings
        const store = await prisma.store.findUnique({
            where: { id: storeId },
            include: { deliverySettings: true }
        });

        if (!store || !store.deliverySettings) {
            return NextResponse.json({ error: "Store delivery settings not found" }, { status: 404 });
        }

        const settings = store.deliverySettings;

        if (!settings.isEnabled) {
            return NextResponse.json({ error: "Delivery is disabled for this store" }, { status: 400 });
        }

        // 2. Prepare Estimate Request
        const provider = getDeliveryProvider(settings.provider);
        const parcelDescription = Array.isArray(items)
            ? items.map((i: any) => `${i.quantity}x ${i.name}`).join(", ")
            : "Goods";

        const estimate = await provider.getEstimate(
            {
                name: settings.pickupName || store.name,
                phone: settings.pickupPhone || "",
                address: settings.pickupAddressLine1 || "",
                city: settings.pickupCity || ""
            },
            {
                name: customerName || "Customer",
                phone: customerPhone || "",
                address: customerAddress,
                city: "" // In a real AI flow, AI might extract city. For now, Kwik wraps address string usually if city missing? Kwik requires City sometimes.
                // Assuming AI provides address string that includes city or Kwik handles it.
            },
            {
                description: parcelDescription
            }
        );

        if (!estimate.success) {
            return NextResponse.json({ error: estimate.error || "Failed to get estimate" }, { status: 500 });
        }

        // Apply Markup
        const MARKUP_AMOUNT = 700;
        const finalPrice = (estimate.price || 0) + MARKUP_AMOUNT;

        return NextResponse.json({
            deliveryPrice: finalPrice,
            currency: estimate.currency,
            originalPrice: estimate.price, // Internal check
            duration: estimate.estimated_duration
        });

    } catch (error: any) {
        console.error("AI Quote Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
