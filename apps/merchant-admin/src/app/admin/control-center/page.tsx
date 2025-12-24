
"use client";

import React, { useState, useEffect } from 'react';
import { ControlCenterState, SubscriptionPlan } from '@vayva/shared';
import { ControlCenterHeader } from '@/components/control-center/ControlCenterHeader';
import { TemplateGallery } from '@/components/control-center/TemplateGallery';
import { DomainSettings } from '@/components/control-center/DomainSettings';
import { SalesChannels } from '@/components/control-center/SalesChannels';
import { IntegrationsList } from '@/components/control-center/IntegrationsList';
import { UsageAndSystem } from '@/components/control-center/UsageAndSystem';

export default function ControlCenterPage() {
    const [state, setState] = useState<ControlCenterState | null>(null);
    const [loading, setLoading] = useState(true);
    // Mock user plan - in real app would come from useAuth/useMerchant
    const currentPlan = SubscriptionPlan.GROWTH;

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [templates, domains, integrations, channels, usage] = await Promise.all([
                    fetch('/api/control-center/templates').then(r => r.json()),
                    fetch('/api/control-center/domains').then(r => r.json()),
                    fetch('/api/control-center/integrations').then(r => r.json()),
                    fetch('/api/control-center/channels').then(r => r.json()),
                    fetch('/api/control-center/usage').then(r => r.json())
                ]);

                // Construct initial system status
                // In a real app, backend would aggregate this. Here we self-diagnose for demo.
                const issues = [];
                const webChannel = channels.find((c: any) => c.type === 'website');
                const domainsActive = domains.some((d: any) => d.status === 'active');

                if (webChannel?.status === 'enabled' && !domainsActive) {
                    issues.push({
                        id: 'iss_1',
                        message: 'Website is enabled but no domain is active.',
                        severity: 'warning' as const,
                        actionUrl: '#domains'
                    });
                }

                setState({
                    templates,
                    domains,
                    integrations,
                    channels,
                    usage: {
                        orders: usage.orders,
                        products: usage.products,
                        templates: usage.templates
                    },
                    systemStatus: {
                        healthy: issues.length === 0,
                        issues
                    }
                });

            } catch (err) {
                console.error("Failed to load control center", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    const handleUseTemplate = async (id: string) => {
        // Optimistic update or reload
        // In real app, call API
        console.log("Use template", id);
    };

    const handleAddDomain = () => {
        console.log("Add domain");
    };

    if (loading || !state) {
        return (
            <div className="animate-pulse space-y-8 max-w-7xl mx-auto pb-20">
                <div className="h-20 bg-gray-100 rounded-xl w-full"></div>
                <div className="h-64 bg-gray-100 rounded-xl w-full"></div>
                <div className="h-40 bg-gray-100 rounded-xl w-full"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ControlCenterHeader healthy={state.systemStatus.healthy} />

            <TemplateGallery
                templates={state.templates}
                currentPlan={currentPlan}
                onUseTemplate={handleUseTemplate}
            />

            <hr className="my-12 border-gray-100" />

            <DomainSettings
                domains={state.domains}
                onAddDomain={handleAddDomain}
            />

            <SalesChannels channels={state.channels} />

            <hr className="my-12 border-gray-100" />

            <IntegrationsList integrations={state.integrations} />

            <hr className="my-12 border-gray-100" />

            <UsageAndSystem
                usage={state.usage}
                systemStatus={state.systemStatus}
            />
        </div>
    );
}
