'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    CreditCard,
    FileCheck,
    Wallet,
    MessageSquare,
    ArrowRight,
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle
} from 'lucide-react';

interface AccountOverviewData {
    subscription: {
        plan: string;
        status: string;
        renewalDate: string | null;
        canUpgrade: boolean;
    };
    kyc: {
        status: string;
        missingDocs: string[];
        canWithdraw: boolean;
    };
    payment: {
        bankConnected: boolean;
        payoutsEnabled: boolean;
    };
    whatsapp: {
        connected: boolean;
        automationEnabled: boolean;
    };
    alerts: Array<{
        id: string;
        severity: 'error' | 'warning' | 'info';
        message: string;
        action: string;
    }>;
    store: {
        id: string;
        name: string;
        category: string;
    };
}

export default function AccountOverviewPage() {
    const [data, setData] = useState<AccountOverviewData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/account/overview');
                if (!res.ok) throw new Error('Failed to fetch');
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error('Failed to load account overview', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-20 bg-gray-200 rounded-xl w-full"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Failed to load account overview</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Account Overview</h1>
                <p className="text-gray-600 mt-1">
                    Manage your business identity, security, and configuration.
                </p>
            </div>

            {/* Alerts Panel */}
            {data.alerts.length > 0 && (
                <div className="space-y-3">
                    {data.alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className={`
                                p-4 rounded-lg border flex items-start gap-3
                                ${alert.severity === 'error' ? 'bg-red-50 border-red-200' : ''}
                                ${alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-200' : ''}
                                ${alert.severity === 'info' ? 'bg-blue-50 border-blue-200' : ''}
                            `}
                        >
                            <AlertCircle className={`
                                w-5 h-5 mt-0.5
                                ${alert.severity === 'error' ? 'text-red-600' : ''}
                                ${alert.severity === 'warning' ? 'text-yellow-600' : ''}
                                ${alert.severity === 'info' ? 'text-blue-600' : ''}
                            `} />
                            <div className="flex-1">
                                <p className={`
                                    text-sm font-medium
                                    ${alert.severity === 'error' ? 'text-red-900' : ''}
                                    ${alert.severity === 'warning' ? 'text-yellow-900' : ''}
                                    ${alert.severity === 'info' ? 'text-blue-900' : ''}
                                `}>
                                    {alert.message}
                                </p>
                            </div>
                            <Link
                                href={alert.action}
                                className={`
                                    text-sm font-medium flex items-center gap-1
                                    ${alert.severity === 'error' ? 'text-red-700 hover:text-red-800' : ''}
                                    ${alert.severity === 'warning' ? 'text-yellow-700 hover:text-yellow-800' : ''}
                                    ${alert.severity === 'info' ? 'text-blue-700 hover:text-blue-800' : ''}
                                `}
                            >
                                Fix
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Subscription Status */}
                <StatusCard
                    title="Subscription"
                    icon={<CreditCard className="w-6 h-6" />}
                    status={data.subscription.status}
                    details={[
                        { label: 'Plan', value: data.subscription.plan },
                        {
                            label: 'Renewal',
                            value: data.subscription.renewalDate
                                ? new Date(data.subscription.renewalDate).toLocaleDateString()
                                : 'N/A'
                        },
                    ]}
                    action={{
                        label: data.subscription.canUpgrade ? 'Upgrade Plan' : 'Manage Plan',
                        href: '/admin/account/subscription',
                    }}
                />

                {/* KYC Status */}
                <StatusCard
                    title="KYC Verification"
                    icon={<FileCheck className="w-6 h-6" />}
                    status={data.kyc.status}
                    details={[
                        {
                            label: 'Status',
                            value: getKYCStatusLabel(data.kyc.status)
                        },
                        ...(data.kyc.missingDocs.length > 0 ? [{
                            label: 'Missing',
                            value: data.kyc.missingDocs.join(', ')
                        }] : []),
                    ]}
                    action={{
                        label: data.kyc.canWithdraw ? 'View Details' : 'Complete Verification',
                        href: '/admin/account/compliance-kyc',
                    }}
                />

                {/* Payment Readiness */}
                <StatusCard
                    title="Payment Setup"
                    icon={<Wallet className="w-6 h-6" />}
                    status={data.payment.payoutsEnabled ? 'VERIFIED' : 'PENDING'}
                    details={[
                        {
                            label: 'Bank Account',
                            value: data.payment.bankConnected ? 'Connected' : 'Not Connected'
                        },
                        {
                            label: 'Payouts',
                            value: data.payment.payoutsEnabled ? 'Enabled' : 'Disabled'
                        },
                    ]}
                    action={{
                        label: data.payment.bankConnected ? 'Manage' : 'Add Bank',
                        href: '/admin/wallet',
                    }}
                />

                {/* WhatsApp Agent */}
                <StatusCard
                    title="WhatsApp Agent"
                    icon={<MessageSquare className="w-6 h-6" />}
                    status={data.whatsapp.connected ? 'ACTIVE' : 'DISCONNECTED'}
                    details={[
                        {
                            label: 'Connection',
                            value: data.whatsapp.connected ? 'Connected' : 'Disconnected'
                        },
                        {
                            label: 'Automation',
                            value: data.whatsapp.automationEnabled ? 'On' : 'Off'
                        },
                    ]}
                    action={{
                        label: 'View Agent',
                        href: '/admin/whatsapp',
                    }}
                />
            </div>
        </div>
    );
}

function StatusCard({
    title,
    icon,
    status,
    details,
    action,
}: {
    title: string;
    icon: React.ReactNode;
    status: string;
    details: Array<{ label: string; value: string }>;
    action: { label: string; href: string };
}) {
    const statusConfig = getStatusConfig(status);

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                    {icon}
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}>
                    {statusConfig.icon}
                    {statusConfig.label}
                </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

            <div className="space-y-2 mb-4">
                {details.map((detail, i) => (
                    <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-600">{detail.label}</span>
                        <span className="font-medium text-gray-900">{detail.value}</span>
                    </div>
                ))}
            </div>

            <Link
                href={action.href}
                className="block w-full text-center px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-900 font-medium rounded-lg transition-colors text-sm"
            >
                {action.label}
            </Link>
        </div>
    );
}

function getStatusConfig(status: string) {
    switch (status.toUpperCase()) {
        case 'ACTIVE':
        case 'VERIFIED':
            return {
                label: 'Active',
                icon: <CheckCircle className="w-3.5 h-3.5" />,
                className: 'bg-green-100 text-green-700',
            };
        case 'PENDING':
        case 'NOT_STARTED':
            return {
                label: 'Pending',
                icon: <Clock className="w-3.5 h-3.5" />,
                className: 'bg-yellow-100 text-yellow-700',
            };
        case 'EXPIRED':
        case 'FAILED':
        case 'DISCONNECTED':
            return {
                label: 'Inactive',
                icon: <XCircle className="w-3.5 h-3.5" />,
                className: 'bg-red-100 text-red-700',
            };
        default:
            return {
                label: status,
                icon: <Clock className="w-3.5 h-3.5" />,
                className: 'bg-gray-100 text-gray-700',
            };
    }
}

function getKYCStatusLabel(status: string): string {
    switch (status.toUpperCase()) {
        case 'VERIFIED':
            return 'Verified';
        case 'PENDING':
            return 'Under Review';
        case 'FAILED':
            return 'Failed';
        case 'NOT_STARTED':
            return 'Not Started';
        default:
            return status;
    }
}
