"use client";

import React, { useState, useEffect } from "react";
import { Button, Icon, cn, Input } from "@vayva/ui";
import { useOnboarding } from "@/context/OnboardingContext";

// Master Prompt Step 8: Delivery (Expanded)
// Logic Branching: Pickup hides delivery stages
// Timeline Editor: Rename/Reorder stages
// Proof Preview: Signature/Photo simulation

type DeliveryPolicy = "required" | "sometimes" | "pickup_only";
interface DeliveryStage {
  id: string;
  label: string;
  visibleToCustomer: boolean;
}

export default function DeliveryPage() {
  const { state, updateState, goToStep } = useOnboarding();
  const userPlan = state?.plan || "free";
  const isPro = userPlan === "pro";

  const [policy, setPolicy] = useState<DeliveryPolicy>("required");
  const [proof, setProof] = useState(false);

  // Load from context state (which is hydrated from DB)
  useEffect(() => {
    if (state?.delivery) {
      if (state.delivery.policy) setPolicy(state.delivery.policy as any);
      if (state.delivery.proofRequired !== undefined) setProof(state.delivery.proofRequired);
      if (state.delivery.pickupAddress) setPickupAddress(state.delivery.pickupAddress);
      // We could also load stages if saved
    }
  }, [state?.delivery]);

  const [stages, setStages] = useState<DeliveryStage[]>([
    { id: "prep", label: "Preparing", visibleToCustomer: true },
    { id: "out", label: "Out for delivery", visibleToCustomer: true },
    { id: "delivered", label: "Delivered", visibleToCustomer: true },
  ]);
  const [pickupAddress, setPickupAddress] = useState("");
  const [provider, setProvider] = useState("manual");
  const [sla, setSla] = useState("24 hours");

  const handleContinue = async () => {
    const deliveryData = {
      policy: policy,
      stages:
        policy !== "pickup_only"
          ? stages.map((s) => s.label)
          : ["Ready for Pickup"],
      proofRequired: proof,
      pickupAddress: policy !== "required" ? pickupAddress : undefined,
      defaultProvider: policy !== "pickup_only" ? provider : undefined,
      slaExpectation: policy !== "pickup_only" ? sla : undefined,
    };

    await updateState({
      delivery: deliveryData,
    });

    // CRITICAL: Save to database
    try {
      await fetch('/api/store/upsert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliveryPolicy: deliveryData.policy,
          deliveryStages: deliveryData.stages,
          deliveryProofRequired: deliveryData.proofRequired,
          deliveryPickupAddress: deliveryData.pickupAddress,
        })
      });
      console.log('[DELIVERY] Saved delivery settings to database');
    } catch (error) {
      console.error('[DELIVERY] Failed to save to database:', error);
    }

    await goToStep("kyc");
  };

  return (
    <div className="flex flex-col xl:flex-row h-full gap-12 max-w-7xl mx-auto items-start animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Left Column: Form - Glassmorphism UI */}
      <div className="flex-1 w-full max-w-2xl lg:pt-4">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
            Logistics <span className="text-transparent bg-clip-text bg-gradient-to-br from-black via-gray-700 to-gray-400">& Delivery</span>
          </h1>
          <p className="text-lg text-gray-400 font-medium">
            Define how your products reach your customers. Optimize for speed or reliability.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white shadow-2xl shadow-black/5 space-y-12 max-w-3xl mx-auto">
          {/* Policy Selection */}
          <div className="space-y-6">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
              Delivery Protocol
            </label>
            <div className="space-y-4">
              {[
                { id: "required", label: "Doorstep Delivery Required", desc: "Customers must provide a precise delivery address", icon: "Truck" },
                { id: "sometimes", label: "Hybrid: Delivery & Pickup", desc: "Offer flexibility for customers to choose their preference", icon: "Warehouse" },
                { id: "pickup_only", label: "Exclusive Pickup Only", desc: "Best for services or physical storefront collection", icon: "Store" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPolicy(opt.id as DeliveryPolicy)}
                  className={cn(
                    "group w-full text-left p-6 rounded-2xl border-2 transition-all duration-500 flex items-center gap-6 relative overflow-hidden",
                    policy === opt.id
                      ? "bg-black text-white border-black shadow-xl shadow-black/20"
                      : "bg-gray-50/50 border-gray-100 hover:border-gray-200 hover:bg-white",
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500",
                    policy === opt.id ? "bg-white/10" : "bg-white shadow-sm"
                  )}>
                    <Icon name={opt.icon as any} size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-sm uppercase tracking-tight">{opt.label}</h3>
                    <p className={cn(
                      "text-[10px] font-medium",
                      policy === opt.id ? "text-gray-400" : "text-gray-400"
                    )}>{opt.desc}</p>
                  </div>
                  {policy === opt.id && (
                    <div className="w-6 h-6 rounded-full bg-[#46EC13] flex items-center justify-center text-black animate-in zoom-in">
                      <Icon name="Check" size={14} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Branching Logic: Only show timeline config if not pickup only */}
          {policy !== "pickup_only" && (
            <div className="space-y-10 animate-in slide-in-from-top-4 fade-in duration-700">
              <div className="space-y-6">
                <div className="flex justify-between items-center px-1">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
                      <Icon name="ListChecks" size={16} />
                    </div>
                    <h4 className="font-black text-gray-900 text-sm tracking-tight">
                      Order Progress Stages
                    </h4>
                  </div>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    Visible to Customer
                  </span>
                </div>

                <div className="space-y-3 bg-black/[0.02] p-6 rounded-3xl border border-black/[0.02]">
                  {stages.map((stage, idx) => (
                    <div
                      key={stage.id}
                      className="group flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-500"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
                        {idx + 1}
                      </div>
                      <input
                        value={stage.label}
                        onChange={(e) => {
                          const newStages = [...stages];
                          newStages[idx].label = e.target.value;
                          setStages(newStages);
                        }}
                        className="flex-1 text-sm font-black text-gray-900 outline-none bg-transparent"
                      />
                      <button
                        onClick={() => {
                          const newStages = [...stages];
                          newStages[idx].visibleToCustomer = !newStages[idx].visibleToCustomer;
                          setStages(newStages);
                        }}
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                          stage.visibleToCustomer
                            ? "bg-[#46EC13]/10 text-[#2db500]"
                            : "bg-gray-100 text-gray-300",
                        )}
                      >
                        <Icon name={stage.visibleToCustomer ? "Eye" : "EyeOff"} size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className={cn(
                "p-8 bg-white rounded-3xl border border-gray-100 shadow-inner flex items-center justify-between group transition-all duration-500",
                !isPro && "opacity-80"
              )}>
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                    proof ? "bg-[#46EC13]/10 text-[#46EC13]" : "bg-gray-50 text-gray-400"
                  )}>
                    <Icon name="Camera" size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-gray-900 text-sm tracking-tight uppercase">
                        Proof of Fulfillment
                      </h4>
                      {!isPro && (
                        <div className="px-2 py-0.5 bg-gray-200 text-gray-500 text-[8px] font-black rounded-md uppercase">PRO</div>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Require couriers to upload photo or signature for every delivery.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => isPro && setProof(!proof)}
                  disabled={!isPro}
                  className={cn(
                    "w-14 h-8 rounded-full relative transition-all duration-500 border-2",
                    proof ? "bg-[#46EC13] border-[#46EC13]" : "bg-gray-100 border-transparent",
                    !isPro && "cursor-not-allowed opacity-50"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-500",
                    proof ? "translate-x-6" : "translate-x-0"
                  )} />
                </button>
              </div>
            </div>
          )}

          {/* Logistics Details */}
          <div className="space-y-8 pt-4">
            {policy !== "required" && (
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                  Collection Point
                </label>
                <div className="relative">
                  <Input
                    placeholder="e.g. 123 Main St, Ikeja, Lagos"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="h-14 bg-gray-50/50 border-gray-100 focus:border-black rounded-2xl font-bold transition-all pl-12"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                    <Icon name="MapPin" size={18} />
                  </div>
                </div>
              </div>
            )}

            {policy !== "pickup_only" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                    Logistics Partner
                  </label>
                  <div className="relative">
                    <select
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                      className="w-full h-14 bg-gray-50/50 border-2 border-gray-100 focus:border-black rounded-2xl font-bold transition-all px-12 appearance-none outline-none"
                    >
                      <option value="manual">Internal / Self</option>
                      <option value="kwik">Kwik Delivery (Recommended)</option>
                    </select>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                      <Icon name="BaggageClaim" size={18} />
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                      <Icon name="ChevronDown" size={16} />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                    Service Level (SLA)
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="e.g. Same Day, 24-48 Hours"
                      value={sla}
                      onChange={(e) => setSla(e.target.value)}
                      className="h-14 bg-gray-50/50 border-gray-100 focus:border-black rounded-2xl font-bold transition-all pl-12"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                      <Icon name="Clock" size={18} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-sm text-gray-400 font-medium italic">
              Step 6 of 9 • Logistics configuration
            </div>
            <Button
              onClick={handleContinue}
              className="!bg-black !text-white h-16 px-12 rounded-2xl text-lg font-black shadow-xl hover:shadow-black/20 hover:scale-105 active:scale-95 transition-all w-full md:w-auto group"
            >
              Continue to KYC
              <Icon name="ArrowRight" className="ml-3 w-5 h-5 transition-transform duration-500 group-hover:translate-x-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column: Premium Tracking Preview */}
      <div className="hidden xl:block flex-1 w-full sticky top-24 max-w-sm">
        <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] p-10 border border-white shadow-3xl shadow-black/[0.02] relative overflow-hidden h-[700px] flex flex-col">
          <div className="mb-10 text-center space-y-2">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
              Customer Journey
            </h3>
            <p className="text-gray-900 font-black text-lg">
              Live Order Tracking
            </p>
          </div>

          <div className="flex-1 relative">
            {/* Timeline Line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-1 bg-gradient-to-b from-[#46EC13] via-gray-100 to-gray-50 rounded-full" />

            <div className="space-y-12 pl-12 relative">
              {/* Static Start point */}
              <div className="relative group/step">
                <div className="absolute -left-[53px] top-1 w-10 h-10 rounded-2xl bg-[#46EC13] flex items-center justify-center text-black border-4 border-white shadow-lg shadow-[#46EC13]/20 z-10 transition-transform duration-500 group-hover/step:scale-110">
                  <Icon name="PackageCheck" size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 uppercase">Order Received</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Just now • Processing</p>
                </div>
              </div>

              {/* Dynamic Stages from Logic */}
              {policy !== "pickup_only" ? (
                stages
                  .filter((s) => s.visibleToCustomer)
                  .map((stage, idx) => (
                    <div key={stage.id} className="relative group/step animate-in fade-in slide-in-from-left-4" style={{ animationDelay: `${idx * 200}ms` }}>
                      <div className="absolute -left-[53px] top-1 w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-gray-300 border-2 border-gray-100 shadow-sm z-10 transition-all duration-500 group-hover/step:border-black group-hover/step:text-black">
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-gray-400 uppercase group-hover/step:text-gray-900 transition-colors">{stage.label}</h4>
                        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest italic font-mono">T-Pending</p>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="relative group/step animate-in zoom-in duration-700">
                  <div className="absolute -left-[53px] top-1 w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-[#46EC13] border-4 border-white shadow-xl z-10">
                    <Icon name="Navigation" size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900 uppercase">Ready for Pickup</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Awaiting customer</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Proof Simulation Overlay */}
          {proof && policy !== "pickup_only" && (
            <div className="mt-8 bg-black p-6 rounded-[2rem] border border-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#46EC13]/20 flex items-center justify-center text-[#46EC13]">
                  <Icon name="Shield" size={16} />
                </div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Secure Delivery Proof</h4>
              </div>
              <div className="grid grid-cols-2 gap-3 pb-2">
                <div className="aspect-square bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:bg-white/10 transition-all">
                  <Icon name="Image" size={18} className="text-white/40" />
                  <span className="text-[8px] font-black text-white/40 uppercase">Photo</span>
                </div>
                <div className="aspect-square bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:bg-white/10 transition-all">
                  <Icon name="PenTool" size={18} className="text-white/40" />
                  <span className="text-[8px] font-black text-white/40 uppercase">Signature</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full text-[8px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">
              <div className="w-1 h-1 rounded-full bg-[#46EC13] animate-pulse" />
              Live Configuration Link
            </div>
          </div>

          {/* Abstract decor */}
          <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden rounded-[3rem]">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-black/[0.01] rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/[0.01] rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
