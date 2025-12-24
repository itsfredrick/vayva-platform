
import React from 'react';
import { UnifiedOrder } from '@vayva/shared';
import { OrderCard } from './OrderCard';

interface RetailOrdersViewProps {
    orders: UnifiedOrder[];
    onSelect: (order: UnifiedOrder) => void;
}

export const RetailOrdersView = ({ orders, onSelect }: RetailOrdersViewProps) => {
    return (
        <div className="space-y-3">
            {orders.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">No orders found.</p>
                </div>
            ) : (
                orders.map(order => (
                    <OrderCard key={order.id} order={order} onClick={onSelect} />
                ))
            )}
        </div>
    );
};
