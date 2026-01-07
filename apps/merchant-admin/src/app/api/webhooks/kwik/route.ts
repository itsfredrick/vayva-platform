import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { FEATURES } from "@/lib/env-validation";
import { logger } from "@/lib/logger";

// Kwik Webhook Receiver
export async function POST(request: Request) {
  try {
    if (!FEATURES.DELIVERY_ENABLED) {
      return NextResponse.json(
        { error: "Delivery integration not configured" },
        { status: 503 },
      );
    }

    const bodyText = await request.text();
    const payload = JSON.parse(bodyText);

    // Kwik payload structure assumption:
    // { job_id: "...", status: "...", tracking_url: "..." }
    const { job_id, status, tracking_url } = payload;

    if (!job_id || !status) {
      return NextResponse.json({ error: "Invalid Payload" }, { status: 400 });
    }

    // 3. Find Shipment using trackingCode (mapped to External Job ID)
    const shipment = await prisma.shipment.findFirst({
      where: { trackingCode: job_id },
    });

    if (!shipment) {
      logger.warn(`[Kwik Webhook] Shipment not found for Job ID ${job_id}`);
      return NextResponse.json({ message: "Ignored: Shipment not found" });
    }

    // 4. Map Status
    const newStatus = mapKwikStatusToInternal(status);

    // 5. Update Shipment
    const currentNotes = shipment.notes || "";
    const newNote = `[${new Date().toISOString()}] Status Update: ${status}`;

    await prisma.$transaction([
      prisma.shipment.update({
        where: { id: shipment.id },
        data: {
          status: newStatus,
          trackingUrl: tracking_url || shipment.trackingUrl || undefined,
          notes: currentNotes ? `${currentNotes}\n${newNote}` : newNote,
        },
      }),
      prisma.deliveryEvent.create({
        data: {
          shipmentId: shipment.id,
          status: newStatus,
          providerStatus: status,
          note: `Raw payload: ${JSON.stringify(payload)}`
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    logger.error("[Kwik Webhook] Error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function mapKwikStatusToInternal(kwikStatus: string): string {
  const s = kwikStatus.toUpperCase();

  if (["QUEUED", "PENDING", "UPCOMING"].includes(s)) return "REQUESTED";
  if (["ASSIGNED", "ACCEPTED"].includes(s)) return "ACCEPTED";
  if (["PICKED_UP", "STARTED", "ON_WAY_TO_DROPOFF"].includes(s))
    return "IN_TRANSIT";
  if (["DELIVERED", "COMPLETED", "ENDED"].includes(s)) return "DELIVERED";
  if (["CANCELLED", "CANCELED"].includes(s)) return "CANCELED";
  if (["FAILED", "RETURNED"].includes(s)) return "FAILED";

  return "IN_TRANSIT";
}
