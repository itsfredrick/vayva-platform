'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StorefrontService } from '@/services/storefront';

export default function OrderStatusPage() {
    const router = useRouter();
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState<any>(null);
    const [error, setError] = useState('');

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setOrder(null);

        // Use a specialized public endpoint if needed, or re-use getOrder if public
        // For V1, let's assume getOrder (StorefrontService.getOrder doesn't exist yet, we only have getProduct)
        // Need to add getOrder to StorefrontService.
        try {
            // For now, mock or fail
            alert("Order Lookup API not connected in scaffold yet!");
        } catch (err) {
            setError('Order not found');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center pt-20">
            <h1 className="text-3xl font-bold mb-8">Track Order</h1>
            <div className="w-full max-w-md bg-white/5 p-8 rounded-2xl border border-white/10">
                <form onSubmit={handleLookup} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Order ID / Reference</label>
                        <input
                            value={orderId}
                            onChange={e => setOrderId(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                            placeholder="e.g. ord_123..."
                        />
                    </div>
                    <button type="submit" className="w-full bg-white text-black font-bold h-12 rounded-lg">
                        Track
                    </button>
                </form>

                {error && <div className="mt-4 text-red-400 text-center">{error}</div>}
            </div>
        </div>
    );
}
