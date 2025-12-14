'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PaystackMockPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const reference = searchParams.get('reference');
    const amount = searchParams.get('amount');
    const [processing, setProcessing] = useState(false);

    const handleSuccess = async () => {
        setProcessing(true);
        try {
            // Call Webhook manually to simulate server-side callback (optional local dev trick)
            // Or rely on the verify endpoint the storefront would call.
            // For V1, let's just redirect to success.
            // In real Paystack, it redirects to callback_url with reference.

            // Assume verification happens on the success page or via webhook.
            // We'll redirect to the success page of the storefront.
            // Storefront URL assumed localhost:3001

            // Trigger webhook stub (Gateway -> Payments Service)
            await axios.post('http://localhost:4000/v1/payments/webhook', {
                event: 'charge.success',
                data: { reference, amount: Number(amount), status: 'success' }
            });

            setTimeout(() => {
                router.push(`/order/success?reference=${reference}`);
            }, 1000);

        } catch (err) {
            console.error(err);
            alert('Simulation failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans text-black">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center">
                <div className="mb-6">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Paystack.png" alt="Paystack" className="h-8 mx-auto" />
                </div>
                <h2 className="text-xl font-bold mb-2">Test Payment</h2>
                <div className="text-gray-500 mb-6">{reference}</div>
                <div className="text-3xl font-bold mb-8">NGN {Number(amount).toLocaleString()}</div>

                <button
                    onClick={handleSuccess}
                    disabled={processing}
                    className="w-full bg-green-500 text-white font-bold py-4 rounded-lg hover:bg-green-600 transition-colors mb-4 disabled:opacity-50"
                >
                    {processing ? 'Processing...' : 'Simulate Success'}
                </button>
                <button
                    onClick={() => router.push('/checkout')}
                    className="w-full text-red-500 font-medium hover:text-red-700"
                >
                    Cancel Payment
                </button>
            </div>
        </div>
    );
}
