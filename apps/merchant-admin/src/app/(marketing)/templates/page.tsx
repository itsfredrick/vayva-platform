'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@vayva/ui';
import { TemplateConfirmation } from '@/components/onboarding/TemplateConfirmation';
import { SetupModeSelector } from '@/components/onboarding/SetupModeSelector';
import { UpgradeModal } from '@/components/onboarding/UpgradeModal';

type PlanTier = 'free' | 'growth' | 'pro';

const TEMPLATES = [
    // 🟢 FREE PLAN — FOUNDATIONAL TEMPLATES
    {
        id: 'simple-retail',
        name: 'Simple Retail Selling',
        category: 'retail',
        tier: 'free' as PlanTier,
        description: 'Orders, manual payments, basic delivery notes for solo sellers.',
        bestFor: 'Solo merchants selling physical products',
        workflows: ['Orders', 'Manual Payments', 'Delivery Notes'],
        setupTime: '5 minutes',
        volume: 'low',
        teamSize: 'solo',
        configures: ['Order statuses', 'Manual payment recording', 'Basic delivery notes', 'Single-user flow'],
        customizable: ['Prices', 'Status names'],
        constraints: ['Single user', 'Limited records history', 'No inventory automation', 'No advanced reports'],
    },
    {
        id: 'solo-services',
        name: 'Solo Services',
        category: 'services',
        tier: 'free' as PlanTier,
        description: 'Bookings via WhatsApp with payment confirmation.',
        bestFor: 'Service providers and consultants',
        workflows: ['Bookings', 'Payment Confirmation', 'Customer Records'],
        setupTime: '5 minutes',
        volume: 'low',
        teamSize: 'solo',
        configures: ['Booking statuses', 'Payment confirmation', 'Simple customer records'],
        customizable: ['Service types', 'Pricing'],
        constraints: ['Single user', 'Limited records history', 'No team access', 'No advanced reports'],
    },

    // 🔵 GROWTH PLAN — OPERATIONAL TEMPLATES
    {
        id: 'structured-retail',
        name: 'Structured Retail',
        category: 'retail',
        tier: 'growth' as PlanTier,
        description: 'Full order lifecycle with inventory and delivery tracking.',
        bestFor: 'Merchants with repeatable daily operations',
        workflows: ['Orders', 'Payments', 'Inventory', 'Deliveries', 'Records'],
        setupTime: '10 minutes',
        volume: 'medium',
        teamSize: 'small',
        configures: ['Full order lifecycle', 'Payment reconciliation', 'Inventory tracking', 'Delivery status flow'],
        customizable: ['Prices', 'Status names', 'Staff roles', 'Workflow rules'],
        capabilitiesUnlocked: ['Multi-staff access', 'Inventory workflows', 'Basic exports'],
    },
    {
        id: 'food-catering',
        name: 'Food & Catering',
        category: 'food',
        tier: 'growth' as PlanTier,
        description: 'Order batching and delivery coordination for food businesses.',
        bestFor: 'Food vendors and catering services',
        workflows: ['Orders', 'Payments', 'Deliveries', 'Inventory', 'Records'],
        setupTime: '10–15 minutes',
        volume: 'medium',
        teamSize: 'small',
        configures: ['Order batching', 'Delivery coordination', 'Repeat customer handling', 'Inventory alerts'],
        customizable: ['Menu items', 'Delivery zones', 'Staff roles', 'Workflow rules'],
        capabilitiesUnlocked: ['Multi-staff access', 'Inventory workflows', 'Basic exports'],
    },
    {
        id: 'online-selling',
        name: 'Online Selling',
        category: 'online',
        tier: 'growth' as PlanTier,
        description: 'High-volume handling with customer history and reports.',
        bestFor: 'Online stores with inventory management',
        workflows: ['Orders', 'Payments', 'Inventory', 'Deliveries', 'Customers', 'Records'],
        setupTime: '15 minutes',
        volume: 'high',
        teamSize: 'small',
        configures: ['High-order volume handling', 'Customer history', 'Basic reports', 'Inventory tracking'],
        customizable: ['Product catalog', 'Pricing', 'Staff roles', 'Workflow rules'],
        capabilitiesUnlocked: ['Multi-staff access', 'Inventory workflows', 'Basic exports'],
    },

    // 🟣 PRO PLAN — ADVANCED / SCALE TEMPLATES
    {
        id: 'wholesale',
        name: 'Wholesale / Bulk Orders',
        category: 'wholesale',
        tier: 'pro' as PlanTier,
        description: 'Complex pricing, partial payments, and delivery stages.',
        bestFor: 'Bulk sellers and distributors',
        workflows: ['Orders', 'Payments', 'Inventory', 'Deliveries', 'Records'],
        setupTime: '15 minutes',
        volume: 'high',
        teamSize: 'multi',
        configures: ['Complex pricing', 'Partial payments', 'Delivery stages', 'Bulk order statuses'],
        customizable: ['Minimum orders', 'Payment terms', 'Staff roles', 'Workflow rules'],
        capabilitiesUnlocked: ['Unlimited staff', 'Full audit logs', 'Long-term data retention', 'Priority support'],
    },
    {
        id: 'multi-branch',
        name: 'Multi-Branch Operations',
        category: 'retail',
        tier: 'pro' as PlanTier,
        description: 'Team roles, visibility across staff, consolidated records.',
        bestFor: 'Businesses with multiple locations or branches',
        workflows: ['Orders', 'Payments', 'Inventory', 'Deliveries', 'Team', 'Records'],
        setupTime: '20 minutes',
        volume: 'high',
        teamSize: 'multi',
        configures: ['Team roles', 'Visibility across staff', 'Consolidated records', 'Branch management'],
        customizable: ['Branch structure', 'Staff permissions', 'Workflow rules', 'Reports'],
        capabilitiesUnlocked: ['Unlimited staff', 'Full audit logs', 'Long-term data retention', 'Priority support'],
    },
    {
        id: 'custom-advanced',
        name: 'Custom Advanced Setup',
        category: 'custom',
        tier: 'pro' as PlanTier,
        description: 'Full workflow customization with advanced reports and audit trails.',
        bestFor: 'Businesses requiring complete operational control',
        workflows: ['Customizable'],
        setupTime: '30+ minutes',
        volume: 'any',
        teamSize: 'any',
        configures: ['Full workflow customization', 'Advanced reports', 'Audit trails', 'Custom integrations'],
        customizable: ['Everything'],
        capabilitiesUnlocked: ['Unlimited staff', 'Full audit logs', 'Long-term data retention', 'Priority support'],
    },
];

