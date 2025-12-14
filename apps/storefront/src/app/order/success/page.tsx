'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@vayva/ui';

export default function OrderSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const reference = searchParams.get('reference');

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-green-500/20 text-green-400 p-6 rounded-full mb-6 text-6xl">
                ✓
            </div>
            <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-gray-400 max-w-md mb-8">
                Thank you for your purchase. Your order has been placed successfully.
                <br /><br />
                Payment Reference: <span className="font-mono text-white">{reference}</span>
            </p>

            <div className="flex gap-4">
                <button
                    onClick={() => router.push('/')}
                    className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors"
                >
                    Continue Shopping
                </button>
                <button
                    onClick={() => router.push('/order/status')}
                    className="bg-white/10 text-white font-bold py-3 px-8 rounded-full hover:bg-white/20 transition-colors"
                >
                    Track Order
                </button>
            </div>
        </div>
    );
}
