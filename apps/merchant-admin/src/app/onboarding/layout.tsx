import { getOnboardingUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@vayva/db";
import { OnboardingClientLayout } from "./OnboardingClientLayout";
import { OnboardingProvider } from "@/context/OnboardingContext";

export const dynamic = "force-dynamic";

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getOnboardingUser();

  if (!user) {
    redirect("/signin");
  }

  // Only check store if it exists (legacy/migration)
  if (user.storeId) {
    const store = await prisma.store.findUnique({
      where: { id: user.storeId },
      select: { onboardingCompleted: true },
    });

    if (store?.onboardingCompleted) {
      redirect("/dashboard");
    }
  }

  return (
    <OnboardingProvider>
      <OnboardingClientLayout>{children}</OnboardingClientLayout>
    </OnboardingProvider>
  );
}