const WORKFLOW_STEPS = [
    { id: 'chat', label: 'Customer chat', icon: '💬' },
    { id: 'order', label: 'Order created', icon: '📝' },
    { id: 'payment', label: 'Payment recorded', icon: '💰' },
    { id: 'delivery', label: 'Delivery tracked', icon: '🚚' },
    { id: 'record', label: 'Record stored', icon: '📊' },
];

export default function TemplatesPage() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedVolume, setSelectedVolume] = useState('all');
    const [selectedTeamSize, setSelectedTeamSize] = useState('all');
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [activeWorkflowStep, setActiveWorkflowStep] = useState('order');
    const [compareTemplates, setCompareTemplates] = useState<string[]>([]);

    // Transition flow state
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showModeSelector, setShowModeSelector] = useState(false);
    const [templateToApply, setTemplateToApply] = useState<typeof TEMPLATES[0] | null>(null);

    // Tier system state
    const [userTier, setUserTier] = useState<PlanTier>('free'); // In production, get from auth context
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeTemplate, setUpgradeTemplate] = useState<typeof TEMPLATES[0] | null>(null);

    // Helper function to check if template is accessible
    const isTemplateAccessible = (templateTier: PlanTier): boolean => {
        const tierHierarchy = { free: 0, growth: 1, pro: 2 };
        return tierHierarchy[userTier] >= tierHierarchy[templateTier];
    };

    const filteredTemplates = TEMPLATES.filter(t => {
        if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
        if (selectedVolume !== 'all' && t.volume !== selectedVolume) return false;
        if (selectedTeamSize !== 'all' && t.teamSize !== selectedTeamSize) return false;
        return true;
    });

    const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplate);

    const resetFilters = () => {
        setSelectedCategory('all');
        setSelectedVolume('all');
        setSelectedTeamSize('all');
    };

    const toggleCompare = (templateId: string) => {
        if (compareTemplates.includes(templateId)) {
            setCompareTemplates(compareTemplates.filter(id => id !== templateId));
        } else if (compareTemplates.length < 2) {
            setCompareTemplates([...compareTemplates, templateId]);
        }
    };

    const handleApplyTemplate = (template: typeof TEMPLATES[0]) => {
        // Check if template is accessible based on user's tier
        if (!isTemplateAccessible(template.tier)) {
            setUpgradeTemplate(template);
            setShowUpgradeModal(true);
            setSelectedTemplate(null); // Close preview modal
            return;
        }

        setTemplateToApply(template);
        setShowConfirmation(true);
        setSelectedTemplate(null); // Close preview modal
    };

    const handleConfirmationContinue = () => {
        setShowConfirmation(false);
        setShowModeSelector(true);
    };

    const handleConfirmationGoBack = () => {
        setShowConfirmation(false);
        setTemplateToApply(null);
    };

    const handleModeSelect = (mode: 'guided' | 'quick') => {
        // Store template selection and redirect to appropriate flow
        if (mode === 'guided') {
            // Redirect to guided onboarding
            window.location.href = `/onboarding/welcome?template=${templateToApply?.id}`;
        } else {
            // Redirect to quick setup
            window.location.href = `/onboarding/quick-setup?template=${templateToApply?.id}`;
        }
    };

    // Show transition screens if active
    if (showConfirmation && templateToApply) {
        return (
            <TemplateConfirmation
                template={templateToApply}
                onContinue={handleConfirmationContinue}
                onGoBack={handleConfirmationGoBack}
            />
        );
    }

    if (showModeSelector && templateToApply) {
        return <SetupModeSelector onSelectMode={handleModeSelect} />;
    }

    // Show upgrade modal if user tries to access locked template
    if (showUpgradeModal && upgradeTemplate) {
        const features = upgradeTemplate.capabilitiesUnlocked || upgradeTemplate.configures;
        return (
            <>
                {/* Render the main page in background */}
                <div className="min-h-screen bg-white">
                    {/* Page content will be here */}
                </div>
                <UpgradeModal
                    requiredTier={upgradeTemplate.tier as 'growth' | 'pro'}
                    templateName={upgradeTemplate.name}
                    features={features}
                    onClose={() => {
                        setShowUpgradeModal(false);
                        setUpgradeTemplate(null);
                    }}
                />
            </>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Page Header */}
            <section className="pt-32 pb-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <p className="text-sm text-[#64748B] mb-4">Product → Templates</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-6 leading-tight">
                        Pre-built business setups you can trust.
                    </h1>
                    <p className="text-xl text-[#64748B] max-w-3xl mb-4">
                        Templates give you ready-made workflows for common WhatsApp businesses—orders, payments, deliveries, and records already structured.
                    </p>
                    <p className="text-sm text-[#64748B] italic">
                        You can preview everything before applying a template.
                    </p>
                </div>
            </section>

            {/* Template Browser */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Filter Panel (Sticky) */}
                        <div className="lg:col-span-1">
                            <div className="lg:sticky lg:top-24 space-y-6">
                                {/* Business Type */}
                                <div>
                                    <h3 className="text-sm font-semibold text-[#64748B] mb-3 uppercase tracking-wide">
                                        Business Type
                                    </h3>
                                    <div className="space-y-2">
                                        {[
                                            { id: 'all', label: 'All types' },
                                            { id: 'retail', label: 'Retail' },
                                            { id: 'food', label: 'Food & catering' },
                                            { id: 'services', label: 'Services' },
                                            { id: 'online', label: 'Online selling' },
                                            { id: 'wholesale', label: 'Wholesale' },
                                        ].map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setSelectedCategory(cat.id)}
                                                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selectedCategory === cat.id
                                                    ? 'bg-[#22C55E]/10 text-[#22C55E] font-semibold'
                                                    : 'text-[#0F172A] hover:bg-gray-50'
                                                    }`}
                                            >
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Volume */}
                                <div>
                                    <h3 className="text-sm font-semibold text-[#64748B] mb-3 uppercase tracking-wide">
                                        Order Volume
                                    </h3>
                                    <div className="space-y-2">
                                        {[
                                            { id: 'all', label: 'All volumes' },
                                            { id: 'low', label: 'Low' },
                                            { id: 'medium', label: 'Medium' },
                                            { id: 'high', label: 'High' },
                                        ].map((vol) => (
                                            <button
                                                key={vol.id}
                                                onClick={() => setSelectedVolume(vol.id)}
                                                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selectedVolume === vol.id
                                                    ? 'bg-[#22C55E]/10 text-[#22C55E] font-semibold'
                                                    : 'text-[#0F172A] hover:bg-gray-50'
                                                    }`}
                                            >
                                                {vol.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Team Size */}
                                <div>
                                    <h3 className="text-sm font-semibold text-[#64748B] mb-3 uppercase tracking-wide">
                                        Team Size
                                    </h3>
                                    <div className="space-y-2">
                                        {[
                                            { id: 'all', label: 'All sizes' },
                                            { id: 'solo', label: 'Solo' },
                                            { id: 'small', label: 'Small team' },
                                            { id: 'multi', label: 'Multi-staff' },
                                        ].map((size) => (
                                            <button
                                                key={size.id}
                                                onClick={() => setSelectedTeamSize(size.id)}
                                                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selectedTeamSize === size.id
                                                    ? 'bg-[#22C55E]/10 text-[#22C55E] font-semibold'
                                                    : 'text-[#0F172A] hover:bg-gray-50'
                                                    }`}
                                            >
                                                {size.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Reset Filters */}
                                <button
                                    onClick={resetFilters}
                                    className="text-sm text-[#22C55E] hover:underline"
                                >
                                    Reset filters
                                </button>
                            </div>
                        </div>

                        {/* Template Grid */}
                        <div className="lg:col-span-3">
                            <div className="grid md:grid-cols-2 gap-6">
                                {filteredTemplates.map((template) => (
                                    <div
                                        key={template.id}
                                        className="bg-white border border-gray-200 rounded-lg p-6 hover:border-[#22C55E] hover:shadow-sm transition-all group"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <span className="text-xs bg-gray-100 text-[#64748B] px-2 py-1 rounded uppercase">
                                                    {template.category}
                                                </span>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={compareTemplates.includes(template.id)}
                                                onChange={() => toggleCompare(template.id)}
                                                className="w-4 h-4"
                                                disabled={!compareTemplates.includes(template.id) && compareTemplates.length >= 2}
                                            />
                                        </div>

                                        <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                                            {template.name}
                                        </h3>
                                        <p className="text-[#64748B] mb-4">
                                            {template.description}
                                        </p>

                                        {/* Workflows */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {template.workflows.map((workflow) => (
                                                <span
                                                    key={workflow}
                                                    className="text-xs bg-gray-100 text-[#64748B] px-2 py-1 rounded"
                                                >
                                                    {workflow}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                            <span className="text-sm text-[#64748B]">
                                                {template.setupTime}
                                            </span>
                                            <Button
                                                variant="outline"
                                                className="border-2 border-gray-300 text-sm"
                                                onClick={() => setSelectedTemplate(template.id)}
                                            >
                                                Preview template
                                            </Button>
                                        </div>

                                        {/* Hover hint */}
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-3 text-xs text-[#22C55E] italic">
                                            Best for: {template.bestFor}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Compare Templates */}
                            {compareTemplates.length === 2 && (
                                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                                    <h3 className="font-semibold text-[#0F172A] mb-4">Compare Templates</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        {compareTemplates.map(id => {
                                            const t = TEMPLATES.find(template => template.id === id);
                                            return t ? (
                                                <div key={id}>
                                                    <h4 className="font-semibold text-[#0F172A] mb-2">{t.name}</h4>
                                                    <div className="space-y-2 text-sm text-[#64748B]">
                                                        <p><strong>Type:</strong> {t.category}</p>
                                                        <p><strong>Workflows:</strong> {t.workflows.join(', ')}</p>
                                                        <p><strong>Team:</strong> {t.teamSize}</p>
                                                        <p><strong>Setup:</strong> {t.setupTime}</p>
                                                    </div>
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Educational Note */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                        <p className="text-[#64748B] italic">
                            Templates reflect common business patterns, not rules. Your business can evolve beyond them at any time.
                        </p>
                    </div>
                </div>
            </section>

            {/* Custom Setup Option */}
            <section className="py-16 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-4">
                        Prefer full control?
                    </h2>
                    <p className="text-[#64748B] mb-6">
                        Templates are optional. Blank setup available for complete customization.
                    </p>
                    <Link href="/signup">
                        <Button variant="outline" className="border-2 border-gray-300 px-8 py-4 text-lg font-semibold">
                            Start with a blank setup
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Template Preview Modal */}
            {selectedTemplate && currentTemplate && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
                    onClick={() => setSelectedTemplate(null)}
                >
                    <div
                        className="bg-white rounded-lg max-w-5xl w-full my-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Preview Header */}
                        <div className="p-8 border-b border-gray-200">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-3xl font-bold text-[#0F172A] mb-2">
                                        {currentTemplate.name}
                                    </h2>
                                    <p className="text-[#64748B] mb-2">{currentTemplate.description}</p>
                                    <p className="text-sm text-[#64748B]">
                                        <strong>Best for:</strong> {currentTemplate.bestFor}
                                    </p>
                                    <p className="text-sm text-[#64748B]">
                                        <strong>Setup time:</strong> {currentTemplate.setupTime}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedTemplate(null)}
                                    className="text-[#64748B] hover:text-[#0F172A] text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        {/* Workflow Map */}
                        <div className="p-8 border-b border-gray-200 bg-gray-50">
                            <h3 className="font-semibold text-[#0F172A] mb-4">Workflow visualization</h3>
                            <div className="flex items-center justify-between gap-2 overflow-x-auto">
                                {WORKFLOW_STEPS.map((step, i) => (
                                    <React.Fragment key={step.id}>
                                        <button
                                            onClick={() => setActiveWorkflowStep(step.id)}
                                            className={`flex-shrink-0 px-4 py-3 rounded-lg border-2 transition-all ${activeWorkflowStep === step.id
                                                ? 'border-[#22C55E] bg-[#22C55E]/10'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="text-2xl mb-1">{step.icon}</div>
                                            <div className="text-xs font-semibold text-[#0F172A]">{step.label}</div>
                                        </button>
                                        {i < WORKFLOW_STEPS.length - 1 && (
                                            <div className="text-[#64748B]">→</div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* Live Preview Tabs */}
                        <div className="p-8 border-b border-gray-200">
                            <div className="flex gap-4 mb-6 border-b border-gray-200">
                                {['overview', 'workflows', 'configuration'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-3 px-2 text-sm font-semibold transition-colors ${activeTab === tab
                                            ? 'text-[#22C55E] border-b-2 border-[#22C55E]'
                                            : 'text-[#64748B] hover:text-[#0F172A]'
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            {activeTab === 'overview' && (
                                <div className="space-y-4">
                                    <p className="text-[#64748B]">{currentTemplate.description}</p>
                                    <p className="text-[#64748B]">
                                        This template is designed for {currentTemplate.bestFor.toLowerCase()}.
                                    </p>
                                </div>
                            )}

                            {activeTab === 'workflows' && (
                                <div className="space-y-3">
                                    {currentTemplate.workflows.map((workflow) => (
                                        <div key={workflow} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                                            <div className="w-6 h-6 bg-[#22C55E]/10 rounded flex items-center justify-center flex-shrink-0">
                                                <span className="text-[#22C55E] text-sm">✓</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-[#0F172A]">{workflow}</p>
                                                <p className="text-sm text-[#64748B]">Pre-configured and ready to use</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'configuration' && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold text-[#0F172A] mb-3">This template sets up:</h4>
                                        <ul className="space-y-2">
                                            {currentTemplate.configures.map((item) => (
                                                <li key={item} className="flex items-center gap-2 text-sm text-[#64748B]">
                                                    <span className="text-[#22C55E]">✔</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#0F172A] mb-3">You can still change:</h4>
                                        <ul className="space-y-2">
                                            {currentTemplate.customizable.map((item) => (
                                                <li key={item} className="flex items-center gap-2 text-sm text-[#64748B]">
                                                    <span className="text-blue-500">✎</span> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Apply Template */}
                        <div className="p-8">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-blue-900 mb-2">
                                    Applying a template sets up workflows and defaults. You can edit everything later.
                                </p>
                                <p className="text-xs text-blue-700">
                                    Templates never remove features or lock your data.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <Button
                                    onClick={() => currentTemplate && handleApplyTemplate(currentTemplate)}
                                    className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] text-white py-4 text-lg font-semibold"
                                >
                                    Apply template
                                </Button>
                                <Button
                                    onClick={() => currentTemplate && handleApplyTemplate(currentTemplate)}
                                    variant="outline"
                                    className="flex-1 border-2 border-gray-300 py-4 text-lg font-semibold"
                                >
                                    Customize first
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
