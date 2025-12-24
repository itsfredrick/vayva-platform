
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { BusinessType, UnifiedOrder, OrderStats } from '@vayva/shared';
import { OrderSummary } from '@/components/orders/OrderSummary';
import { RetailOrdersView } from '@/components/orders/RetailOrdersView';
import { FoodOrdersKanban } from '@/components/orders/FoodOrdersKanban';
import { ServiceBookingsView } from '@/components/orders/ServiceBookingsView';
import { OrderDetailsDrawer } from '@/components/orders/OrderDetailsDrawer';
import { apiClient } from '@/lib/apiClient';

export default function OrdersPage() {
    const { merchant } = useAuth();
    const [orders, setOrders] = useState<UnifiedOrder[]>([]);
    const [stats, setStats] = useState<OrderStats | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<UnifiedOrder | null>(null);

    // Business Logic Switch
    const type = merchant?.businessType || BusinessType.RETAIL; // Default to Retail if undefined
    const isRetail = type === BusinessType.RETAIL;
    const isFood = type === BusinessType.FOOD;
    const isService = type === BusinessType.SERVICES;

    useEffect(() => {
        const load = async () => {
            try {
                // Fetch stats and orders in parallel
                const [ordersRes, statsRes] = await Promise.all([
                    apiClient.get(`/api/orders?type=${type}`),
                    apiClient.get('/api/orders/stats')
                ]);
                setOrders(ordersRes);
                setStats(statsRes);
            } catch (e) {
                console.error("Failed to load orders", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [type]);

    if (loading) return <div className="p-12 text-center text-gray-400 font-medium">Loading orders...</div>;

    const renderView = () => {
        if (isFood) {
            return <FoodOrdersKanban orders={orders} onSelect={setSelectedOrder} />;
        }
        if (isService) {
            return <ServiceBookingsView orders={orders} onSelect={setSelectedOrder} />;
        }
        return <RetailOrdersView orders={orders} onSelect={setSelectedOrder} />;
    };

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            <header className="mb-8 flex items-end justify-between">
                <div>
                    <h1 className="font-heading font-bold text-3xl text-gray-900 mb-2">
                        {isService ? 'Bookings' : 'Orders'}
                    </h1>
                    <p className="text-gray-500 text-lg">Manage your {isService ? 'appointments' : 'store orders'} efficiently.</p>
                </div>
                <button className="px-5 py-2.5 bg-black text-white rounded-full font-bold text-sm shadow-lg hover:scale-105 transition-transform">
                    + New {isService ? 'Booking' : 'Order'}
                </button>
            </header>

            {/* Summary Strip (Adaptive) */}
            <OrderSummary stats={stats} type={orders[0]?.type || (isService ? 'service' : 'retail') as any} />

            {/* Main Workspace */}
            {renderView()}

            {/* Details Drawer */}
            <OrderDetailsDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        </div>
    );
}
