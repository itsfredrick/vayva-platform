import { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { Section } from '@/components/marketing/Section';
import { LegalTOC, LegalTOCItem } from '@/components/legal/LegalTOC';
import { LegalContent, LegalSection } from '@/components/legal/LegalContent';

export const metadata: Metadata = {
    title: 'Terms of Service | Vayva',
    description: 'Terms governing your use of Vayva\'s WhatsApp commerce platform.'
};

const tocItems: LegalTOCItem[] = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'definitions', title: 'Definitions' },
    { id: 'eligibility', title: 'Eligibility' },
    { id: 'scope', title: 'Scope of Service' },
    { id: 'merchant-responsibilities', title: 'Merchant Responsibilities' },
    { id: 'payments', title: 'Payments and Billing' },
    { id: 'third-party', title: 'Third-Party Services' },
    { id: 'delivery', title: 'Delivery and Fulfillment' },
    { id: 'prohibited', title: 'Prohibited Uses' },
    { id: 'ip', title: 'Intellectual Property' },
    { id: 'privacy', title: 'Privacy and Data' },
    { id: 'suspension', title: 'Suspension and Termination' },
    { id: 'disclaimers', title: 'Disclaimers' },
    { id: 'liability', title: 'Limitation of Liability' },
    { id: 'indemnity', title: 'Indemnity' },
    { id: 'changes', title: 'Changes to Terms' },
    { id: 'governing-law', title: 'Governing Law' },
];

