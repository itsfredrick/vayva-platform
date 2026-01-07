import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";



export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const user = await requireAuth();


    const body = await req.json();
    const { message } = body;

    if (!message)
      return NextResponse.json({ error: "Message required" }, { status: 400 });

    // 1. Create Reply
    const reply = await prisma.ticketMessage.create({
      data: {
        ticketId: params.id,
        message,
        sender: "OPS",
        authorType: "OPS",
        authorId: user.id,
        authorName: `${user.name || "Admin"} (Support)`,
      },
    });

    // 2. Update Ticket Timestamp
    // 2. Update Ticket Metadata
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: params.id },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const updateData: any = { lastMessageAt: new Date() };
    if (!ticket.firstOpsReplyAt) {
      updateData.firstOpsReplyAt = new Date();
    }

    await prisma.supportTicket.update({
      where: { id: params.id },
      data: updateData,
    });

    // 3. (Optional) Trigger Notification to Merchant via Email/Dashboard

    return NextResponse.json(reply);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
