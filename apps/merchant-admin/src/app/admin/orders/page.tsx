'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, Button, GlassPanel, StatusChip, EmptyState } from '@vayva/ui';
import { OrderService, Order } from '@/services/orders';
import Cookies from 'js-cookie';
import { useAuth } from '@/context/AuthContext';

export default function OrdersPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const storeId = Cookies.get('vayva_store_id');

    useEffect(() => {
        if (storeId) {
            OrderService.list(storeId)
                .then(setOrders)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [storeId]);

    return (
        <AppShell
            title="Orders"
            breadcrumbs={[{ label: 'Orders', href: '/admin/orders' }]}
            profile={{ name: user?.name || 'Merchant', email: user?.email || '' }}
            storeName="Store" // Todo
            onLogout={() => router.push('/signin')} // Todo
        >
            <div className="space-y-6">
                <GlassPanel className="p-0 overflow-hidden">
                    {/* Simplified loading/empty handling outside table structure for clean design, or inside if preferred. 
                        Design spec: "screens show the correct data states". 
                        If empty, show EmptyState component, not a table with headers and 1 row.
                    */}
                    {loading ? (
                        <div className="p-12 text-center text-text-secondary animate-pulse">Loading orders...</div>
                    ) : orders.length === 0 ? (
                        <div className="p-8">
                            <EmptyState
                                title="No Orders Yet"
                                description="Your store hasn't received any orders yet. Once products are live, orders will appear here."
                                icon="receipt" // assuming receipt icon exists or generic
                            />
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="p-4 text-sm font-medium text-text-secondary">Order ID</th>
                                    <th className="p-4 text-sm font-medium text-text-secondary">Date</th>
                                    <th className="p-4 text-sm font-medium text-text-secondary">Customer</th>
                                    <th className="p-4 text-sm font-medium text-text-secondary">Status</th>
                                    <th className="p-4 text-sm font-medium text-text-secondary">Total</th>
                                    <th className="p-4 text-sm font-medium text-text-secondary">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-white font-medium">#{order.id.substring(0, 8)}</td>
                                        <td className="p-4 text-text-secondary">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 text-white">{order.customer?.name || 'Guest'}</td>
                                        <td className="p-4">
                                            <StatusChip status={order.status} />
                                        </td>
                                        <td className="p-4 text-white">NGN {order.total.toLocaleString()}</td>
                                        <td className="p-4">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => router.push(`/admin/orders/${order.id}`)}
                                            >
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </GlassPanel>
            </div>
        </AppShell>
    );
}
