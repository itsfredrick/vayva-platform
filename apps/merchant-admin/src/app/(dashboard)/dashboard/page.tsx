"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ErrorBoundary } from "@vayva/ui";
import Link from "next/link";
import { Skeleton } from "@/components/LoadingSkeletons";
import { OnboardingIncompleteAlert } from "@/components/dashboard/OnboardingIncompleteAlert";

// Lazy Load Heavy Components
const GoLiveCard = dynamic(
  () =>
    import("@/components/dashboard/GoLiveCard").then((mod) => mod.GoLiveCard),
  {
    loading: () => <Skeleton className="h-48 w-full rounded-xl" />,
    ssr: false, // Client-side interaction mostly
  },
);

const DashboardSetupChecklist = dynamic(
  () =>
    import("@/components/dashboard/DashboardSetupChecklist").then(
      (mod) => mod.DashboardSetupChecklist,
    ),
  {
    loading: () => <Skeleton className="h-64 w-full rounded-xl" />,
  },
);

const ActivationWelcome = dynamic(
  () =>
    import("@/components/dashboard/ActivationWelcome").then(
      (mod) => mod.ActivationWelcome,
    ),
  {
    loading: () => <Skeleton className="h-32 w-full rounded-xl" />,
  },
);

// Import Widgets lazily as well
const BusinessHealthWidget = dynamic(
  () =>
    import("@/components/dashboard/BusinessHealthWidget").then(
      (mod) => mod.BusinessHealthWidget,
    ),
  {
    loading: () => <Skeleton className="h-64 w-full rounded-xl" />,
  },
);

const AICoachWidget = dynamic(
  () =>
    import("@/components/dashboard/AICoachWidget").then(
      (mod) => mod.AICoachWidget,
    ),
  {
    loading: () => <Skeleton className="h-48 w-full rounded-xl" />,
    ssr: false,
  },
);

const InsightHub = dynamic(
  () =>
    import("@/components/dashboard/InsightHub").then((mod) => mod.InsightHub),
  {
    loading: () => <Skeleton className="h-64 w-full rounded-xl" />,
    ssr: false,
  },
);

const AiUsageWidget = dynamic(
  () =>
    import("@/components/dashboard/AiUsageWidget").then(
      (mod) => mod.AiUsageWidget,
    ),
  {
    loading: () => <Skeleton className="h-64 w-full rounded-xl" />,
  },
);



import { authClient } from "@/lib/neon-auth";
// import { ProFeatureUpsell } from "@/components/dashboard/ProFeatureUpsell"; // Removed


import { useAuth } from "@/context/AuthContext";
// ... imports

export default function DashboardPage() {
  const { merchant } = useAuth();
  const { data: session } = authClient.useSession();
  const [healthData, setHealthData] = React.useState<any>(null);
  const [insights, setInsights] = React.useState<any[]>([]);
  const [storePlan, setStorePlan] = React.useState<string | null>(null);

  React.useEffect(() => {
    // 1. Fetch Store Plan (Reliable Pro Check)
    fetch("/api/auth/merchant/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.store?.plan) {
          setStorePlan(data.store.plan);
        }
      })
      .catch(console.error);

    // 2. Fetch Health
    fetch("/api/dashboard/health")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setHealthData(res.data);
      })
      .catch(console.error);
  }, []);

  const isPro = storePlan === "PRO" || storePlan === "GROWTH";

  // Fetch insights if Pro
  React.useEffect(() => {
    if (isPro) {
      fetch("/api/ai/insights")
        .then((res) => res.json())
        .then((data) => setInsights(data))
        .catch(console.error);
    }
  }, [isPro]);

  const firstName = session?.user?.name?.split(" ")[0] || "Merchant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-6 max-w-7xl mx-auto space-y-6"
    >
      <OnboardingIncompleteAlert />
      {/* ... Header and other components ... */}

      <header className="mb-4 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
          Overview
        </h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">
          Welcome back, {firstName}.
        </p>
      </header>

      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <ActivationWelcome />
      </Suspense>

      {/* AI Business Coach Section */}
      <section>
        {isPro && (
          <Suspense fallback={<Skeleton className="h-32 w-full" />}>
            <AICoachWidget />
          </Suspense>
        )}
      </section>

      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <DashboardSetupChecklist />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Metrics Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ErrorBoundary>
              <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                {healthData ? (
                  <BusinessHealthWidget data={healthData} />
                ) : (
                  <Skeleton className="h-64 w-full rounded-xl" />
                )}
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary>
              <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                <AiUsageWidget />
              </Suspense>
            </ErrorBoundary>
          </div>

          {/* Insight Hub */}
          <section>
            {isPro && (
              <div className="space-y-4">
                <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                  <InsightHub insights={insights} />
                </Suspense>
              </div>
            )}
          </section>
        </div>

        {/* ... Right Column components ... */}
        <div className="space-y-6">
          {/* Operations Column */}
          <Suspense fallback={<Skeleton className="h-48 w-full" />}>
            <GoLiveCard />
          </Suspense>

          {/* Quick Actions */}
          <div className="glass-card p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold mb-4 text-gray-900">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/dashboard/products" className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-colors flex items-center justify-between group">
                <span>Add Product</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>
              <Link href="/dashboard/designer" className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-colors flex items-center justify-between group">
                <span>Customize Theme</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>
              <Link href="/dashboard/orders" className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg transition-colors flex items-center justify-between group">
                <span>View Orders</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
