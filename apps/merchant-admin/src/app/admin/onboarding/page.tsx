'use client';

import React, { useState } from 'react';
import { Button, Icon, cn } from '@vayva/ui';
import { api } from '@/services/api';

const WIZARD_STEPS = [
    { key: 'business', title: 'Business Profile', icon: 'Building' },
    { key: 'branding', title: 'Branding', icon: 'Palette' },
    { key: 'products', title: 'Products', icon: 'Package' },
    { key: 'payments', title: 'Payments', icon: 'CreditCard' },
    { key: 'delivery', title: 'Delivery', icon: 'Truck' },
    { key: 'whatsapp', title: 'WhatsApp', icon: 'MessageCircle' },
    { key: 'policies', title: 'Policies', icon: 'FileText' },
];

export default function OnboardingWizardPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<any>({});

    const handleNext = async () => {
        const stepKey = WIZARD_STEPS[currentStep].key;
        try {
            await api.post('/onboarding/wizard/step', { stepKey, action: 'complete' });
            if (currentStep < WIZARD_STEPS.length - 1) {
                setCurrentStep(currentStep + 1);
            } else {
                window.location.href = '/admin/onboarding/go-live';
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSkip = async () => {
        const stepKey = WIZARD_STEPS[currentStep].key;
        try {
            await api.post('/onboarding/wizard/step', { stepKey, action: 'skip' });
            if (currentStep < WIZARD_STEPS.length - 1) {
                setCurrentStep(currentStep + 1);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const step = WIZARD_STEPS[currentStep];

    return (
        <div className="min-h-screen bg-[#F7FAF7] flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-8 py-6">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-[#0B1220]">Store Setup</h1>
                    <span className="text-sm text-[#525252]">Step {currentStep + 1} of {WIZARD_STEPS.length}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white border-b border-gray-100 px-8 py-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-2">
                        {WIZARD_STEPS.map((s, i) => (
                            <React.Fragment key={s.key}>
                                <div className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                    i === currentStep ? "bg-green-50 text-green-600" :
                                        i < currentStep ? "bg-gray-50 text-gray-400" : "text-gray-300"
                                )}>
                                    <Icon name={s.icon as any} size={16} />
                                    <span className="hidden md:inline">{s.title}</span>
                                </div>
                                {i < WIZARD_STEPS.length - 1 && (
                                    <div className={cn("flex-1 h-0.5", i < currentStep ? "bg-green-500" : "bg-gray-200")} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-8 py-12">
                <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-[#0B1220] mb-2">{step.title}</h2>
                        <p className="text-[#525252]">Complete this step to continue setting up your store.</p>
                    </div>

                    {/* Step Content (Simplified) */}
                    <div className="space-y-4 mb-8">
                        {step.key === 'business' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-[#0B1220] mb-1">Store Name</label>
                                    <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="My Store" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#0B1220] mb-1">Contact Email</label>
                                    <input type="email" className="w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="hello@mystore.ng" />
                                </div>
                            </>
                        )}
                        {step.key === 'branding' && (
                            <div>
                                <label className="block text-sm font-medium text-[#0B1220] mb-1">Upload Logo</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                                    <Icon name="Upload" size={32} className="mx-auto text-gray-300 mb-2" />
                                    <p className="text-sm text-[#525252]">Click to upload or drag and drop</p>
                                </div>
                            </div>
                        )}
                        {step.key === 'products' && (
                            <div className="text-center py-8">
                                <Icon name="Package" size={48} className="mx-auto text-gray-300 mb-4" />
                                <p className="text-[#525252] mb-4">Add your first product to get started</p>
                                <Button>Add Product</Button>
                            </div>
                        )}
                        {/* Other steps would have similar simplified forms */}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        <Button variant="ghost" onClick={handleSkip}>Skip for now</Button>
                        <Button onClick={handleNext}>
                            {currentStep === WIZARD_STEPS.length - 1 ? 'Go to Checklist' : 'Save & Continue'}
                            <Icon name="ArrowRight" size={16} className="ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
