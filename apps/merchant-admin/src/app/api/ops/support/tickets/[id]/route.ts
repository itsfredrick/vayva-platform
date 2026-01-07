import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";



export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const user = await requireAuth();
    

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: params.id },
      include: {
        store: {
          select: { name: true, category: true },
        },
        handoffEvents: true,
        // messages: true // Uncomment when TicketMessage model is fully unified
      },
    });

    if (!ticket)
      return NextResponse.json({ error: "Not Found" }, { status: 404 });

    return NextResponse.json(ticket);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
