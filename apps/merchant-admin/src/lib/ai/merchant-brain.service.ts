import { prisma } from "@vayva/db";
import { logger } from "@/lib/logger";

export interface RetrievalResult {
  content: string;
  sourceType: string;
  sourceId: string;
  score: number;
  metadata?: any;
}

export class MerchantBrainService {
  /**
   * Retrieve relevant knowledge for a query using semantic search
   */
  static async retrieveContext(
    storeId: string,
    query: string,
    limit: number = 3,
  ): Promise<RetrievalResult[]> {
    try {
      // 1. Generate embedding for the query
      // For now, we use a placeholder or check for OPENAI_API_KEY
      // In a real implementation, this would call an embedding API
      const queryEmbedding = await this.generateEmbedding(query);

      if (!queryEmbedding) {
        // Fallback to keyword search if embedding fails or key is missing
        logger.warn("[MerchantBrain] Falling back to keyword search for query", { query });
        const embeddings = await prisma.storeKnowledge.findMany({
          where: {
            storeId,
            content: { contains: query, mode: "insensitive" },
          },
          take: limit,
        });

        return embeddings.map((e: any) => ({
          content: e.content,
          sourceType: e.sourceType,
          sourceId: e.sourceId,
          score: 1.0,
          metadata: e.metadata,
        }));
      }

      // 2. Perform semantic search using raw SQL (pgvector)
      // distance = 1 - cosine_similarity. Lower is better.
      const results: any[] = await prisma.$queryRaw`
        SELECT 
          content, 
          "sourceType", 
          "sourceId", 
          metadata,
          1 - (embedding <=> ${JSON.stringify(queryEmbedding)}::vector) as similarity
        FROM "StoreKnowledge"
        WHERE "storeId" = ${storeId}
        ORDER BY embedding <=> ${JSON.stringify(queryEmbedding)}::vector ASC
        LIMIT ${limit}
      `;

      return results.map(r => ({
        content: r.content,
        sourceType: r.sourceType,
        sourceId: r.sourceId,
        score: Number(r.similarity),
        metadata: r.metadata,
      }));
    } catch (error: any) {
      logger.error("[MerchantBrain] Retrieval failed", {
        storeId,
        query,
        error,
      });
      return [];
    }
  }

  /**
   * Internal: Generate embeddings for text
   */
  // Pipeline instance for simple singleton pattern
  private static embeddingPipeline: any = null;

  /**
   * Internal: Generate embeddings for text using local model
   * Uses Xenova/all-MiniLM-L6-v2 (384 dimensions)
   */
  private static async generateEmbedding(text: string): Promise<number[] | null> {
    try {
      // Lazy load the pipeline
      if (!this.embeddingPipeline) {
        const { pipeline } = await import("@xenova/transformers");
        // Using quantized version by default (much faster, slightly less precision)
        this.embeddingPipeline = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
      }

      // Generate embedding
      // pooling: 'mean' and normalize: true are standard for sentence embeddings
      const output = await this.embeddingPipeline(text, { pooling: "mean", normalize: true });

      // Convert Tensor to array
      return Array.from(output.data);
    } catch (e: any) {
      logger.error("[MerchantBrain] Local embedding generation failed", { message: e.message });

      // Fallback: Mock embedding for verification/dev when binary is broken
      // 384 dimensions matching all-MiniLM-L6-v2
      if (process.env.NODE_ENV !== 'production' || process.env.MOCK_EMBEDDINGS === 'true') {
        logger.warn("[MerchantBrain] Using MOCK embedding (random noise) due to model failure.");
        return Array.from({ length: 384 }, () => Math.random() - 0.5);
      }

      return null;
    }
  }

