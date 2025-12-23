'use client';

import React from 'react';

type ComponentStatus = 'operational' | 'degraded' | 'outage';
type SystemStatus = 'operational' | 'partial' | 'incident';

interface Component {
    name: string;
    status: ComponentStatus;
    description?: string;
}

interface Incident {
    date: string;
    component: string;
    title: string;
    description: string;
    resolved: boolean;
}

export default function SystemStatusPage() {
    // This would come from an API in production
    const systemStatus: SystemStatus = 'operational';
    const lastUpdated = new Date();

    const components: Component[] = [
        { name: 'WhatsApp Connectivity', status: 'operational' },
        { name: 'Orders & Payments', status: 'operational' },
        { name: 'Dashboard', status: 'operational' },
        { name: 'Marketplace', status: 'operational' },
        { name: 'API / Integrations', status: 'operational' },
    ];

    const recentIncidents: Incident[] = [
        // Example incident (would come from API)
        // {
        //   date: '2025-01-15',
        //   component: 'WhatsApp Connectivity',
        //   title: 'Brief connectivity disruption',
        //   description: 'WhatsApp API experienced intermittent connectivity issues affecting message delivery.',
        //   resolved: true,
        // },
    ];

    const getStatusColor = (status: ComponentStatus | SystemStatus) => {
        switch (status) {
            case 'operational':
                return 'text-[#22C55E]';
            case 'degraded':
            case 'partial':
                return 'text-yellow-500';
            case 'outage':
            case 'incident':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    const getStatusIndicator = (status: ComponentStatus | SystemStatus) => {
        switch (status) {
            case 'operational':
                return '🟢';
            case 'degraded':
            case 'partial':
                return '🟡';
            case 'outage':
            case 'incident':
                return '🔴';
            default:
                return '⚪';
        }
    };

    const getStatusText = (status: SystemStatus) => {
        switch (status) {
            case 'operational':
                return 'All systems operational';
            case 'partial':
                return 'Partial disruption';
            case 'incident':
                return 'Service incident';
            default:
                return 'Unknown status';
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <h1 className="text-4xl font-bold text-[#0F172A] mb-4">
                        System Status
                    </h1>
                    <p className="text-lg text-gray-600">
                        Current status and recent activity across the Vayva platform.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Current Status Panel */}
                <section className="mb-16">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <span className="text-4xl">{getStatusIndicator(systemStatus)}</span>
                                <div>
                                    <h2 className={`text-2xl font-bold ${getStatusColor(systemStatus)}`}>
                                        {getStatusText(systemStatus)}
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Updated {Math.floor((Date.now() - lastUpdated.getTime()) / 60000)} minutes ago
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Component Status List */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Component Status</h2>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#0F172A]">
                                        Component
                                    </th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#0F172A]">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {components.map((component, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-[#0F172A]">{component.name}</p>
                                                {component.description && (
                                                    <p className="text-sm text-gray-500 mt-1">{component.description}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span>{getStatusIndicator(component.status)}</span>
                                                <span className={`text-sm font-medium ${getStatusColor(component.status)}`}>
                                                    {component.status === 'operational' ? 'Operational' :
                                                        component.status === 'degraded' ? 'Degraded' : 'Outage'}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Incident History */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Recent Incidents</h2>
                    {recentIncidents.length === 0 ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                            <p className="text-gray-600">No recent incidents to report.</p>
                            <p className="text-sm text-gray-500 mt-2">
                                All systems have been running smoothly.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentIncidents.map((incident, index) => (
                                <details key={index} className="border border-gray-200 rounded-lg">
                                    <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-sm text-gray-500">{incident.date}</span>
                                                    <span className="text-sm text-gray-400">•</span>
                                                    <span className="text-sm text-gray-600">{incident.component}</span>
                                                </div>
                                                <h3 className="font-semibold text-[#0F172A]">{incident.title}</h3>
                                            </div>
                                            <span className={`text-sm font-medium ${incident.resolved ? 'text-[#22C55E]' : 'text-yellow-500'}`}>
                                                {incident.resolved ? 'Resolved' : 'Investigating'}
                                            </span>
                                        </div>
                                    </summary>
                                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                            {incident.description}
                                        </p>
                                    </div>
                                </details>
                            ))}
                        </div>
                    )}
                </section>

                {/* Subscription Option */}
                <section>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                        <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                            Get notified about system updates
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Receive email notifications when system status changes or incidents occur.
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#22C55E]"
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold rounded transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
}
