"use client";

import React, { useEffect, useState } from "react";
import { Icon, Button, cn } from "@vayva/ui";

interface UsageData {
  messagesUsed: number;
  messageLimit: number;
  isOverLimit: boolean;
  planKey: "STARTER" | "GROWTH" | "PRO";
  status: string;
}

export const AiUsageWidget = () => {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ai/usage")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setUsage(res.data.current);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="h-32 bg-gray-50 animate-pulse rounded-xl" />;
  if (!usage) return null;

  const percentage = Math.min(
    Math.round((usage.messagesUsed / usage.messageLimit) * 100),
    100,
  );
  const isCritical = percentage > 80;
  const isTrial = usage.planKey === "STARTER";

  return (
    <div className="relative overflow-hidden p-6 rounded-[2rem] border border-white/20 shadow-xl shadow-indigo-100/20 bg-gradient-to-br from-white/90 to-indigo-50/30 backdrop-blur-xl hover:scale-[1.01] transition-transform duration-300">
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={16} />
          </div>
          <div>
            <h3 className="font-bold text-[#0B0B0B] text-sm">AI Messages</h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">
              {isTrial ? "Free Trial Allocation" : `${usage.planKey} Plan`}
            </p>
          </div>
        </div>
        {usage.isOverLimit ? (
          <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            LIMIT EXCEEDED
          </span>
        ) : isCritical ? (
          <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            NEAR LIMIT
          </span>
        ) : (
          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            HEALTHY
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-600 font-medium">Messages Used</span>
            <span
              className={cn(
                "font-bold",
                isCritical ? "text-orange-600" : "text-[#0B0B0B]",
              )}
            >
              {usage.messagesUsed} / {usage.messageLimit}
            </span>
          </div>
          <div className="h-2.5 bg-gray-100/50 rounded-full overflow-hidden border border-gray-50 p-[1px]">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(34,197,94,0.3)]",
                usage.isOverLimit
                  ? "bg-gradient-to-r from-red-400 to-red-600"
                  : isCritical
                    ? "bg-gradient-to-r from-orange-400 to-orange-600"
                    : "bg-gradient-to-r from-green-400 to-green-600",
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Verbatim Copy Matrix Implementation */}
        <div className="bg-gray-50/50 backdrop-blur-sm p-4 rounded-2xl border border-dashed border-gray-200">
          <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
            {isTrial
              ? usage.isOverLimit
                ? "Trial complete! Your AI Assistant has handled its first 20 customers beautifully. To keep selling on autopilot, upgrade to a Growth plan today."
                : isCritical
                  ? `You're getting popular! You’ve used ${usage.messagesUsed} of your 20 trial messages. Upgrade to Growth now to keep the conversation going.`
                  : "Welcome to the future of sales! Your Vayva Assistant is ready to work. You have 20 free messages to see the magic in action."
              : isCritical
                ? "You're nearing your monthly message limit. Buy a ₦5,000 extra pack to ensure uninterrupted service."
                : `Your ${usage.planKey} plan is healthy. Remaining messages reset soon.`}
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          {(isTrial || usage.isOverLimit) && (
            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-10 rounded-2xl shadow-lg shadow-indigo-100 hover:shadow-xl transition-all"
              onClick={() => (window.location.href = "/dashboard/settings/billing")}
            >
              {isTrial ? "Upgrade to Growth" : "Manage Subscription"}
            </Button>
          )}

          {!isTrial && isCritical && (
            <Button
              variant="outline"
              className="w-full border-green-600 text-green-700 hover:bg-green-50 font-bold text-xs h-10 rounded-2xl"
            >
              Buy Extra Pack
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
