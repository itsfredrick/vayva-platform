import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";



export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireAuth();

    const customer = await prisma.customer.findUnique({
      where: {
        id: id,
        storeId: user.storeId // Security check
      },
      include: {
        // Get recent orders
        orders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            orderNumber: true,
            total: true,
            status: true,
            paymentStatus: true,
            createdAt: true,
            OrderItem: {
              select: { id: true }
            }
          }
        },
        addresses: true
      }
    });

    if (!customer) {
      return new NextResponse("Customer not found", { status: 404 });
    }

    // Calculate LTV
    const aggregations = await prisma.order.aggregate({
      where: {
        storeId: user.storeId,
        customerId: customer.id,
        paymentStatus: 'SUCCESS' // Only count paid
      },
      _sum: {
        total: true
      },
      _count: {
        id: true
      }
    });

    const totalSpent = aggregations._sum.total || 0;
    const orderCount = aggregations._count.id || 0;

    // Mocking conversations for now as Message model is complex and might be heavy to fetch all.
    // But the user said "No Mock Data".
    // I should fetch real conversations if they exist.
    // Check 'Conversation' model.
    let conversations: any[] = [];
    if (customer.phone || customer.email) {
      // Try to find conversation by contact match? 
      // Schema: Conversation -> Contact. Contact has phoneE164.
      // Customer has phone.
      // This linking is best effort.
      // For now, let's fetch any conversation linked to this customer? 
      // Schema doesn't link Conversation -> Customer directly, it links Conversation -> Contact.
      // And Customer has `whatsappContactId`? Check schema.
      // Line 554: whatsappContactId String?

      if (customer.whatsappContactId) {
        const convs = await prisma.conversation.findMany({
          where: { contactId: customer.whatsappContactId, storeId: user.storeId },
          include: { messages: { take: 1, orderBy: { createdAt: 'desc' } } }
        });
        conversations = convs.map((c: any) => ({
          id: c.id,
          lastMessage: c.messages[0]?.textBody || "Active",
          date: c.lastMessageAt,
          platform: 'WhatsApp'
        }));
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...customer,
        totalSpent,
        totalOrders: orderCount,
        averageOrderValue: orderCount > 0 ? Number(totalSpent) / orderCount : 0,
        conversations
      }
    });

  } catch (error) {
    console.error("[CUSTOMER_DETAIL_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
