"use client";

import React, { useState, useEffect } from "react";
import { Icon, Button } from "@vayva/ui";
// Ensure this path is correct or create the shell if missing
import { ControlCenterShell } from "@/components/control-center/ControlCenterShell";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Inline Modal for simplicity if component doesn't exist
const AddDomainModal = ({ isOpen, onClose, onAdd, isLoading }: any) => {
    const [domain, setDomain] = useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Add Custom Domain</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><Icon name="X" size={16} /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1.5">Domain Name</label>
                        <input
                            autoFocus
                            placeholder="e.g. shop.mystore.com"
                            className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-1.5">Enter the full domain you want to connect.</p>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button
                            onClick={() => onAdd(domain)}
                            disabled={!domain || isLoading}
                            className="bg-black text-white hover:bg-gray-800"
                        >
                            {isLoading ? "Adding..." : "Add Domain"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface Domain {
    id: string;
    domain: string;
    status: string;
    verificationToken: string;
    createdAt: string;
}

export default function DomainsPage() {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchDomains = async () => {
        try {
            const res = await fetch("/api/store/domains");
            if (res.ok) {
                const data = await res.json();
                setDomains(data);
            }
        } catch (error) {
            console.error("Fetch domains error:", error);
            toast.error("Failed to load domains");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDomains();
    }, []);

    const handleAddDomain = async (domain: string) => {
        setAdding(true);
        try {
            const res = await fetch("/api/store/domains", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ domain }),
            });

            if (res.ok) {
                toast.success("Domain added. Please verify DNS.");
                setIsModalOpen(false);
                fetchDomains();
            } else {
                const err = await res.json();
                toast.error(err.error || "Failed to add domain");
            }
        } catch (error) {
            toast.error("Error adding domain");
        } finally {
            setAdding(false);
        }
    };

    return (
        <ControlCenterShell>
            <div className="p-8 space-y-10 max-w-6xl mx-auto">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 font-heading">
                            Domain Settings
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">
                            Manage your store's public web address and SSL certificates.
                        </p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} className="rounded-xl px-6 h-11 shadow-lg shadow-indigo-500/20 bg-black text-white hover:bg-gray-800">
                        <Icon name="Plus" className="mr-2" size={16} /> Add Domain
                    </Button>
                </div>

                {/* Primary Domain Status */}
                <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 group hover:shadow-md transition-all duration-500">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                            <Icon name="Globe" size={32} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-xl font-bold text-gray-900 tracking-tight">mystore.vayva.app</h2>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">Active</span>
                            </div>
                            <p className="text-xs text-gray-500 font-medium">Primary Storefront Address</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-xl h-10 px-5 text-xs font-bold border-gray-100 shadow-sm">Manage</Button>
                    </div>
                </div>

                {/* Custom Domain Section */}
                <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <Icon name="Link2" size={18} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Custom Domains</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {loading ? (
                            Array.from({ length: 2 }).map((_, i) => (
                                <div key={i} className="h-28 bg-white animate-pulse rounded-[24px] border border-gray-100 shadow-sm" />
                            ))
                        ) : domains.length > 0 ? (
                            domains.map((d) => (
                                <div key={d.id} className="p-6 bg-white rounded-[24px] border border-gray-100 flex items-center justify-between shadow-sm hover:shadow-md hover:border-black/5 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                            <Icon name="Globe" size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-base mb-0.5 tracking-tight">{d.domain}</p>
                                            <div className="flex items-center gap-3">
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                                                    Status: <span className={cn("font-bold", d.status === 'verified' ? "text-green-600" : "text-yellow-600")}>{d.status.toUpperCase()}</span>
                                                </p>
                                                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                                                <p className="text-[10px] text-gray-400 font-mono tracking-tighter">Token: {d.verificationToken}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button variant="outline" size="sm" className="rounded-xl h-9 px-4 text-[10px] font-bold uppercase tracking-widest border-gray-100 hover:border-black hover:bg-black hover:text-white transition-all">Verify DNS</Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 bg-gray-50/30 rounded-[32px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-300 mb-6 shadow-sm ring-1 ring-black/5">
                                    <Icon name="Globe" size={32} />
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2 tracking-tight">Secure Your Brand</h3>
                                <p className="text-xs text-gray-500 font-medium max-w-sm mb-8 leading-relaxed">
                                    Connect your own custom domain (e.g., www.jewelry.com) to give your store a professional identity.
                                </p>
                                <Button onClick={() => setIsModalOpen(true)} variant="outline" className="rounded-xl h-11 px-8 text-xs font-bold border-gray-100 bg-white shadow-sm hover:scale-105 active:scale-95 transition-all">
                                    Connect Custom Domain
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AddDomainModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddDomain}
                isLoading={adding}
            />
        </ControlCenterShell>
    );
}
