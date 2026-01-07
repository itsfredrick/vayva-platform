import { NextRequest, NextResponse } from "next/server";


import { SupportService } from "@/lib/support";
import { requireAuth } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = await requireAuth();
  

  const tickets = await SupportService.getMerchantTickets(
    user.storeId,
  );
  return NextResponse.json(tickets);
}

export async function POST(req: NextRequest) {
  const user = await requireAuth();
  

  const body = await req.json();

  const { storeId, id: userId } = user as any;
  const ticket = await SupportService.createTicket({
    storeId: storeId,
    userId: userId,
    type: body.type,
    subject: body.subject,
    description: body.description,
    priority: body.priority,
  });

  return NextResponse.json(ticket);
}
