'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

const STEPS = [
    { id: 1, title: 'Account' },
    { id: 2, title: 'Business' },
    { id: 3, title: 'Identity' },
    { id: 4, title: 'Pickup' },
    { id: 5, title: 'Review' },
];

export default function MarketingSignupPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        // Step 1
        fullName: '',
        email: '',
        phone: '',
        password: '',
        // Step 2
        businessName: '',
        businessType: 'individual',
        category: 'fashion',
        // Step 3
        nin: '',
        bvn: '',
        consent: false,
        // Step 4
        address: '',
        state: 'lagos',
        landmark: '',
        sameAsBusiness: false
    });

    const handleNext = async () => {
        if (currentStep < 5) {
            setCurrentStep(c => c + 1);
        } else {
            // Submit
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Mock API
            router.push('/onboarding/welcome');
        }
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(c => c - 1);
    };

    const renderInput = (label: string, value: string, key: string, type = 'text', placeholder = '') => (
        <div className="space-y-2">
            <label className="text-sm font-bold text-white/80">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                className="w-full bg-[#142210] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#46EC13] transition-colors placeholder:text-white/20"
            />
        </div>
    );

    return (
        <div className="min-h-screen py-20 px-4 flex items-center justify-center">
            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between mb-4">
                        {STEPS.map((step) => (
                            <div key={step.id} className={cn("text-xs font-bold uppercase tracking-wider transition-colors", currentStep >= step.id ? "text-[#46EC13]" : "text-white/20")}>
                                {step.title}
                            </div>
                        ))}
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-[#46EC13]"
                            initial={{ width: '0%' }}
                            animate={{ width: `${(currentStep / 5) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="bg-[#0b141a] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div className="text-center mb-8">
                                        <h2 className="text-3xl font-bold text-white">Create your account</h2>
                                        <p className="text-white/50">Start selling in minutes.</p>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {renderInput('Full Name', formData.fullName, 'fullName', 'text', 'Amina Yusuf')}
                                        {renderInput('Phone Number', formData.phone, 'phone', 'tel', '+234...')}
                                    </div>
                                    {renderInput('Email Address', formData.email, 'email', 'email', 'name@example.com')}
                                    {renderInput('Password', formData.password, 'password', 'password', 'Min 8 characters')}
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-white mb-6">Tell us about your business</h2>
                                    {renderInput('Business Name', formData.businessName, 'businessName', 'text', 'e.g. Amina Styles')}

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-white/80">Business Type</label>
                                        <select
                                            value={formData.businessType}
                                            onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                                            className="w-full bg-[#142210] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#46EC13] appearance-none"
                                        >
                                            <option value="individual">Individual / Sole Proprietor</option>
                                            <option value="registered">Registered Company (RC/BN)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-white/80">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-[#142210] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#46EC13] appearance-none"
                                        >
                                            <option value="fashion">Fashion & Apparel</option>
                                            <option value="electronics">Electronics & Gadgets</option>
                                            <option value="beauty">Beauty & Personal Care</option>
                                            <option value="food">Food & Groceries</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-white mb-6">Verify your identity</h2>
                                    <div className="bg-[#46EC13]/10 border border-[#46EC13]/20 rounded-xl p-4 flex gap-3 items-start mb-6">
                                        <Icon name="verified_user" className="text-[#46EC13] shrink-0" />
                                        <p className="text-sm text-[#46EC13]">We need this to verify your payments and protect against fraud. Your data is encrypted.</p>
                                    </div>

                                    {renderInput('National Identity Number (NIN)', formData.nin, 'nin', 'text', '11-digit number')}
                                    {renderInput('Bank Verification Number (BVN)', formData.bvn, 'bvn', 'text', '11-digit number')}

                                    <label className="flex items-center gap-3 cursor-pointer mt-4">
                                        <input
                                            type="checkbox"
                                            checked={formData.consent}
                                            onChange={e => setFormData({ ...formData, consent: e.target.checked })}
                                            className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#46EC13]"
                                        />
                                        <span className="text-sm text-white/60">I confirm these details are accurate and belong to me.</span>
                                    </label>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-white mb-6">Pickup Location</h2>
                                    <p className="text-white/50 mb-6">Where should delivery partners pick up your products?</p>

                                    {renderInput('Street Address', formData.address, 'address', 'text', 'e.g. 15 Admiralty Way')}

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-white/80">State</label>
                                            <select
                                                value={formData.state}
                                                onChange={e => setFormData({ ...formData, state: e.target.value })}
                                                className="w-full bg-[#142210] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#46EC13] appearance-none"
                                            >
                                                <option value="lagos">Lagos</option>
                                                <option value="abuja">Abuja</option>
                                                <option value="rivers">Rivers</option>
                                                {/* More states... */}
                                            </select>
                                        </div>
                                        {renderInput('Landmark', formData.landmark, 'landmark', 'text', 'Nearest bus stop...')}
                                    </div>
                                </div>
                            )}

                            {currentStep === 5 && (
                                <div className="space-y-8 text-center">
                                    <div className="w-20 h-20 bg-[#46EC13]/20 rounded-full flex items-center justify-center mx-auto text-[#46EC13]">
                                        <Icon name="check" size={40} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-white mb-4">You're all set!</h2>
                                        <p className="text-white/60 max-w-md mx-auto">
                                            We've created your Vayva account. Click below to enter your dashboard and start selling.
                                        </p>
                                    </div>

                                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-left max-w-sm mx-auto space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-white/40">Name</span>
                                            <span className="text-white font-bold">{formData.fullName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/40">Store</span>
                                            <span className="text-white font-bold">{formData.businessName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/40">Plan</span>
                                            <span className="text-[#46EC13] font-bold">Free Trial</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="mt-8 pt-8 border-t border-white/10 flex justify-between">
                        {currentStep > 1 ? (
                            <Button variant="ghost" className="text-white/50 hover:text-white" onClick={handleBack}>
                                Back
                            </Button>
                        ) : <div />}

                        <Button
                            className="bg-[#46EC13] hover:bg-[#3DD10F] text-black font-bold h-12 px-8 rounded-xl min-w-[140px]"
                            onClick={handleNext}
                            isLoading={isLoading}
                        >
                            {currentStep === 5 ? 'Enter Dashboard' : 'Continue'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
