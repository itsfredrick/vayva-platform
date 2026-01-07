"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@vayva/ui";
import { useRouter } from "next/navigation";

export function GoLiveCard() {
  const router = useRouter();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  async function fetchStatus() {
    try {
      const res = await fetch("/api/merchant/store/publish/status");
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoLive() {
    setProcessing(true);
    try {
      const res = await fetch("/api/merchant/store/publish/go-live", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        // Success
        fetchStatus();
        // Optionally show confetti
      } else {
        if (res.status === 409) {
          // Blocked
          alert("Cannot go live. Please fix blockers.");
          fetchStatus(); // Refresh to ensure we see latest blockers
        } else {
          alert("Error: " + (data.message || "Failed"));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  }

  async function handleUnpublish() {
    if (!confirm("Are you sure? Your store will go offline.")) return;
    setProcessing(true);
    try {
      await fetch("/api/merchant/store/publish/unpublish", {
        method: "POST",
        body: JSON.stringify({ reason: "Merchant initiated" }),
      });
      fetchStatus();
    } finally {
      setProcessing(false);
    }
  }

  if (loading)
    return <div className="h-48 bg-gray-100 rounded-xl animate-pulse"></div>;
  if (!status) return null;

  const isLive = status?.isLive;
  const readiness = status?.readiness || {};
  const isReady = readiness.level === "ready";
  const blockers =
    readiness.issues?.filter((i: any) => i.severity === "blocker") || [];

  return (
    <div className="glass-card p-6 rounded-3xl shadow-sm border-none">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Store Status</h3>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Public Presence</p>
        </div>
        <div className="relative">
          <div
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-500 shadow-sm ${isLive
                ? "bg-green-500 text-white shadow-green-100"
                : "bg-gray-100 text-gray-400"
              }`}
          >
            {isLive ? "Live" : "Offline"}
          </div>
          {isLive && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-25" />
          )}
        </div>
      </div>

      {isLive ? (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50/50 backdrop-blur-sm rounded-2xl border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600">
              <Icon name="Globe" size={20} />
            </div>
            <div className="flex-1">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Storefront URL
              </div>
              <a
                href="#"
                className="text-sm font-bold text-gray-900 hover:text-indigo-600 transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                vayva.ng/store
              </a>
            </div>
            <button
              onClick={handleUnpublish}
              disabled={processing}
              className="px-3 py-1.5 text-[10px] text-red-500 font-bold hover:bg-red-50 rounded-lg transition-all"
            >
              Unpublish
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {!isReady && (
            <div className="bg-orange-50/50 backdrop-blur-sm p-4 rounded-2xl border border-orange-100">
              <div className="flex items-center gap-2 mb-3 text-orange-800 font-bold text-sm">
                <Icon name="AlertTriangle" size={16} />
                <span>Requires Attention</span>
              </div>
              <div className="space-y-2">
                {blockers.map((b: any) => (
                  <div
                    key={b.code}
                    className="text-xs text-orange-700 flex items-center justify-between bg-white/50 p-2 rounded-xl"
                  >
                    <span className="font-medium">• {b.title}</span>
                    {b.actionUrl && (
                      <a
                        href={b.actionUrl}
                        className="text-[10px] font-bold uppercase bg-orange-100 text-orange-800 px-2 py-1 rounded-lg hover:bg-orange-200 transition-colors"
                      >
                        Fix
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleGoLive}
            disabled={!isReady || processing}
            className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all group ${!isReady
                ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-inner"
                : "bg-black text-white hover:bg-gray-800 hover:shadow-xl shadow-lg shadow-black/10 active:scale-[0.98]"
              }`}
          >
            {processing ? (
              <Icon name="Loader2" size={18} className="animate-spin" />
            ) : (
              <>
                <span>Launch My Store</span>
                <Icon name="ArrowRight" size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {!isReady && (
            <p className="text-[10px] text-gray-400 text-center font-medium">
              Complete the above tasks to enable your storefront.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
