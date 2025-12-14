'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AppShell, Button, GlassPanel, StatusChip, Icon } from '@vayva/ui';
import { OrderService, Order } from '@/services/orders';
import { useAuth } from '@/context/AuthContext';

export default function OrderDetailPage() {
    const router = useRouter();
    const { id } = useParams();
    const { user } = useAuth();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            OrderService.get(id as string)
                .then(setOrder)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleStatusUpdate = async (newStatus: string) => {
        if (!order) return;
        try {
            const updated = await OrderService.updateStatus(order.id, newStatus);
            setOrder(updated);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 text-center text-white">Loading...</div>;
    if (!order) return <div className="p-8 text-center text-white">Order not found</div>;

    return (
        <AppShell
            title={`Order #${order.id.substring(0, 8)}`}
            breadcrumbs={[
                { label: 'Orders', href: '/admin/orders' },
                { label: `#${order.id.substring(0, 8)}`, href: `/admin/orders/${order.id}` }
            ]}
            profile={{ name: user?.name || 'Merchant', email: user?.email || '' }}
            storeName="Store"
            onLogout={() => router.push('/signin')}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <GlassPanel className="p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Items</h3>
                        <div className="space-y-4">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 border border-white/10 rounded-lg">
                                    <div className="flex flex-col">
                                        <span className="text-white font-medium">{item.title}</span>
                                        <span className="text-sm text-text-secondary">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="text-white font-bold">NGN {item.price.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                            <span className="text-text-secondary">Total</span>
                            <span className="text-xl font-bold text-white">NGN {order.total.toLocaleString()}</span>
                        </div>
                    </GlassPanel>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <GlassPanel className="p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Status</h3>
                        <div className="flex items-center gap-3 mb-6">
                            <StatusChip status={order.status} />
                        </div>
                        <div className="space-y-2">
                            <Button
                                variant="secondary"
                                className="w-full justify-start"
                                onClick={() => handleStatusUpdate('PROCESSING')}
                            >
                                Mark as Processing
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-full justify-start"
                                onClick={() => handleStatusUpdate('SHIPPED')}
                            >
                                Mark as Shipped
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-full justify-start"
                                onClick={() => handleStatusUpdate('DELIVERED')}
                            >
                                Mark as Delivered
                            </Button>
                        </div>
                    </GlassPanel>

                    <GlassPanel className="p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Customer</h3>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <Icon name="user" className="text-white" />
                            </div>
                            <div>
                                <div className="text-white font-medium">{order.customer?.name || 'Guest'}</div>
                                <div className="text-sm text-text-secondary">{order.customer?.email || 'No email'}</div>
                            </div>
                        </div>
                    </GlassPanel>
                </div>
            </div>
        </AppShell>
    );
}
