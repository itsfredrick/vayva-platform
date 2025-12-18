'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon, cn } from '@vayva/ui';
import { api } from '@/services/api';

export default function PlansPage() {
    const [plans, setPlans] = useState<any[]>([]);
    const [currentPlan, setCurrentPlan] = useState<any>(null);
    const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly');

    useEffect(() => {
        const fetchData = async () => {
            const [plansRes, subRes] = await Promise.all([
                api.get('/billing/plans'),
                api.get('/billing/subscription')
            ]);
            setPlans(plansRes.data || []);
            setCurrentPlan(subRes.data?.plan);
        };
        fetchData();
    }, []);

    const handleUpgrade = async (planKey: string) => {
        try {
            await api.put('/billing/subscription/upgrade', { planKey });
            alert('Plan upgraded!');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AdminShell title="Plans" breadcrumb="Billing">
            <div className="max-w-6xl mx-auto flex flex-col gap-8">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0B1220]">Choose Your Plan</h1>
                        <p className="text-[#525252]">Select the perfect plan for your business.</p>
                    </div>
                    <div className="flex gap-2 bg-white rounded-lg p-1 border border-gray-200">
                        <button
                            className={cn("px-4 py-2 rounded-md text-sm font-medium transition-all", interval === 'monthly' ? "bg-green-50 text-green-600" : "text-gray-600")}
                            onClick={() => setInterval('monthly')}
                        >
                            Monthly
                        </button>
                        <button
                            className={cn("px-4 py-2 rounded-md text-sm font-medium transition-all", interval === 'yearly' ? "bg-green-50 text-green-600" : "text-gray-600")}
                            onClick={() => setInterval('yearly')}
                        >
                            Yearly
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map(plan => {
                        const isCurrent = currentPlan?.key === plan.key;
                        const price = interval === 'monthly' ? plan.priceMonthly : plan.priceYearly;

                        return (
                            <div key={plan.id} className={cn(
                                "bg-white rounded-2xl border shadow-sm p-6 flex flex-col",
                                isCurrent ? "border-green-500 ring-2 ring-green-100" : "border-gray-100"
                            )}>
                                {isCurrent && (
                                    <span className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded font-bold mb-4 self-start">Current Plan</span>
                                )}
                                <h3 className="text-xl font-bold text-[#0B1220] mb-2">{plan.name}</h3>
                                <div className="mb-4">
                                    <span className="text-3xl font-bold text-[#0B1220]">₦{price}</span>
                                    <span className="text-[#525252]">/{interval === 'monthly' ? 'mo' : 'yr'}</span>
                                </div>
                                <p className="text-sm text-[#525252] mb-6">{plan.description}</p>
                                <ul className="space-y-2 mb-6 flex-1">
                                    {(plan.features as any[]).map((feature: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2 text-sm">
                                            <Icon name="Check" size={16} className="text-green-600 mt-0.5" />
                                            <span className="text-[#525252]">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    disabled={isCurrent}
                                    onClick={() => handleUpgrade(plan.key)}
                                    className="w-full"
                                >
                                    {isCurrent ? 'Current Plan' : 'Upgrade'}
                                </Button>
                            </div>
                        );
                    })}
                </div>

            </div>
        </AdminShell>
    );
}
