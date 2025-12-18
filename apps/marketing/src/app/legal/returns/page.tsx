import { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { Section } from '@/components/marketing/Section';
import { LegalTOC, LegalTOCItem } from '@/components/legal/LegalTOC';
import { LegalContent, LegalSection } from '@/components/legal/LegalContent';

export const metadata: Metadata = {
    title: 'Returns Policy Template | Vayva',
    description: 'A template merchants can adapt for their storefront returns policy.'
};

const tocItems: LegalTOCItem[] = [
    { id: 'returns-window', title: 'Returns Window' },
    { id: 'eligible-items', title: 'Eligible Items' },
    { id: 'non-returnable', title: 'Non-Returnable Items' },
    { id: 'condition', title: 'Condition Requirements' },
    { id: 'return-methods', title: 'Return Methods' },
    { id: 'refund-method', title: 'Refund Method' },
    { id: 'exchange', title: 'Exchange Policy' },
    { id: 'processing', title: 'Processing Time' },
];

const sections: LegalSection[] = [
    {
        id: 'returns-window',
        title: '1. Returns Window',
        content: (
            <>
                <p><strong>Note:</strong> This is a template. Merchants should customize this to match their business needs.</p>
                <p className="mt-4"><strong>Suggested:</strong> [7/14/30] days from delivery date</p>
                <p>Customers may return eligible items within [X] days of receiving their order.</p>
            </>
        )
    },
    {
        id: 'eligible-items',
        title: '2. Eligible Items',
        content: (
            <>
                <p>To be eligible for return, items must be:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Unused and in original condition</li>
                    <li>In original packaging with tags attached</li>
                    <li>Accompanied by proof of purchase</li>
                </ul>
            </>
        )
    },
    {
        id: 'non-returnable',
        title: '3. Non-Returnable Items',
        content: (
            <>
                <p>The following items cannot be returned:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Perishable goods (food, flowers)</li>
                    <li>Personal care items (cosmetics, underwear)</li>
                    <li>Custom or personalized items</li>
                    <li>Sale or clearance items (optional)</li>
                    <li>Digital products or downloads</li>
                </ul>
            </>
        )
    },
    {
        id: 'condition',
        title: '4. Condition Requirements',
        content: (
            <>
                <p>Returned items must be:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Unworn, unwashed, and undamaged</li>
                    <li>Free from odors (perfume, smoke, etc.)</li>
                    <li>Complete with all accessories and documentation</li>
                </ul>
                <p className="mt-4">Items that do not meet these requirements may be rejected or subject to a restocking fee.</p>
            </>
        )
    },
    {
        id: 'return-methods',
        title: '5. Return Methods',
        content: (
            <>
                <p><strong>Option 1: Pickup</strong></p>
                <p>Contact us to arrange pickup. Pickup fees may apply.</p>
                <p className="mt-4"><strong>Option 2: Drop-off</strong></p>
                <p>Return items to: [Merchant Address]</p>
                <p className="mt-4">Please contact us before returning to confirm the return is approved.</p>
            </>
        )
    },
    {
        id: 'refund-method',
        title: '6. Refund Method',
        content: (
            <>
                <p><strong>Suggested options:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Original Payment Method:</strong> Refund to the original payment method</li>
                    <li><strong>Store Credit:</strong> Issue store credit for future purchases</li>
                    <li><strong>Bank Transfer:</strong> Direct bank transfer (provide account details)</li>
                </ul>
                <p className="mt-4">Shipping fees are non-refundable unless the return is due to our error.</p>
            </>
        )
    },
    {
        id: 'exchange',
        title: '7. Exchange Policy',
        content: (
            <>
                <p>We accept exchanges for:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Different size or color</li>
                    <li>Defective or damaged items</li>
                </ul>
                <p className="mt-4">Contact us to arrange an exchange. Exchanges are subject to availability.</p>
            </>
        )
    },
    {
        id: 'processing',
        title: '8. Processing Time',
        content: (
            <>
                <p>Once we receive your return:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>We will inspect the item within [2-5] business days</li>
                    <li>Approved refunds will be processed within [5-10] business days</li>
                    <li>You will receive a confirmation email once the refund is issued</li>
                </ul>
                <p className="mt-4">Please allow additional time for your bank or payment provider to process the refund.</p>
            </>
        )
    },
];

export default function ReturnsPage() {
    return (
        <MarketingShell>
            <PageHero
                title="Returns Policy (Merchant Template)"
                subtitle="A template merchants can adapt for their storefront. Customize this to match your business needs."
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
