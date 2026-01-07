import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { withRBAC } from "@/lib/team/rbac";
import { PERMISSIONS } from "@/lib/team/permissions";
import { logAuditEvent, AuditEventType } from "@/lib/audit";

function sanitizeHtml(html: string) {
  if (!html) return "";
  // Simple regex-based sanitization for high-risk tags
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "");
}

// Permissive GET for Onboarding context
export async function GET(request: Request) {
  try {
    // Use getOnboardingUser (permissive) instead of strict RBAC
    const { getOnboardingUser } = await import("@/lib/session");
    const user = await getOnboardingUser();

    // In onboarding context, if no session or store, it often means the user just landed 
    // or is in the middle of creating one. Returning 401 causes client noise.
    // Return empty list to degrade gracefully.
    if (!user || !user.storeId) {
      // console.warn("[API] Products GET: No active store session, returning empty");
      return NextResponse.json([]);
    }

    const storeId = user.storeId;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where: any = { storeId };
    if (status) where.status = status;

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        InventoryItem: true,
        ProductImage: true
      }
    });

    const formattedProducts = products.map((product: any) => {
      const totalQuantity = product.InventoryItem?.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0) || 0;

      return {
        id: product.id,
        merchantId: product.storeId,
        type: "RETAIL",
        name: product.title,
        description: product.description || "",
        price: Number(product.price),
        currency: "NGN",
        status: product.status,
        inventory: {
          enabled: product.trackInventory,
          quantity: totalQuantity,
        },
        itemsSold: 0,
        createdAt: product.createdAt.toISOString(),
        image: product.ProductImage?.[0]?.url || null,
      };
    });

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Fetch Products Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

// Permissive POST for Onboarding context (supports single or bulk)
export async function POST(request: Request) {
  try {
    // Use getOnboardingUser (permissive) instead of strict RBAC
    const { getOnboardingUser } = await import("@/lib/session");
    const user = await getOnboardingUser();

    if (!user || !user.storeId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const storeId = user.storeId;
    const userId = user.id;
    const body = await request.json();

    // Normalize to array for bulk processing
    const items = Array.isArray(body) ? body : [body];
    const results = [];

    for (const item of items) {
      try {
        // Create product
        const product = await prisma.product.create({
          data: {
            storeId,
            title: item.name,
            description: sanitizeHtml(item.description),
            handle:
              item.handle || (item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
                "-" +
                Math.random().toString(36).substring(2, 7)),
            price: item.price,
            status: item.status || "ACTIVE",
            productType: item.type,
            sku: item.sku,
            trackInventory: item.trackInventory ?? true,
            ProductImage: item.images ? {
              create: item.images.map((img: any, idx: number) => ({
                url: img.url,
                position: idx,
              }))
            } : undefined,
          },
          include: {
            ProductImage: true,
          }
        });
        results.push(product);

        // Audit Log (doing strictly one by one to ensure logs are accurate)
        // In high volume, this should be bunched, but for onboarding (max 20 items), it's fine.
        await logAuditEvent(storeId, userId, "PRODUCT_CREATED", {
          productId: product.id,
          name: product.title,
          price: product.price,
        });

      } catch (innerError) {
        console.error(`[API] Failed to create product ${item.name}:`, innerError);
        // Continue processing other items
      }
    }

    // If single item was requested, return it directly to maintain backward compatibility
    if (!Array.isArray(body) && results.length > 0) {
      return NextResponse.json(results[0]);
    }

    return NextResponse.json({ success: true, count: results.length, products: results });

  } catch (error: any) {
    console.error("Create Product Error:", {
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: `Failed to create product: ${error.message}` },
      { status: 500 },
    );
  }
}
