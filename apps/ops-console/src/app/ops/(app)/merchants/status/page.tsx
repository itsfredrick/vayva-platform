
"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
    Search,
    Loader2,
    CalendarClock,
    CreditCard,
    AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MerchantStatus {
    id: string;
    name: string;
    ownerName: string;
    ownerEmail: string;
    plan: string;
    subscriptionStatus: string;
    trialEndsAt: string | null;
    periodEnd: string | null;
    lastActive: string;
}

export default function MerchantStatusPage() {
    const [data, setData] = useState<MerchantStatus[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/ops/merchants?limit=50"); // Fetch more for overview
                if (res.ok) {
                    const json = await res.json();
                    setData(json.data);
                }
            } catch (error) {
                console.error("Failed", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getStatusColor = (status: string) => {
        if (status.includes("TRIAL")) return "bg-yellow-100 text-yellow-800 border-yellow-200";
        if (status === "ACTIVE") return "bg-green-100 text-green-800 border-green-200";
        if (status === "EXPIRED" || status === "CANCELED") return "bg-red-100 text-red-800 border-red-200";
        return "bg-gray-100 text-gray-800 border-gray-200";
    };

    return (
        <div className="p-8 space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Merchant Status</h1>
                    <p className="text-gray-500 mt-1">Monitor subscription health and trial expirations</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Subscription Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Merchant</th>
                                    <th className="px-6 py-3">Plan</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Trial Ends</th>
                                    <th className="px-6 py-3">Renews At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                                            </div>
                                        </td>
                                    </tr>
                                ) : data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No data found</td>
                                    </tr>
                                ) : (
                                    data.map((m) => (
                                        <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{m.name}</div>
                                                <div className="text-xs text-gray-500">{m.ownerEmail}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className="uppercase text-xs">{m.plan}</Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(m.subscriptionStatus)}`}>
                                                    {m.subscriptionStatus.replace("_", " ")}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {m.trialEndsAt ? (
                                                    <div className="flex items-center gap-1.5 text-gray-600">
                                                        <CalendarClock className="h-3.5 w-3.5" />
                                                        {format(new Date(m.trialEndsAt), "MMM d, yyyy")}
                                                    </div>
                                                ) : <span className="text-gray-400">-</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                {m.periodEnd ? format(new Date(m.periodEnd), "MMM d, yyyy") : <span className="text-gray-400">-</span>}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
