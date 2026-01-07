import { NextRequest, NextResponse } from "next/server";


import { SupportService } from "@/lib/support";
import { requireAuth } from "@/lib/session";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await requireAuth();
  

  const body = await req.json();

  try {
    // Ensure ownership first
    await SupportService.getTicketDetails(id, user.storeId);

    const { storeId, id: userId } = user as any;
    const msg = await SupportService.addMessage(
      id,
      "merchant_user",
      userId,
      body.message,
    );
    return NextResponse.json(msg);
  } catch (e) {
    return new NextResponse("Error", { status: 400 });
  }
}