  /**
   * Tool: Get real-time inventory count
   */
  static async getInventoryStatus(storeId: string, productId: string) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) return null;

      // Logic: if any variant is in stock, product is in stock.
      // We assume 'InventoryItem' holds the quantity in 'available' field.

      const totalStock = await prisma.inventoryItem.groupBy({
        by: ['productId'],
        where: { productId: product.id },
        _sum: {
          available: true
        }
      });

      const quantity = totalStock[0]?._sum.available || 0;

      return {
        productId,
        name: product.title,
        status: quantity > 0 || !product.trackInventory ? "IN_STOCK" : "OUT_OF_STOCK",
        available: product.trackInventory ? quantity : 999,
      };
    } catch (e: any) {
      logger.error("[MerchantBrain] Inventory check failed", { storeId, productId, error: e });
      return null; // Return null to indicate failure to retrieve (agent should handle this)
    }
  }

  /**
   * Tool: Calculate delivery cost and ETA
   * Deterministic pending based on rules, not hardcoded single value.
   */
  static async getDeliveryQuote(storeId: string, location: string) {
    try {
      // Find a zone that matches the location (simple check)
      const zones = await prisma.deliveryZone.findMany({
        where: { storeId },
      });

      const matchedZone = zones.find((z: any) =>
        z.name.toLowerCase().includes(location.toLowerCase()) ||
        z.states.some((s: any) => location.toLowerCase().includes(s.toLowerCase())) ||
        z.cities.some((c: any) => location.toLowerCase().includes(c.toLowerCase()))
      );

      if (matchedZone) {
        return {
          location,
          costKobo: Number(matchedZone.feeAmount) * 100, // Convert Decimal to Kobo (if stored as major unit)
          estimatedDays: `${matchedZone.etaMinDays}-${matchedZone.etaMaxDays} days`,
          carrier: "Vayva Logistics (Zone Match)",
        };
      }

      // Fallback: General profile default or Lagos default
      const isLagos = location.toLowerCase().includes("lagos");
      return {
        location,
        costKobo: isLagos ? 150000 : 350000, // 1500 or 3500 NGN
        estimatedDays: isLagos ? "1-2 days" : "3-5 days",
        carrier: "Vayva standard",
      };
    } catch (e: any) {
      logger.error("[MerchantBrain] Delivery quote failed", { storeId, location, error: e });
      return null;
    }
  }


  /**
   * Tool: Get active promotions for a store
   */
  static async getActivePromotions(storeId: string) {
    try {
      const now = new Date();
      const promos = await prisma.discountRule.findMany({
        where: {
          storeId,
          startsAt: { lte: now },
          OR: [
            { endsAt: null },
            { endsAt: { gte: now } }
          ]
        },
        take: 5
      });

      return promos.map((p: any) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        value: p.valueAmount ? `₦${p.valueAmount}` : `${p.valuePercent}%`,
        description: p.requiresCoupon ? "Requires coupon code" : "Automatic discount",
      }));
    } catch (e: any) {
      logger.error("[MerchantBrain] Promo fetch failed", { storeId, error: e });
      return [];
    }
  }


  /**
   * Admin: Index store catalog for RAG
   * Fetches products and policies, generates embeddings, and saves to KnowledgeEmbedding.
   */
  static async indexStoreCatalog(
    storeId: string,
  ): Promise<{ indexed: number; skipped: number; total: number }> {
    try {
      let indexed = 0;
      let skipped = 0;

      // 1. Fetch Products
      const products = await prisma.product.findMany({
        where: { storeId, status: "ACTIVE" },
      });

      for (const product of products) {
        const content = `Product: ${product.title}\nDescription: ${product.description || ""}\nType: ${product.productType || ""}\nPrice: ₦${product.price}`;
        const hash = this.generateHash(content);

        // Check if already indexed
        const existing = await prisma.storeKnowledge.findFirst({
          where: { storeId, sourceId: product.id, sourceType: "PRODUCT" },
        });

        if (existing && existing.contentHash === hash) {
          skipped++;
          continue;
        }

        const embedding = await this.generateEmbedding(content);
        if (embedding) {
          await prisma.storeKnowledge.upsert({
            where: { id: existing?.id || "new-id" },
            create: {
              storeId,
              sourceType: "PRODUCT",
              sourceId: product.id,
              content,
              contentHash: hash,
              embedding: embedding as any,
            } as any,
            update: {
              content,
              contentHash: hash,
              embedding: embedding as any,
              updatedAt: new Date(),
            } as any,
          });
          indexed++;
        }
      }

      // 2. Fetch Policies
      const policies = await prisma.merchantPolicy.findMany({
        where: { storeId, status: "PUBLISHED" },
      });

      for (const policy of policies) {
        const content = `Policy: ${policy.title}\nContent: ${policy.contentMd}`;
        const hash = this.generateHash(content);

        const existing = await prisma.storeKnowledge.findFirst({
          where: { storeId, sourceId: policy.id, sourceType: "POLICY" },
        });

        if (existing && existing.contentHash === hash) {
          skipped++;
          continue;
        }

        const embedding = await this.generateEmbedding(content);
        if (embedding) {
          await prisma.storeKnowledge.upsert({
            where: { id: existing?.id || "new-id" },
            create: {
              storeId,
              sourceType: "POLICY",
              sourceId: policy.id,
              content,
              contentHash: hash,
              embedding: embedding as any,
            } as any,
            update: {
              content,
              contentHash: hash,
              embedding: embedding as any,
              updatedAt: new Date(),
            } as any,
          });
          indexed++;
        }
      }

      return { indexed, skipped, total: products.length + policies.length };
    } catch (error: any) {
      logger.error("[MerchantBrain] Indexing failed", { storeId, error });
      return { indexed: 0, skipped: 0, total: 0 };
    }
  }


  /**
   * Tool: Create an order from an AI conversation
   */
  static async createOrderFromConversation(
    storeId: string,
    customerPhone: string,
    items: { productId: string; variantId?: string | null; quantity: number }[],
    address?: string
  ) {
    try {
      return await prisma.$transaction(async (tx: any) => {
        // 1. Fetch products and calculate totals
        let subtotal = 0;
        const lineItems = [];

        for (const item of items) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            include: { ProductVariant: true }
          });

          if (!product) throw new Error(`Product ${item.productId} not found`);

          let price = Number(product.price);
          let costPrice = product.costPrice ? Number(product.costPrice) : null;
          let title = product.title;

          if (item.variantId) {
            const variant = product.ProductVariant.find((v: any) => v.id === item.variantId);
            if (variant) {
              if (variant.price) price = Number(variant.price);
              if (variant.costPrice) costPrice = Number(variant.costPrice);
              title = `${product.title} - ${variant.title}`;
            }
          }

          subtotal += price * item.quantity;
          lineItems.push({
            productId: item.productId,
            variantId: item.variantId || null,
            title,
            price,
            costPrice,
            quantity: item.quantity
          });
        }

        const total = subtotal; // Simpler logic for AI orders: no tax/shipping calculated here yet

        // 2. Generate Reference & Order Number
        const refCode = `AI_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
        const orderNumber = `V${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`;

        // 3. Create Order
        const order = await tx.order.create({
          data: {
            storeId,
            customerPhone,
            refCode,
            orderNumber,
            source: "AI_WHATSAPP",
            status: "DRAFT", // Moves to PENDING once customer confirms
            paymentStatus: "INITIATED",
            subtotal,
            total,
            channel: "WHATSAPP",
            customerNote: address ? `Delivery Address: ${address}` : undefined,
            OrderItem: {
              create: lineItems
            }
          }
        });

        // 4. Reserve Stock
        // Note: InventoryService.reserveStock expects MerchantId (StoreId)
        const { InventoryService } = await import("../inventory/inventoryService");
        await InventoryService.reserveStock(storeId, order.id, items);

        logger.info("[MerchantBrain] Created AI Order", { orderId: order.id, storeId });

        return {
          orderId: order.id,
          orderNumber: order.orderNumber,
          total: Number(order.total),
          currency: order.currency,
          paymentInstructions: "Please pay to the dedicated virtual account to confirm your order."
        };
      });
    } catch (e: any) {
      logger.error("[MerchantBrain] Order creation failed", { storeId, error: e.message });
      throw e;
    }
  }

  /**
   * Internal: Generate hash for content change detection
   */
  private static generateHash(content: string): string {
    const crypto = require("crypto");
    return crypto.createHash("md5").update(content).digest("hex");
  }
}
