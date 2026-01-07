import { NextRequest, NextResponse } from "next/server";


import { prisma } from "@vayva/db";
import { randomBytes, createHash } from "crypto";
import { requireAuth } from "@/lib/session";

// In a real app, use S3 Presigned URL. For V1 local, we might just accept base64 or assuming url is passed if client uploads directly.
// Simulating an "Upload" where we create the job.

export async function POST(req: NextRequest) {
  const user = await requireAuth();
  

  const body = await req.json();
  const { filename, fileUrl } = body;
  // In real flow, usually Init gives a URL, then client uploads, then "Confirm".
  // Or client uploads to API.
  // Simplifying: Client says "I have this file", we create job.

  if (!filename || !fileUrl)
    return new NextResponse("Missing file info", { status: 400 });

  // Idempotency Check: Generate checksum if we can read file, OR client sends checksum.
  // For now, simpler uniqueness by fileUrl or random.
  const checksum = createHash("sha256")
    .update(fileUrl + Date.now())
    .digest("hex");

  const job = await prisma.importJob.create({
    data: {
      merchantId: user.storeId,
      type: "products_csv",
      status: "pending",
      originalFilename: filename,
      fileUrl: fileUrl,
      checksum,
      correlationId: randomBytes(16).toString("hex"),
      createdBy: user.id,
    },
  });

  return NextResponse.json(job);
}
