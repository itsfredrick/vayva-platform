'use client';

import React from 'react';
import Link from 'next/link';

export default function LegalHubPage() {
    const corePolicies = [
        {
            title: 'Terms of Service',
            description: 'The agreement between you and Vayva for using our platform',
            href: '/legal/terms',
        },
        {
            title: 'Privacy Policy',
            description: 'How we collect, use, and protect your personal information',
            href: '/legal/privacy',
        },
        {
            title: 'Acceptable Use Policy',
            description: 'Guidelines for appropriate use of the Vayva platform',
            href: '/legal/acceptable-use',
        },
        {
            title: 'Prohibited Items',
            description: 'Products and services that cannot be sold on Vayva',
            href: '/legal/prohibited-items',
        },
        {
            title: 'Refund Policy',
            description: 'Our policies regarding refunds and cancellations',
            href: '/legal/refund-policy',
        },
    ];

    const safetyCompliance = [
        {
            title: 'KYC & Safety',
            description: 'Identity verification and platform safety measures',
            href: '/legal/kyc-safety',
        },
        {
            title: 'Data Protection',
            description: 'How we safeguard your business and customer data',
            href: '/legal/data-protection',
        },
        {
            title: 'Platform Integrity',
            description: 'Our commitment to maintaining a trustworthy marketplace',
            href: '/legal/platform-integrity',
        },
    ];

    const cookieConsent = [
        {
            title: 'Cookie Policy',
            description: 'How we use cookies and similar technologies',
            href: '/legal/cookie-policy',
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    {/* Breadcrumb */}
                    <nav className="text-sm text-gray-500 mb-4">
                        <Link href="/" className="hover:text-[#22C55E]">Home</Link>
                        <span className="mx-2">→</span>
                        <span className="text-[#0F172A]">Legal</span>
                        <span className="mx-2">→</span>
                        <span className="text-[#0F172A]">Overview</span>
                    </nav>

                    {/* Headline */}
                    <h1 className="text-4xl font-bold text-[#0F172A] mb-4">
                        Legal & Compliance
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg text-gray-600">
                        Transparency matters. Here you'll find Vayva's policies, terms, and compliance documents.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Section 1 - Core Policies */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Core Policies</h2>
                    <div className="grid gap-6">
                        {corePolicies.map((policy) => (
                            <Link
                                key={policy.href}
                                href={policy.href}
                                className="block p-6 border border-gray-200 rounded-lg hover:border-[#22C55E] hover:shadow-sm transition-all"
                            >
                                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                                    {policy.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    {policy.description}
                                </p>
                                <span className="text-sm text-[#22C55E] font-medium">
                                    View document →
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Section 2 - Safety & Compliance */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Safety & Compliance</h2>
                    <div className="grid gap-6">
                        {safetyCompliance.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block p-6 border border-gray-200 rounded-lg hover:border-[#22C55E] hover:shadow-sm transition-all"
                            >
                                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    {item.description}
                                </p>
                                <span className="text-sm text-[#22C55E] font-medium">
                                    View document →
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Section 3 - Cookie & Consent */}
                <section>
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-6">Cookie & Consent</h2>
                    <div className="grid gap-6">
                        {cookieConsent.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="block p-6 border border-gray-200 rounded-lg hover:border-[#22C55E] hover:shadow-sm transition-all"
                            >
                                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    {item.description}
                                </p>
                                <span className="text-sm text-[#22C55E] font-medium">
                                    View document →
                                </span>
                            </Link>
                        ))}

                        {/* Manage Cookies Action */}
                        <button
                            onClick={() => {
                                // TODO: Implement cookie management
                                console.log('Open cookie management');
                            }}
                            className="block p-6 border border-gray-200 rounded-lg hover:border-[#22C55E] hover:shadow-sm transition-all text-left w-full"
                        >
                            <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                                Manage Cookies
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Control your cookie preferences and consent settings
                            </p>
                            <span className="text-sm text-[#22C55E] font-medium">
                                Manage preferences →
                            </span>
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