const sections: LegalSection[] = [
    {
        id: 'introduction',
        title: '1. Introduction',
        content: (
            <>
                <p>Welcome to Vayva. These Terms of Service ("Terms") govern your use of Vayva's platform, including storefronts, WhatsApp commerce tools, order management, and related features (collectively, the "Service").</p>
                <p>Vayva is operated by Vayva Platform ("we", "us", "our"). By accessing or using the Service, you ("Merchant", "you", "your") agree to be bound by these Terms. If you do not agree, do not use the Service.</p>
                <p><strong>Important:</strong> If you are a merchant, you are responsible for your store's policies shown to customers, including your own terms, privacy policy, and refund/return policies.</p>
            </>
        )
    },
    {
        id: 'definitions',
        title: '2. Definitions',
        content: (
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>"Service"</strong> means Vayva's platform, including templates, checkout tools, messaging features, and analytics.</li>
                <li><strong>"Merchant"</strong> means a business or individual using Vayva to sell products or services.</li>
                <li><strong>"Customer"</strong> means an end-user purchasing from a Merchant.</li>
                <li><strong>"Storefront"</strong> means the Merchant's online store created using Vayva templates.</li>
                <li><strong>"Content"</strong> means product listings, images, descriptions, and other materials uploaded by Merchant.</li>
                <li><strong>"Subscription"</strong> means the paid plan selected by Merchant.</li>
                <li><strong>"Third-Party Services"</strong> means external providers like WhatsApp, payment processors, and delivery partners.</li>
            </ul>
        )
    },
    {
        id: 'eligibility',
        title: '3. Eligibility and Account Registration',
        content: (
            <>
                <p>You must be at least 18 years old and legally able to enter into contracts to use the Service.</p>
                <p>When registering, you must provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
                <p>You agree to notify us immediately of any unauthorized use of your account.</p>
            </>
        )
    },
    {
        id: 'scope',
        title: '4. Scope of Service',
        content: (
            <>
                <p><strong>What Vayva Provides:</strong></p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>Storefront templates (default and gallery options)</li>
                    <li>WhatsApp checkout links and messaging tools</li>
                    <li>Order and customer timeline management</li>
                    <li>Delivery status tracking and updates</li>
                    <li>Analytics and reporting</li>
                </ul>
                <p><strong>What Vayva Does Not Provide:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>We are not the merchant of record for your goods or services. You are the seller.</li>
                    <li>We do not guarantee sales, revenue, or customer acquisition.</li>
                    <li>We do not guarantee delivery outcomes. Delivery is your responsibility or that of your chosen delivery partner.</li>
                </ul>
            </>
        )
    },
    {
        id: 'merchant-responsibilities',
        title: '5. Merchant Responsibilities',
        content: (
            <>
                <p>As a Merchant, you are responsible for:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Accurate Listings:</strong> Product descriptions, images, and pricing must be truthful and not misleading.</li>
                    <li><strong>Pricing and Taxes:</strong> You set your own prices and are responsible for collecting and remitting applicable taxes.</li>
                    <li><strong>Customer Support:</strong> You handle customer inquiries, complaints, and disputes related to your products.</li>
                    <li><strong>Legal Compliance:</strong> You must comply with all applicable laws, including consumer protection, advertising standards, and data protection regulations in Nigeria.</li>
                    <li><strong>WhatsApp Compliance:</strong> You may only message customers who have consented to receive messages. You must respect opt-outs and follow WhatsApp's Business Policy.</li>
                </ul>
            </>
        )
    },
    {
        id: 'payments',
        title: '6. Payments and Billing',
        content: (
            <>
                <p>Subscription fees are charged in Nigerian Naira (NGN) according to the plan you select. Current pricing is available on our <a href="/pricing" className="text-[#22C55E] hover:underline">Pricing page</a>.</p>
                <p><strong>Billing Cycle:</strong> Subscriptions are billed monthly in advance. Your subscription automatically renews unless you cancel.</p>
                <p><strong>Late Payment:</strong> If payment fails, we may suspend your account until payment is received.</p>
                <p><strong>Plan Changes:</strong> You may upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.</p>
                <p><strong>Taxes:</strong> Fees are exclusive of taxes. You are responsible for any applicable taxes.</p>
            </>
        )
    },
    {
        id: 'third-party',
        title: '7. Third-Party Services',
        content: (
            <>
                <p>Vayva integrates with third-party services, including:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>WhatsApp Business API providers</li>
                    <li>Payment processors (e.g., Paystack, Stripe)</li>
                    <li>Delivery partners (e.g., Kwik, optional)</li>
                </ul>
                <p><strong>Disclaimer:</strong> Third-party services are governed by their own terms. We are not responsible for outages, changes, or issues with third-party providers beyond our control.</p>
            </>
        )
    },
    {
        id: 'delivery',
        title: '8. Delivery and Fulfillment',
        content: (
            <>
                <p>Vayva supports multiple delivery methods:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li><strong>Self-dispatch:</strong> Use your own riders</li>
                    <li><strong>Customer pickup:</strong> Customers collect orders</li>
                    <li><strong>Partner delivery:</strong> Optional integration with delivery partners like Kwik</li>
                </ul>
                <p>Vayva provides tools to manage delivery, but you (the Merchant) remain responsible for fulfillment and the customer delivery experience. Shipping labels are optional and not required for all deliveries.</p>
            </>
        )
    },
    {
        id: 'prohibited',
        title: '9. Prohibited Uses',
        content: (
            <>
                <p>You may not use the Service to:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Sell illegal goods or services</li>
                    <li>Engage in fraud, deception, or spam</li>
                    <li>Distribute malware, scrape data, or abuse the platform</li>
                    <li>Harass, threaten, or harm others</li>
                    <li>Infringe on intellectual property rights</li>
                    <li>Violate any applicable laws or regulations</li>
                </ul>
            </>
        )
    },
    {
        id: 'ip',
        title: '10. Intellectual Property',
        content: (
            <>
                <p><strong>Vayva IP:</strong> All rights in the Vayva platform, including software, templates, and branding, are owned by Vayva or our licensors.</p>
                <p><strong>Your Content:</strong> You retain ownership of your product listings, images, and other Content. By uploading Content, you grant Vayva a license to host, display, and process it as necessary to provide the Service.</p>
                <p><strong>Templates:</strong> Templates in our gallery may be open-source and subject to their own licenses. Some may require attribution. Check individual template licenses.</p>
            </>
        )
    },
    {
        id: 'privacy',
        title: '11. Privacy and Data Protection',
        content: (
            <>
                <p>Our <a href="/legal/privacy" className="text-[#22C55E] hover:underline">Privacy Policy</a> explains how we collect and use data.</p>
                <p>As a Merchant, you are responsible for complying with data protection laws when collecting and processing customer data. You must obtain necessary consents and provide your own privacy policy to customers.</p>
            </>
        )
    },
    {
        id: 'suspension',
        title: '12. Suspension and Termination',
        content: (
            <>
                <p>We may suspend or terminate your account if:</p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>You violate these Terms</li>
                    <li>Your account is used for illegal activity</li>
                    <li>Payment fails or is disputed</li>
                    <li>We determine there is legal or reputational risk</li>
                </ul>
                <p><strong>Effect:</strong> Upon termination, your access to the Service will be removed. We will retain data as required by law or our retention policies.</p>
            </>
        )
    },
    {
        id: 'disclaimers',
        title: '13. Disclaimers',
        content: (
            <>
                <p>THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, TO THE FULLEST EXTENT PERMITTED BY LAW.</p>
                <p>We do not guarantee that the Service will be uninterrupted, error-free, or secure. We disclaim all warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
            </>
        )
    },
    {
        id: 'liability',
        title: '14. Limitation of Liability',
        content: (
            <>
                <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, VAYVA'S TOTAL LIABILITY FOR ANY CLAIMS ARISING FROM THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE AMOUNTS PAID BY YOU IN THE THREE (3) MONTHS PRECEDING THE CLAIM.</p>
                <p>WE SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS OR REVENUE.</p>
            </>
        )
    },
    {
        id: 'indemnity',
        title: '15. Indemnity',
        content: (
            <>
                <p>You agree to indemnify and hold Vayva harmless from any claims, damages, or expenses arising from:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Your products or services</li>
                    <li>Your Content or conduct</li>
                    <li>Your violation of these Terms or applicable laws</li>
                    <li>Your violation of third-party rights</li>
                </ul>
            </>
        )
    },
    {
        id: 'changes',
        title: '16. Changes to Terms',
        content: (
            <>
                <p>We may update these Terms from time to time. We will notify you of material changes by email or through the Service.</p>
                <p>Your continued use of the Service after changes take effect constitutes acceptance of the updated Terms.</p>
            </>
        )
    },
    {
        id: 'governing-law',
        title: '17. Governing Law and Dispute Resolution',
        content: (
            <>
                <p>These Terms are governed by the laws of the Federal Republic of Nigeria.</p>
                <p>Any disputes arising from these Terms or the Service shall be subject to the exclusive jurisdiction of the courts of Nigeria.</p>
                <p>We encourage you to contact us first to resolve any disputes amicably before pursuing legal action.</p>
            </>
        )
    },
];

export default function TermsPage() {
    return (
        <MarketingShell>
            <PageHero
                title="Terms of Service"
                subtitle="These Terms govern your use of Vayva's services, including storefronts, WhatsApp commerce tools, and related features."
                lastUpdated="2025-12-18"
                align="left"
            />

            <Section className="py-12">
                <div className="grid lg:grid-cols-[240px_1fr] gap-12 max-w-6xl mx-auto">
                    <LegalTOC items={tocItems} />
                    <LegalContent sections={sections} />
                </div>
            </Section>
        </MarketingShell>
    );
}
