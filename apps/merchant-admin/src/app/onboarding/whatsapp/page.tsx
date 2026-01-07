"use client";

import React, { useState } from "react";
import { Button, Icon, cn, Input } from "@vayva/ui";
import { useOnboarding } from "@/context/OnboardingContext";

export default function WhatsAppPage() {
  const { updateState, goToStep } = useOnboarding();
  const [mode, setMode] = useState<
    "decision" | "connect" | "verify" | "success"
  >("decision");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const handleLater = async () => {
    await updateState({
      whatsappConnected: false,
      whatsapp: { number: undefined },
    });
    await goToStep("products");
  };

  const handleConnectStart = () => setMode("connect");

  const handleSendOtp = () => {
    if (phoneNumber.length > 5) setMode("verify");
  };

  const handleVerifyOtp = async () => {
    if (otp.length === 6) {
      setMode("success");
    }
  };

  const handleSuccessContinue = async () => {
    await updateState({
      whatsappConnected: true,
      whatsapp: { number: phoneNumber },
    });
    await goToStep("products");
  };

  return (
    <div className="flex flex-col xl:flex-row h-full gap-12 max-w-7xl mx-auto items-start animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Left Column: Interaction */}
      <div className="flex-1 w-full max-w-2xl lg:pt-4">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
            WhatsApp <span className="text-transparent bg-clip-text bg-gradient-to-br from-green-600 via-green-500 to-emerald-400">Integration</span>
          </h1>
          <p className="text-lg text-gray-400 font-medium max-w-lg">
            Connect your business account to automate sales and engage customers with AI-powered replies.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white shadow-2xl shadow-black/5 space-y-12 transition-all duration-700">
          {mode === "decision" && (
            <div className="space-y-6 animate-in slide-in-from-top-4 fade-in duration-700">
              <button
                onClick={handleConnectStart}
                className="group w-full text-left p-8 rounded-[2rem] border-2 border-transparent bg-black text-white hover:scale-[1.02] active:scale-95 transition-all duration-500 flex items-center gap-8 relative overflow-hidden shadow-2xl shadow-black/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-[1.25rem] bg-green-500 text-black flex items-center justify-center shrink-0 z-10 transition-transform duration-700 group-hover:rotate-12">
                  <Icon name="MessageCircle" size={32} />
                </div>
                <div className="flex-1 z-10">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-black text-lg uppercase tracking-tight">
                      Express Setup
                    </h3>
                    <div className="px-2 py-0.5 bg-[#46EC13] text-black text-[8px] font-black rounded-md uppercase animate-pulse">
                      Recommended
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 font-medium">
                    Auto-sync catalogs, automate orders, and secure data history in 60 seconds.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center z-10 group-hover:bg-[#46EC13] group-hover:text-black transition-all">
                  <Icon name="ArrowRight" size={20} />
                </div>
              </button>

              <button
                onClick={handleLater}
                className="group w-full text-left p-8 rounded-[2rem] border-2 border-gray-100 bg-white/50 hover:bg-white hover:border-black transition-all duration-500 flex items-center gap-8"
              >
                <div className="w-16 h-16 rounded-[1.25rem] bg-gray-50 text-gray-400 flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-white transition-all duration-500">
                  <Icon name="Clock" size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-lg text-gray-900 uppercase tracking-tight">Skip for now</h3>
                  <p className="text-xs text-gray-400 font-medium">
                    You can always return to this in the Control Center later.
                  </p>
                </div>
              </button>
            </div>
          )}

          {mode === "connect" && (
            <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-700">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                  Business Intelligence Identifier
                </label>
                <div className="flex gap-4">
                  <div className="bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 flex items-center text-gray-900 text-base font-black">
                    +234
                  </div>
                  <Input
                    placeholder="80 1234 5678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-16 bg-gray-50/50 border-gray-100 focus:border-black rounded-2xl font-black text-lg tracking-widest transition-all"
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Button
                  onClick={handleSendOtp}
                  className="w-full h-16 !bg-black text-white rounded-2xl text-lg font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Generate Verification Code
                </Button>
                <button
                  onClick={() => setMode("decision")}
                  className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] hover:text-black transition-colors py-2"
                >
                  ← Go Back
                </button>
              </div>
            </div>
          )}

          {mode === "verify" && (
            <div className="space-y-8 animate-in zoom-in-95 duration-700">
              <div className="space-y-6 text-center">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400">
                  Enter 6-Digit Code
                </label>
                <div className="flex justify-center gap-3">
                  {/* Simplified input for now, keeping it one block but adding tracking */}
                  <Input
                    placeholder="1 2 3 4 5 6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="h-20 text-center tracking-[1em] text-3xl font-black border-transparent bg-gray-50/50 focus:bg-white focus:border-black/10 rounded-2xl transition-all max-w-[320px]"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-gray-400 font-medium">A secure authentication code was sent to <span className="text-gray-900 font-black">+234 {phoneNumber}</span></p>
              </div>
              <div className="flex flex-col gap-4">
                <Button
                  onClick={handleVerifyOtp}
                  className="w-full h-16 !bg-green-600 hover:!bg-green-700 text-white rounded-2xl text-lg font-black shadow-xl shadow-green-500/20"
                >
                  Confirm & Synchronize
                </Button>
                <button
                  onClick={() => setMode("connect")}
                  className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] hover:text-black transition-colors py-2"
                >
                  Modify Number
                </button>
              </div>
            </div>
          )}

          {mode === "success" && (
            <div className="text-center py-10 animate-in zoom-in-95 duration-1000 space-y-8">
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-[#46EC13] text-black rounded-[2rem] flex items-center justify-center mx-auto shadow-3xl shadow-[#46EC13]/40 animate-bounce">
                  <Icon name="Check" size={48} />
                </div>
                {/* Orbital dots */}
                <div className="absolute -top-4 -right-4 w-4 h-4 bg-black rounded-full animate-ping" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none uppercase">
                  Connected
                </h3>
                <p className="text-gray-400 font-medium">
                  Synchronization complete. Your assistant is now active.
                </p>
              </div>
              <Button
                onClick={handleSuccessContinue}
                className="w-full h-16 !bg-black text-white rounded-2xl text-lg font-black shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                Continue to Inventory
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Premium Benefit Panel */}
      <div className="hidden xl:block flex-1 w-full sticky top-24 max-w-sm">
        <div className="bg-white/40 backdrop-blur-xl rounded-[3.5rem] p-4 border border-white shadow-3xl shadow-black/[0.02] relative overflow-hidden h-[700px] flex flex-col">
          {/* Phone Header Decoration */}
          <div className="bg-gray-50/50 rounded-[2.5rem] flex-1 overflow-hidden flex flex-col relative border border-white/50">
            <div className="p-8 pb-4 border-b border-white/50 flex bg-white/50 items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#46EC13]/10 text-[#2db500] flex items-center justify-center shrink-0">
                <Icon name="Zap" size={24} />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight">VAYVA AI ENGINE</h4>
                <p className="text-xs font-black text-gray-900 tracking-tight leading-none">Intelligence Active</p>
              </div>
            </div>

            <div className="flex-1 p-8 space-y-8 overflow-y-auto">
              {/* Chat Bubbles */}
              <div className="space-y-6">
                <div className="flex flex-col items-start gap-2 max-w-[80%]">
                  <div className="bg-white p-4 rounded-3xl rounded-tl-sm shadow-sm border border-gray-100 text-[11px] font-medium text-gray-500 leading-relaxed italic animate-in slide-in-from-left-4">
                    "Hi, I'd like to order the classic leather boots in size 42."
                  </div>
                  <span className="text-[8px] font-black text-gray-300 uppercase ml-1">Customer • 10:30 AM</span>
                </div>

                <div className="flex flex-col items-end gap-2 max-w-[85%] ml-auto">
                  <div className="bg-black p-5 rounded-3xl rounded-tr-sm shadow-xl text-[11px] font-black text-white leading-relaxed animate-in slide-in-from-right-4 duration-1000">
                    <div className="flex items-center gap-2 mb-2 text-[#46EC13] text-[9px] uppercase tracking-tighter">
                      <Icon name="Bot" size={14} /> AI ASSISTANT
                    </div>
                    "Excellent choice! I've found those in stock. I've created order <span className="text-[#46EC13]">#VY-9021</span>. Click below to confirm."
                  </div>
                  <span className="text-[8px] font-black text-gray-300 uppercase mr-1">Vayva Engine • Just Now</span>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="mt-12 space-y-4 pt-10 border-t border-gray-100">
                {[
                  { icon: "Zap", label: "Zero-Latency Orders", desc: "Convert chats to cart instantly." },
                  { icon: "ShieldCheck", label: "End-to-End Secure", desc: "Bank-grade data protection." },
                  { icon: "BarChart3", label: "Automated Insights", desc: "Know what customers want." },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-4 group cursor-default">
                    <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-300 group-hover:bg-black group-hover:text-[#46EC13] transition-all duration-500">
                      <Icon name={b.icon as any} size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{b.label}</p>
                      <p className="text-[9px] text-gray-400 font-medium leading-none">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Decor */}
            <div className="p-8 mt-auto flex justify-center">
              <div className="w-24 h-1.5 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
