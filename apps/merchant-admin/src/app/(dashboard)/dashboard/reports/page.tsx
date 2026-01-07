"use client";

import { useState, useEffect } from "react";
import { useUserPlan } from "@/hooks/useUserPlan";
import { PLANS, PlanKey } from "@/lib/billing/plans";
import { Card, Button, Input } from "@vayva/ui";
import { Icon } from "@vayva/ui";
import { format, subDays } from "date-fns";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";

export default function ReportsPage() {
    const { tier: plan, loading: planLoading } = useUserPlan();
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState<any>(null);

    // Default range
    const [date, setDate] = useState<DateRange | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    });

    // Check if advanced analytics is allowed
    const isAllowed = PLANS[plan as PlanKey]?.features.advancedAnalytics;

    useEffect(() => {
        if (isAllowed && date?.from && date?.to) {
            fetchSummary();
        }
    }, [date, isAllowed]);

    const fetchSummary = async () => {
        try {
            const res = await fetch("/api/reports/summary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ range: { from: date?.from, to: date?.to } })
            });
            if (res.ok) {
                const data = await res.json();
                setSummary(data);
            }
        } catch (error) {
            console.error("Failed to fetch summary:", error);
        }
    };

    if (planLoading) return <div className="p-8">Loading...</div>;

    if (!isAllowed) {
        return (
            <div className="p-8 max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="p-4 bg-gray-100 rounded-full">
                    <Icon name="Lock" size={48} className="text-gray-400" />
                </div>
                <h1 className="text-2xl font-bold">Advanced Reports are Locked</h1>
                <p className="text-gray-500 max-w-md">Upgrade to the Pro plan to access detailed financial statements, customer lists, and reconciliation reports.</p>
                <Button
                    onClick={() => window.open('https://api.whatsapp.com/send?phone=2348000000000&text=I%20want%20to%20upgrade%20to%20Pro', '_blank')}
                    className="mt-4"
                >
                    Upgrade to Pro
                </Button>
            </div>
        );
    }

    const handleExport = async (type: string, title: string) => {
        if (!date?.from || !date?.to) {
            toast.error("Please select a date range");
            return;
        }

        setLoading(true);
        toast.loading(`Generating ${title}...`);

        try {
            const res = await fetch("/api/reports/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type,
                    range: { from: date.from, to: date.to }
                })
            });

            if (!res.ok) throw new Error("Export failed");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${type}_report_${format(date.from, "yyyy-MM-dd")}_to_${format(date.to, "yyyy-MM-dd")}.csv`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast.success("Download started");
        } catch (e) {
            toast.error("Failed to generate report");
        } finally {
            setLoading(false);
            toast.dismiss();
        }
    };

    const reports = [
        {
            id: "finances",
            title: "Financial Statement",
            desc: "All payments, refunds, and transaction fees.",
            icon: "Banknote"
        },
        {
            id: "orders",
            title: "Orders Report",
            desc: "Detailed breakdown of all orders and their status.",
            icon: "ShoppingBag"
        },
        {
            id: "customers",
            title: "Customer List",
            desc: "Export all customer data and purchase history.",
            icon: "Users"
        },
        {
            id: "reconciliation",
            title: "Reconciliation",
            desc: "Match orders with payments to find discrepancies.",
            icon: "Scale"
        }
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold mb-2">Reports & Analytics</h1>
                <p className="text-gray-500">Export detailed data for your accounting and records.</p>
            </div>

            {/* Date Selection */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div className="flex items-center gap-2">
                    <Icon name="Calendar" className="text-gray-400" />
                    <span className="text-sm font-medium">
                        Selected: {format(date?.from || new Date(), "MMM d")} - {format(date?.to || new Date(), "MMM d")}
                    </span>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDate({ from: subDays(new Date(), 7), to: new Date() })}
                        className={`text-xs ${format(date?.from || new Date(), "MMM d") === format(subDays(new Date(), 7), "MMM d") && format(date?.to || new Date(), "MMM d") === format(new Date(), "MMM d") ? "bg-gray-100" : ""}`}
                    >
                        Last 7 Days
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDate({ from: subDays(new Date(), 30), to: new Date() })}
                        className={`text-xs ${format(date?.from || new Date(), "MMM d") === format(subDays(new Date(), 30), "MMM d") && format(date?.to || new Date(), "MMM d") === format(new Date(), "MMM d") ? "bg-gray-100" : ""}`}
                    >
                        Last 30 Days
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDate({ from: new Date(new Date().setDate(1)), to: new Date() })}
                        className={`text-xs ${format(date?.from || new Date(), "MMM d") === format(new Date(new Date().setDate(1)), "MMM d") && format(date?.to || new Date(), "MMM d") === format(new Date(), "MMM d") ? "bg-gray-100" : ""}`}
                    >
                        This Month
                    </Button>
                </div>
            </div>

            {/* Profitability Summary Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Gross Sales</p>
                    <h2 className="text-2xl font-bold text-gray-900">₦{summary?.grossSales?.toLocaleString() || "0"}</h2>
                </Card>
                <Card className="p-6">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">COGS (Expenses)</p>
                    <h2 className="text-2xl font-bold text-gray-900 text-state-error">₦{summary?.totalCogs?.toLocaleString() || "0"}</h2>
                </Card>
                <Card className="p-6 bg-primary/10 border-primary/20">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-bold text-primary uppercase tracking-wider">Gross Profit</p>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">
                            {summary?.grossSales > 0 ? ((summary.grossProfit / summary.grossSales) * 100).toFixed(1) : 0}%
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold text-primary">₦{summary?.grossProfit?.toLocaleString() || "0"}</h2>
                </Card>
                <Card className="p-6">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Net Flow</p>
                    <h2 className="text-2xl font-bold text-gray-900">₦{summary?.netSales?.toLocaleString() || "0"}</h2>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reports.map((r) => (
                    <Card key={r.id} className="p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                                <Icon name={r.icon as any} size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">{r.title}</h3>
                                <p className="text-sm text-gray-500">{r.desc}</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => handleExport(r.id, r.title)}
                            disabled={loading}
                            variant="outline"
                            className="w-full justify-between"
                        >
                            <span>Export CSV</span>
                            <Icon name="Download" size={16} />
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
}
