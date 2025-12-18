'use client';

import React, { useEffect } from 'react';
import { StoreShell } from '@/components/StoreShell';
import { useStore } from '@/context/StoreContext';
import NextLink from 'next/link';
import { CheckCircle } from 'lucide-react';

const Link = NextLink as any;
const CheckIcon = CheckCircle as any;

export default function OrderSuccessPage() {
    const { store } = useStore();

    // In a real app we'd read Order ID from query params

    if (!store) return null;

    return (
        <StoreShell>
            <div className="max-w-xl mx-auto px-4 py-20 text-center">
                <div className="flex justify-center mb-6">
                    <CheckIcon size={64} className="text-green-500" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
                <p className="text-gray-500 mb-8">
                    Thank you for your purchase. We have received your order and will begin processing it shortly.
                </p>

                <div className="bg-gray-50 p-6 rounded-xl mb-8 text-left">
                    <p className="text-sm font-bold text-gray-500 uppercase mb-2">Order Reference</p>
                    <p className="text-2xl font-mono font-bold tracking-wider">ORD-12345</p>
                </div>

                <div className="flex flex-col gap-3">
                    <Link href={`/orders?store=${store.slug}`}>
                        <button className="w-full border border-gray-200 py-3 rounded-lg font-bold hover:border-black transition-colors">
                            Track Order Status
                        </button>
                    </Link>
                    <Link href={`/?store=${store.slug}`}>
                        <button className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-900 transition-colors">
                            Continue Shopping
                        </button>
                    </Link>
                </div>
            </div>
        </StoreShell>
    );
}
