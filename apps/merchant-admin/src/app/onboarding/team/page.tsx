"use client";

import React, { useState } from "react";
import { Button, Icon, cn, Input } from "@vayva/ui";
import { useOnboarding } from "@/context/OnboardingContext";

// Team & Connections: Team invitations + WhatsApp integration
type Role = "viewer" | "staff" | "admin";

export default function TeamPage() {
  const { updateState, goToStep } = useOnboarding();
  const [invites, setInvites] = useState<{ email: string; role: Role }[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("staff");
  const [activeRolePreview, setActiveRolePreview] = useState<Role>("staff");

  // WhatsApp state
  const [whatsappOption, setWhatsappOption] = useState<'connect' | 'later' | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const addInvite = () => {
    if (email && !invites.find((i) => i.email === email)) {
      setInvites([...invites, { email, role }]);
      setEmail("");
    }
  };

  const handleContinue = async () => {
    // Save team data
    await updateState({
      team: {
        type:
          invites.length > 0
            ? invites.length > 5
              ? "large"
              : "small"
            : "solo",
        invites,
      },
      whatsapp: whatsappOption === 'connect' ? { number: whatsappNumber } : undefined,
    });

    // Save to Database
    try {
      await fetch('/api/store/upsert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Save arbitrary objects into settings via our flexible upsert
          settings: {
            team: {
              type: invites.length > 0 ? (invites.length > 5 ? "large" : "small") : "solo",
              invites
            },
            whatsapp: whatsappOption === 'connect' ? { number: whatsappNumber } : undefined,
            whatsappConnected: whatsappOption === 'connect'
          }
        })
      });
      console.log('[TEAM] Saved settings to database');
    } catch (e) {
      console.error('[TEAM] Failed to save settings:', e);
    }

    // Go to review page (last step)
    await goToStep("review");
  };

  return (
    <div className="flex flex-col xl:flex-row h-full gap-12 max-w-7xl mx-auto items-start animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex-1 w-full max-w-2xl lg:pt-4">
        <div className="mb-10">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">
            Collaboration & Sync
          </label>
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
            Team & <span className="text-transparent bg-clip-text bg-gradient-to-br from-green-600 via-green-500 to-emerald-400">Connectivity</span>
          </h1>
          <p className="text-lg text-gray-400 font-medium max-w-lg">
            Assemble your team and bridge your communication channels in one secure step.
          </p>
        </div>

        <div className="space-y-8">
          {/* WhatsApp Section - Premium Glass */}
          <div className="bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white shadow-2xl shadow-black/5 space-y-8 transition-all duration-700">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest leading-none">WhatsApp Integration</h3>
              <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                <Icon name="Zap" size={16} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setWhatsappOption('connect')}
                className={cn(
                  "group text-left p-6 rounded-2xl border-2 transition-all duration-500 flex flex-col gap-4",
                  whatsappOption === 'connect'
                    ? "bg-black text-white border-black shadow-xl shadow-black/20"
                    : "bg-gray-50/50 border-gray-100 hover:border-gray-200 hover:bg-white"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                  whatsappOption === 'connect' ? "bg-white/10" : "bg-white shadow-sm"
                )}>
                  <Icon name="MessageCircle" size={24} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-tight">Connect Now</h4>
                  <p className={cn("text-[10px] font-medium leading-tight mt-1", whatsappOption === 'connect' ? "text-gray-400" : "text-gray-400")}>
                    Sync & Automate Chats
                  </p>
                </div>
              </button>

              <button
                onClick={() => setWhatsappOption('later')}
                className={cn(
                  "group text-left p-6 rounded-2xl border-2 transition-all duration-500 flex flex-col gap-4",
                  whatsappOption === 'later'
                    ? "bg-black text-white border-black shadow-xl shadow-black/20"
                    : "bg-gray-50/50 border-gray-100 hover:border-gray-200 hover:bg-white"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                  whatsappOption === 'later' ? "bg-white/10" : "bg-white shadow-sm"
                )}>
                  <Icon name="Clock" size={24} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-tight">Set up later</h4>
                  <p className={cn("text-[10px] font-medium leading-tight mt-1", whatsappOption === 'later' ? "text-gray-400" : "text-gray-400")}>
                    Continue without Sync
                  </p>
                </div>
              </button>
            </div>

            {whatsappOption === 'connect' && (
              <div className="animate-in slide-in-from-top-4 fade-in duration-500 space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Business Number</label>
                <Input
                  placeholder="+234 XXX XXX XXXX"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="h-16 bg-gray-50/50 border-gray-100 focus:border-black rounded-2xl font-black text-lg tracking-widest transition-all px-8"
                />
              </div>
            )}
          </div>

          {/* Team Section - Premium Glass */}
          <div className="bg-white/70 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] border border-white shadow-2xl shadow-black/5 space-y-8 transition-all duration-700">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest leading-none">Team Governance</h3>
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Icon name="Users" size={16} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                  <Input
                    placeholder="colleague@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 bg-gray-50/50 border-gray-100 focus:border-black rounded-2xl font-black text-base transition-all px-6"
                  />
                </div>
                <div className="md:w-48 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Access Tier</label>
                  <div className="relative">
                    <select
                      value={role}
                      onChange={(e) => {
                        setRole(e.target.value as Role);
                        setActiveRolePreview(e.target.value as Role);
                      }}
                      className="w-full h-14 bg-gray-50/50 border-2 border-gray-100 rounded-2xl px-6 text-sm focus:outline-none focus:border-black font-black appearance-none transition-all"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <Icon name="ChevronDown" size={16} />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={addInvite}
                disabled={!email}
                className="w-full h-14 bg-gray-900 hover:bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all duration-500 active:scale-95 group"
              >
                <Icon name="UserPlus" size={18} className="mr-3 transition-transform duration-500 group-hover:scale-110" />
                Issue Team Invitation
              </Button>

              {invites.length > 0 && (
                <div className="space-y-3 pt-6 border-t border-black/[0.02]">
                  {invites.map((inv, idx) => (
                    <div
                      key={inv.email}
                      className="flex items-center justify-between bg-white/50 p-4 rounded-2xl border border-gray-100 animate-in slide-in-from-left-4"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-black text-sm">
                          {inv.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-sm text-gray-900 tracking-tight">{inv.email}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                            Tier: <span className="text-black">{inv.role}</span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setInvites(invites.filter((i) => i.email !== inv.email))}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-200 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
                      >
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-10">
          <Button
            onClick={handleContinue}
            disabled={!whatsappOption}
            className={cn(
              "h-20 w-full rounded-[2rem] text-xl font-black shadow-2xl transition-all flex items-center justify-center gap-4 overflow-hidden relative group",
              whatsappOption ? "!bg-black !text-white hover:scale-105 active:scale-95 shadow-black/20" : "!bg-gray-100 !text-gray-400 cursor-not-allowed"
            )}
          >
            <span className="relative z-10 flex items-center gap-4">
              {invites.length > 0
                ? `Deploy ${invites.length} Invites & Continue`
                : "Proceed to Final Review"}
              <Icon name="ShieldCheck" size={24} className="transition-transform duration-500 group-hover:rotate-12" />
            </span>
            {whatsappOption && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />}
          </Button>

          {!whatsappOption && (
            <div className="flex items-center justify-center gap-3 py-2 animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
                Action Required: Select WhatsApp Protocol
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Role Preview - Premium Panel */}
      <div className="hidden xl:block flex-1 w-full sticky top-24 max-w-sm">
        <div className="bg-white/40 backdrop-blur-xl rounded-[3.5rem] p-4 border border-white shadow-3xl shadow-black/[0.02] relative overflow-hidden h-[700px] flex flex-col">
          <div className="bg-gray-50/50 rounded-[2.5rem] flex-1 overflow-hidden flex flex-col relative border border-white/50">
            <div className="p-8 pb-6 bg-white/50 border-b border-white/50">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2 leading-none">Security Architecture</h3>
              <h4 className="text-xl font-black text-gray-900 tracking-tight leading-none uppercase">Permission Matrix</h4>
            </div>

            <div className="flex-1 p-8 space-y-6 overflow-y-auto">
              {[
                {
                  id: "admin",
                  icon: "Shield",
                  label: "Administrator",
                  desc: "Master key. Global access to treasury, governance, and architecture settings.",
                  color: "text-amber-500",
                  bg: "bg-amber-50"
                },
                {
                  id: "staff",
                  icon: "User",
                  label: "Staff Operator",
                  desc: "Engine room access. Manage catalogs, orders, and customer intelligence.",
                  color: "text-blue-500",
                  bg: "bg-blue-50"
                },
                {
                  id: "viewer",
                  icon: "Eye",
                  label: "External Auditor",
                  desc: "Read-only perimeter. Insights and reports access without modification keys.",
                  color: "text-gray-500",
                  bg: "bg-gray-50"
                },
              ].map((r) => (
                <div
                  key={r.id}
                  className={cn(
                    "p-6 rounded-[2rem] border-2 transition-all duration-700 relative overflow-hidden",
                    activeRolePreview === r.id
                      ? "bg-black text-white border-black shadow-2xl shadow-black/20 scale-[1.05] z-10"
                      : "bg-white/30 text-gray-400 border-transparent opacity-50",
                  )}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-700",
                      activeRolePreview === r.id ? "bg-white/10" : r.bg
                    )}>
                      <Icon name={r.icon as any} size={20} className={activeRolePreview === r.id ? "text-white" : r.color} />
                    </div>
                    <span className="font-black text-sm uppercase tracking-tight">{r.label}</span>
                  </div>
                  <p className="text-[11px] font-medium leading-relaxed opacity-60 italic">{r.desc}</p>

                  {activeRolePreview === r.id && (
                    <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
                      <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white w-full animate-in slide-in-from-left duration-1000" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-8 mt-auto bg-black text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#46EC13] animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-widest">System Integrity Verified</p>
              </div>
              <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                Roles are enforced at the API gateway level with JWT authentication and RBAC protocols.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
