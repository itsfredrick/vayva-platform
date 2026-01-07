import { NextRequest, NextResponse } from "next/server";


import { SupportService } from "@/lib/support";
import { requireAuth } from "@/lib/session";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await requireAuth();
  

  try {
    const ticket = await SupportService.getTicketDetails(
      id,
      user.storeId,
    );
    return NextResponse.json(ticket);
  } catch (e) {
    return new NextResponse("Not Found", { status: 404 });
  }
}
