
"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
    Search,
    Filter,
    Truck,
    MapPin,
    ExternalLink,
    Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Delivery {
    id: string;
    orderNumber: string;
    status: string;
    provider: string;
    trackingCode: string | null;
    recipientName: string;
    createdAt: string;
    cost: number;
    deliveryFee: number;
    storeName: string;
    storeId: string;
}

export default function DeliveriesPage() {
    const [data, setData] = useState<Delivery[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async (query = "") => {
        setLoading(true);
        try {
            const url = query ? `/api/ops/deliveries?q=${query}` : "/api/ops/deliveries";
            const res = await fetch(url);
            if (res.ok) {
                const json = await res.json();
                setData(json.data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchDeliveries(search);
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "DELIVERED": return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Delivered</Badge>;
            case "IN_TRANSIT": return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Transit</Badge>;
            case "PICKED_UP": return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">Picked Up</Badge>;
            case "DRAFT": return <Badge variant="outline" className="text-gray-500">Draft</Badge>;
            case "FAILED_DISPATCH": return <Badge variant="destructive" className="animate-pulse">Dispatch Failed</Badge>;
            case "INSUFFICIENT_FUNDS": return <Badge variant="destructive" className="bg-red-600 text-white animate-pulse">Insufficient Funds</Badge>; // If stored directly
            case "CANCELLED": return <Badge variant="destructive">Cancelled</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    }

    return (
        <div className="p-8 space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Deliveries</h1>
                    <p className="text-gray-500 mt-1">Global logistics tracking across all merchants</p>
                </div>
            </div>

            {/* Search/Filter */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search tracking, recipient, order #..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>
                <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50">
                    <Filter size={16} /> Filters
                </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                        <tr>
                            <th className="px-6 py-3">Tracking</th>
                            <th className="px-6 py-3">Store</th>
                            <th className="px-6 py-3">Recipient</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Provider</th>
                            <th className="px-6 py-3">Cost Analysis</th>
                            <th className="px-6 py-3 text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={7} className="p-8 text-center text-gray-400">Loading...</td></tr>
                        ) : data.length === 0 ? (
                            <tr><td colSpan={7} className="p-8 text-center text-gray-400">No deliveries found</td></tr>
                        ) : (
                            data.map((d) => (
                                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{d.trackingCode || "N/A"}</span>
                                            <span className="text-xs text-gray-500">Order #{d.orderNumber}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/ops/merchants/${d.storeId}`} className="text-indigo-600 hover:underline">
                                            {d.storeName}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">{d.recipientName}</td>
                                    <td className="px-6 py-4">{getStatusBadge(d.status)}</td>
                                    <td className="px-6 py-4 uppercase text-xs font-semibold text-gray-500">{d.provider}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col text-xs">
                                            <span className="text-gray-900">Customer Paid: ₦{d.deliveryFee.toLocaleString()}</span>
                                            <span className="text-gray-500">Kwik Cost: ₦{d.cost?.toLocaleString() || "0"}</span>
                                            {d.deliveryFee > (d.cost || 0) && (
                                                <span className="text-green-600 font-medium mt-0.5">
                                                    +₦{(d.deliveryFee - (d.cost || 0)).toLocaleString()} Profit
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-500">
                                        {format(new Date(d.createdAt), "MMM d, HH:mm")}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
