import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@vayva/db";
import { z } from "zod";

// Validation Schemas
const BaseProductSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.number().min(0),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),
});

import { SCHEMA_MAP } from "@/lib/product-schemas";

export async function POST(request: NextRequest) {
    try {
        const sessionUser = await getSessionUser();
        if (!sessionUser) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        // 1. Fetch Merchant to know Category
        const store = await prisma.store.findUnique({
            where: { id: sessionUser.storeId },
            select: { category: true }
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        const body = await request.json();

        // 2. Validate Base Fields
        const parseResult = BaseProductSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json({ error: "Invalid product data", details: parseResult.error.flatten() }, { status: 400 });
        }
        const { name, price, description, images } = parseResult.data;
        const attributes = body.attributes || {};
        const variants = body.variants || [];

        // 3. Validate Category Specific Attributes
        const schema = SCHEMA_MAP[store.category] || SCHEMA_MAP["retail"];
        const attrParse = schema.safeParse(attributes);
        if (!attrParse.success) {
            return NextResponse.json({
                error: `Invalid attributes for category: ${store.category}`,
                details: attrParse.error.flatten()
            }, { status: 400 });
        }

        // 4. Transactional Creation
        const result = await prisma.$transaction(async (tx) => {
            // A. Ensure Inventory Location exists
            let location = await tx.inventoryLocation.findFirst({
                where: { storeId: sessionUser.storeId, isDefault: true }
            });

            if (!location) {
                location = await tx.inventoryLocation.create({
                    data: {
                        storeId: sessionUser.storeId,
                        name: "Default Location",
                        isDefault: true
                    }
                });
            }

            // B. Create Product
            const product = await tx.product.create({
                data: {
                    storeId: sessionUser.storeId,
                    title: name,
                    handle: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now(),
                    price: price,
                    description: description,
                    metadata: attributes,
                }
            });

            // C. Handle Variants & Inventory
            if (variants.length > 0) {
                for (const v of variants) {
                    // Create Variant
                    const variant = await tx.productVariant.create({
                        data: {
                            productId: product.id,
                            title: v.title,
                            options: v.options,
                            price: v.price,
                            sku: v.sku,
                            trackInventory: true
                        }
                    });

                    // Create Inventory Item
                    await tx.inventoryItem.create({
                        data: {
                            locationId: location.id,
                            variantId: variant.id,
                            productId: product.id,
                            onHand: v.stock || 0,
                            available: v.stock || 0
                        }
                    });
                }
            } else {
                // Handle "Simple Product" as a Default Variant (Best Practice for Uniformity)
                // This ensures simple products also have inventory tracking
                const defaultVariant = await tx.productVariant.create({
                    data: {
                        productId: product.id, // Fixed: was using 'product' object, needed 'product.id'
                        title: "Default Title",
                        options: {},
                        price: price,
                        sku: body.sku || null, // Capture SKU from body for simple product
                        trackInventory: true
                    }
                });

                await tx.inventoryItem.create({
                    data: {
                        locationId: location.id,
                        variantId: defaultVariant.id,
                        productId: product.id,
                        onHand: body.stockQuantity || 0, // Capture stock from body
                        available: body.stockQuantity || 0
                    }
                });
            }

            // D. Handle Automotive Vehicle Data
            if (store.category === "Automotive" && body.vehicle) {
                const { year, make, model, vin, mileage, fuelType, transmission } = body.vehicle;
                await tx.vehicleProduct.create({
                    data: {
                        productId: product.id,
                        year: year || 0,
                        make: make || "Unknown",
                        model: model || "Unknown",
                        vin,
                        mileage: mileage || 0,
                        fuelType: fuelType || "PETROL",
                        transmission: transmission || "AUTOMATIC"
                    }
                });
            }

            // E. Handle Travel Accommodation Data
            if (store.category === "Travel" && body.accommodation) {
                const { type, maxGuests, bedCount, bathrooms, totalUnits } = body.accommodation;
                await tx.accommodationProduct.create({
                    data: {
                        productId: product.id,
                        type: type || "ROOM",
                        maxGuests: maxGuests || 2,
                        bedCount: bedCount || 1,
                        bathrooms: bathrooms || 1,
                        totalUnits: totalUnits || 1
                    }
                });
            }

            return product;
        });

        return NextResponse.json({
            success: true,
            product: {
                id: result.id,
                name: result.title,
                metadata: result.metadata
            }
        });

    } catch (error) {
        console.error("Create product error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
