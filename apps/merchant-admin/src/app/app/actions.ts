"use server";



import { prisma } from "@vayva/db";
import { requireAuth } from "@/lib/session";

export async function checkAppLaunchStatus() {
  const user = await requireAuth();

  const store = await prisma.store.findUnique({
    where: { id: user.storeId },
    select: { onboardingCompleted: true },
  });

  if (!store) return { status: "unauthenticated" }; // Safety fallback

  return {
    status: "authenticated",
    onboardingCompleted: store.onboardingCompleted,
  };
}
