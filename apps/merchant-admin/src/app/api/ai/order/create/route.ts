import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            storeId,
            customerName,
            customerPhone,
            customerAddress,
            items,
            deliveryFee,
            totalAmount
        } = body;

        // Validation
        if (!storeId || !totalAmount || !items) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Get Store & Wallet DVA details
        const wallet = await prisma.wallet.findUnique({
            where: { storeId }
        });

        const store = await prisma.store.findUnique({ where: { id: storeId } });

        if (!wallet || !wallet.vaAccountNumber) {
            return NextResponse.json({
                error: "Merchant wallet not configured for transfers. Please ask merchant to enable Wallet Funding."
            }, { status: 400 });
        }

        // 2. Create/Find Customer
        // Simple logic: find by phone or create
        let customer = await prisma.customer.findFirst({
            where: {
                storeId,
                phone: customerPhone
            }
        });

        if (!customer && customerPhone) {
            const nameParts = (customerName || "Customer").split(" ");
            const firstName = nameParts[0];
            const lastName = nameParts.slice(1).join(" ") || "Unknown";

            customer = await prisma.customer.create({
                data: {
                    storeId,
                    firstName,
                    lastName,
                    phone: customerPhone
                }
            });
        }

        // 3. Create Order
        // Calculate subtotal from items if needed, or trust AI passed valid totals.
        // Assuming body.totalAmount includes deliveryFee.

        const order = await prisma.order.create({
            data: {
                storeId,
                customerId: customer?.id,
                customerPhone: customerPhone,
                refCode: nanoid(),
                orderNumber: `ORD-${nanoid(6).toUpperCase()}`,
                // customerName removed as it doesn't exist on Order model
                status: "PENDING_PAYMENT",
                paymentStatus: "PENDING",
                fulfillmentStatus: "UNFULFILLED",
                total: totalAmount,
                subtotal: totalAmount - (deliveryFee || 0),
                deliveryFee: deliveryFee || 0,
                OrderItem: {
                    create: items.map((item: any) => ({
                        productId: item.productId, // Optional if AI doesn't know ID
                        title: item.name || item.title || "Item", // Fixed: title is mandatory
                        quantity: item.quantity,
                        price: item.price,
                        sku: item.sku,
                        variantId: item.variantId // Optional
                    }))
                },
                channel: "AI_AGENT" as any
            }
        });

        // 4. Create Shipment Record (to store address)
        if (customerAddress) {
            await prisma.shipment.create({
                data: {
                    storeId,
                    orderId: order.id,
                    provider: "KWIK", // Defaulting to Kwik as per flow
                    status: "DRAFT", // Wait for payment before REQUESTED
                    recipientName: customerName,
                    recipientPhone: customerPhone,
                    addressLine1: customerAddress,
                    cost: deliveryFee
                }
            });
        }

        // 5. Return Payment Instructions (DVA)
        return NextResponse.json({
            success: true,
            orderId: order.id,
            totalAmount: totalAmount,
            paymentInstructions: {
                bankName: wallet.vaBankName,
                accountNumber: wallet.vaAccountNumber,
                accountName: wallet.vaAccountName
            },
            message: `Please transfer ₦${totalAmount} to ${wallet.vaBankName} - ${wallet.vaAccountNumber}`
        });

    } catch (error: any) {
        console.error("AI Order Create Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
