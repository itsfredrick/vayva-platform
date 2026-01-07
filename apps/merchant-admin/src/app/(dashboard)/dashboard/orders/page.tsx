"use client";

import { EmptyState, Button, Badge } from "@vayva/ui";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/LoadingSkeletons";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/orders");
            const data = await res.json();
            if (data.success) {
                setOrders(data.data);
            }
            // NO MOCK FALLBACK
        } catch (error) {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const handleShareStore = async () => {
        const shareData = {
            title: 'My Vayva Store',
            text: 'Check out my store on Vayva!',
            url: window.location.origin,
        };
        if (navigator.share) {
            navigator.share(shareData).catch(() => { });
        } else {
            navigator.clipboard.writeText(shareData.url).then(() => toast.success("Copied!"));
        }
    };

    if (loading) {
        return (
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
                <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-6">
                    <Skeleton className="h-10 w-full" />
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-900">Orders</h1>
                <EmptyState
                    title="No orders yet"
                    icon="ShoppingBag"
                    description="When you receive your first order, it will appear here."
                    action={<Button className="px-8" onClick={handleShareStore}>Share Store Link</Button>}
                />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 md:p-8 max-w-7xl mx-auto space-y-8"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-heading">Orders 📦</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage and track your customer orders.</p>
                </div>
            </div>

            <div className="glass-card rounded-3xl shadow-sm border-none overflow-hidden transition-all duration-300">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 text-gray-400 font-bold uppercase tracking-widest text-[10px] border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-5">Order ID</th>
                                <th className="px-6 py-5">Customer</th>
                                <th className="px-6 py-5">Total</th>
                                <th className="px-6 py-5">Payment Status</th>
                                <th className="px-6 py-5 text-right">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white/30 backdrop-blur-sm">
                            {orders.map((order: any) => {
                                const paid = order.paidAmount || 0;
                                const total = order.total || 0;
                                const percent = total > 0 ? (paid / total) * 100 : (paid > 0 ? 100 : 0);
                                const balance = total - paid;

                                let statusColor = 'text-gray-500';
                                let barColor = 'bg-gray-200';
                                let statusBg = 'bg-gray-50';

                                if (order.displayStatus === 'PAID') {
                                    statusColor = 'text-green-600';
                                    barColor = 'bg-green-500';
                                    statusBg = 'bg-green-50';
                                } else if (order.displayStatus === 'PARTIAL') {
                                    statusColor = 'text-blue-600';
                                    barColor = 'bg-blue-500';
                                    statusBg = 'bg-blue-50';
                                }

                                return (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-white/80 transition-all cursor-pointer group"
                                        onClick={() => router.push(`/dashboard/orders/${order.id}`)}
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 text-base">#{order.orderNumber}</span>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{order.items} items</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                                    {order.customer ? order.customer.firstName[0] : "G"}
                                                </div>
                                                <span className="font-medium text-gray-700">
                                                    {order.customer ? `${order.customer.firstName} ${order.customer.lastName || ''}` : "Guest"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="font-bold text-gray-900">
                                                {order.currency} {total.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="w-36">
                                                <div className="flex justify-between text-[10px] mb-1.5 font-bold uppercase tracking-wider">
                                                    <span className={statusColor}>{order.displayStatus}</span>
                                                    <span className="text-gray-400">{Math.round(percent)}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden p-[1px]">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min(percent, 100)}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        className={`h-full rounded-full ${barColor} shadow-sm`}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            {balance > 0 ? (
                                                <span className="font-mono font-bold text-red-500 bg-red-50 px-3 py-1 rounded-lg">
                                                    -₦{balance.toLocaleString()}
                                                </span>
                                            ) : (
                                                <span className="font-mono font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                                                    Cleared
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
