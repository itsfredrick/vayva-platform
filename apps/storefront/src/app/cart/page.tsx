'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const router = useRouter();
    const [cart, setCart] = useState<any[]>([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('vayva_cart') || '[]');
        setCart(stored);
    }, []);

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <div className="min-h-screen bg-black text-white p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

            {cart.length === 0 ? (
                <div className="text-center py-20 text-gray-500">Cart is empty.</div>
            ) : (
                <div className="space-y-4">
                    {cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-4 border border-white/10 rounded-xl bg-white/5">
                            <div>
                                <div className="font-medium text-lg">{item.title}</div>
                                <div className="text-sm text-gray-400">Qty: {item.quantity} × NGN {item.price.toLocaleString()}</div>
                            </div>
                            <div className="font-mono text-xl">NGN {(item.price * item.quantity).toLocaleString()}</div>
                        </div>
                    ))}

                    <div className="border-t border-white/10 pt-8 mt-8 flex justify-between items-center text-xl font-bold">
                        <span>Total</span>
                        <span>NGN {total.toLocaleString()}</span>
                    </div>

                    <button
                        onClick={() => router.push('/checkout')}
                        className="w-full bg-primary text-black font-bold h-14 rounded-full mt-8 hover:bg-primary/90 transition-colors"
                    >
                        Proceed to Checkout
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full mt-4 text-gray-500 hover:text-white transition-colors text-center block"
                    >
                        Continue Shopping
                    </button>
                </div>
            )}
        </div>
    );
}
