'use client';

import React from 'react';
import { cn, Icon, Button } from '@vayva/ui';
import { KitchenProvider, useKitchen } from '@/context/KitchenContext';
import { KitchenOrder, OrderStatus } from '@/types/kds';
import { formatDistanceToNow } from 'date-fns';

const StatusColumn = ({
    title,
    status,
    orders,
    colorClass,
    icon
}: {
    title: string,
    status: OrderStatus,
    orders: KitchenOrder[],
    colorClass: string,
    icon: string
}) => {
    const { updateStatus } = useKitchen();

    // Sorting: Oldest first for "New/Preparing", Newest first for "Ready/Completed"
    const sortedOrders = [...orders].sort((a, b) => {
        if (status === 'completed' || status === 'ready') return b.createdAt - a.createdAt;
        return a.createdAt - b.createdAt;
    });

    const getNextStatus = (current: OrderStatus): OrderStatus | null => {
        if (current === 'new') return 'preparing';
        if (current === 'preparing') return 'ready';
        if (current === 'ready') return 'completed';
        return null;
    };

    return (
        <div className="flex-1 min-w-[300px] flex flex-col h-full bg-gray-50/50 rounded-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className={cn("p-4 border-b flex justify-between items-center bg-white sticky top-0 z-10", colorClass)}>
                <div className="flex items-center gap-2 font-bold">
                    <Icon name={icon as any} size={18} />
                    <span>{title}</span>
                    <span className="bg-black/10 px-2 py-0.5 rounded-full text-xs">{orders.length}</span>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {sortedOrders.map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="flex justify-between items-start mb-3 border-b pb-2 border-dashed">
                            <div>
                                <h3 className="font-bold text-lg">#{order.id.split('-')[1]}</h3>
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                    <Icon name={order.source === 'whatsapp' ? 'MessageCircle' : 'Globe'} size={10} />
                                    {order.customerName}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{order.fulfillment}</div>
                                <div className={cn("text-xs font-mono font-bold mt-1",
                                    Date.now() - order.createdAt > 1000 * 60 * 20 ? "text-red-500" : "text-green-600"
                                )}>
                                    {Math.floor((Date.now() - order.createdAt) / 1000 / 60)}m ago
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex gap-2 text-sm leading-tight">
                                    <span className="font-bold w-4 text-center shrink-0">{item.quantity}</span>
                                    <div>
                                        <span>{item.name}</span>
                                        {item.modifiers.length > 0 && (
                                            <p className="text-xs text-gray-500 italic mt-0.5">{item.modifiers.join(', ')}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {getNextStatus(status) && (
                            <Button
                                className="w-full h-10 font-bold bg-black text-white hover:bg-gray-800"
                                onClick={() => updateStatus(order.id, getNextStatus(status)!)}
                            >
                                Mark as {getNextStatus(status)?.toUpperCase()}
                            </Button>
                        )}
                    </div>
                ))}
                {orders.length === 0 && (
                    <div className="text-center py-10 opacity-30 text-sm font-medium italic">
                        No orders
                    </div>
                )}
            </div>
        </div>
    );
};

const KDSBoard = () => {
    const { orders, metrics } = useKitchen();

    const cols = {
        new: orders.filter(o => o.status === 'new'),
        preparing: orders.filter(o => o.status === 'preparing'),
        ready: orders.filter(o => o.status === 'ready'),
        completed: orders.filter(o => o.status === 'completed'),
    };

    return (
        <div className="h-screen flex flex-col bg-white text-black font-sans">
            {/* KDS Header */}
            <header className="h-16 border-b flex items-center justify-between px-6 bg-white shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center font-bold">KDS</div>
                    <div>
                        <h1 className="font-bold text-lg leading-none">Kitchen Display</h1>
                        <p className="text-xs text-gray-500">Live Operations</p>
                    </div>
                </div>

                <div className="flex gap-8 text-sm">
                    <div className="text-center">
                        <div className="font-bold text-xl">{metrics.ordersInQueue}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-any">Active</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-xl">{metrics.ordersToday}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-any">Done Today</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-xl">{metrics.avgPrepTime}m</div>
                        <div className="text-xs text-gray-500 uppercase tracking-any">Avg Prep</div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-green-600">System Online</span>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                <div className="flex gap-6 h-full min-w-[1200px]">
                    <StatusColumn
                        title="NEW ORDERS"
                        status="new"
                        orders={cols.new}
                        colorClass="text-blue-600"
                        icon="Bell"
                    />
                    <StatusColumn
                        title="PREPARING"
                        status="preparing"
                        orders={cols.preparing}
                        colorClass="text-amber-600"
                        icon="Flame"
                    />
                    <StatusColumn
                        title="READY"
                        status="ready"
                        orders={cols.ready}
                        colorClass="text-green-600"
                        icon="CheckCircle"
                    />
                    <StatusColumn
                        title="HISTORY"
                        status="completed"
                        orders={cols.completed}
                        colorClass="text-gray-400"
                        icon="Clock"
                    />
                </div>
            </main>
        </div>
    );
};

export default function KitchenPage() {
    return (
        <KitchenProvider>
            <KDSBoard />
        </KitchenProvider>
    );
}
