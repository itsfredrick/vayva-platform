'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StorefrontService } from '@/services/storefront';

export default function CheckoutPage() {
    const router = useRouter();
    const [cart, setCart] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Form
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('vayva_cart') || '[]');
        if (stored.length === 0) router.push('/cart');
        setCart(stored);
    }, []);

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create Order
            const order = await StorefrontService.checkout({
                items: cart,
                total,
                customer: { email, name, phone }
            });

            // 2. Initialize Payment
            const payment = await StorefrontService.initializePayment({
                orderId: order.id,
                email,
                amount: total
            });

            // 3. Redirect
            if (payment.data?.authorization_url) {
                // Clear Cart
                localStorage.removeItem('vayva_cart');
                window.location.href = payment.data.authorization_url;
            } else {
                alert('Payment initialization failed');
            }

        } catch (err) {
            console.error(err);
            alert('Checkout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Summary */}
            <div className="order-2 md:order-1 space-y-6">
                <h2 className="text-2xl font-bold">Order Summary</h2>
                <div className="space-y-4">
                    {cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                            <div>{item.title} <span className="text-gray-500">x{item.quantity}</span></div>
                            <div className="font-mono">NGN {(item.price * item.quantity).toLocaleString()}</div>
                        </div>
                    ))}
                    <div className="border-t border-white/10 pt-4 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>NGN {total.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="order-1 md:order-2">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <form onSubmit={handleCheckout} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Phone</label>
                        <input
                            type="tel"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-black font-bold h-14 rounded-full mt-6 hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : `Pay NGN ${total.toLocaleString()}`}
                    </button>
                </form>
            </div>
        </div>
    );
}
