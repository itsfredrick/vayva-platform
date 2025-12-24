'use client';

import React, { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';

interface SubscriptionData {
    currentPlan: string;
    limits: any;
    usage: {
        orders: number;
        whatsappMessages: number;
        staffSeats: number;
    };
    subscription: any;
    availablePlans: Array<{
        name: string;
        ordersPerMonth: number | string;
        whatsappMessages: number | string;
        staffSeats: number | string;
        templates: number | string;
        price: number;
    }>;
}

export default function SubscriptionPage() {
    const [data, setData] = useState<SubscriptionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [changingPlan, setChangingPlan] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    useEffect(() => {
        fetchSubscription();
    }, []);

    const fetchSubscription = async () => {
        try {
            const res = await fetch('/api/billing/subscription');
            if (!res.ok) throw new Error('Failed to fetch');
            const json = await res.json();
            setData(json);
        } catch (error) {
            console.error('Failed to load subscription', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePlan = async (newPlan: string) => {
        if (!confirm(`Change to ${newPlan} plan?`)) return;

        setChangingPlan(true);
        setSelectedPlan(newPlan);

        try {
            const res = await fetch('/api/billing/subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPlan }),
            });

            if (!res.ok) throw new Error('Failed to change plan');

            const result = await res.json();

            if (result.paymentUrl) {
                window.location.href = result.paymentUrl;
            } else {
                await fetchSubscription();
            }
        } catch (error) {
            console.error('Failed to change plan', error);
            alert('Failed to change plan');
        } finally {
            setChangingPlan(false);
            setSelectedPlan(null);
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-96 bg-gray-200 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data) {
        return <div className="text-center py-12 text-gray-500">Failed to load subscription</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Subscription</h1>
                <p className="text-gray-600 mt-1">
                    Manage your plan and billing
                </p>
            </div>

            {/* Current Usage */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-4">Current Usage</h3>
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <p className="text-sm text-blue-700">Orders This Month</p>
                        <p className="text-2xl font-bold text-blue-900">
                            {data.usage.orders}
                            {typeof data.limits.ordersPerMonth === 'number' && (
                                <span className="text-sm font-normal text-blue-700">
                                    {' '}/ {data.limits.ordersPerMonth}
                                </span>
                            )}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-blue-700">Staff Seats</p>
                        <p className="text-2xl font-bold text-blue-900">
                            {data.usage.staffSeats}
                            {typeof data.limits.staffSeats === 'number' && (
                                <span className="text-sm font-normal text-blue-700">
                                    {' '}/ {data.limits.staffSeats}
                                </span>
                            )}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-blue-700">WhatsApp Messages</p>
                        <p className="text-2xl font-bold text-blue-900">
                            {data.usage.whatsappMessages}
                            {typeof data.limits.whatsappMessages === 'number' && (
                                <span className="text-sm font-normal text-blue-700">
                                    {' '}/ {data.limits.whatsappMessages}
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Plan Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.availablePlans.map((plan) => {
                    const isCurrent = plan.name === data.currentPlan;
                    const isChanging = changingPlan && selectedPlan === plan.name;

                    return (
                        <div
                            key={plan.name}
                            className={`
                                relative rounded-xl border-2 p-6
                                ${isCurrent ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}
                            `}
                        >
                            {isCurrent && (
                                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    Current Plan
                                </div>
                            )}

                            <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                            <div className="mb-6">
                                <span className="text-3xl font-bold text-gray-900">
                                    ₦{(plan.price / 100).toLocaleString()}
                                </span>
                                <span className="text-gray-600">/month</span>
                            </div>

                            <ul className="space-y-3 mb-6">
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-gray-700">
                                        {plan.ordersPerMonth === 'unlimited' ? 'Unlimited' : plan.ordersPerMonth} orders/month
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-gray-700">
                                        {plan.whatsappMessages === 'unlimited' ? 'Unlimited' : plan.whatsappMessages} WhatsApp messages
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-gray-700">
                                        {plan.staffSeats === 'unlimited' ? 'Unlimited' : plan.staffSeats} staff seats
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-sm text-gray-700">
                                        {plan.templates === 'unlimited' ? 'Unlimited' : plan.templates} templates
                                    </span>
                                </li>
                            </ul>

                            <button
                                onClick={() => handleChangePlan(plan.name)}
                                disabled={isCurrent || changingPlan}
                                className={`
                                    w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2
                                    ${isCurrent
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                    }
                                    ${changingPlan ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                {isChanging ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : isCurrent ? (
                                    'Current Plan'
                                ) : (
                                    `Switch to ${plan.name}`
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
