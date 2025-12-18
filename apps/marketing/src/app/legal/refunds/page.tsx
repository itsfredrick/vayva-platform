import { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { Section } from '@/components/marketing/Section';
import { LegalTOC, LegalTOCItem } from '@/components/legal/LegalTOC';
import { LegalContent, LegalSection } from '@/components/legal/LegalContent';

export const metadata: Metadata = {
    title: 'Refund Policy | Vayva',
    description: 'Refund rules for Vayva subscription fees.'
};

const tocItems: LegalTOCItem[] = [
    { id: 'scope', title: 'Scope' },
    { id: 'subscription-refunds', title: 'Subscription Refunds' },
    { id: 'billing-errors', title: 'Billing Errors' },
    { id: 'chargebacks', title: 'Chargebacks' },
    { id: 'trials', title: 'Trials' },
];

const sections: LegalSection[] = [
    {
        id: 'scope',
        title: '1. Scope',
        content: (
            <>
                <p>This Refund Policy applies to Vayva subscription fees only.</p>
                <p><strong>Important:</strong> Refunds for merchant products are handled by the merchant, not Vayva. Each merchant sets their own refund policy for their customers.</p>
            </>
        )
    },
    {
        id: 'subscription-refunds',
        title: '2. Subscription Refunds',
        content: (
            <>
                <p><strong>General Policy:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Subscription fees are <strong>non-refundable</strong> for partial months</li>
                    <li>Refunds are only provided for duplicate charges or billing errors</li>
                    <li>If you cancel your subscription, you retain access until the end of your current billing period</li>
                </ul>
                <p className="mt-4"><strong>First-Time Purchase:</strong> If you are dissatisfied within the first 7 days of your initial subscription, contact us to discuss a refund. This applies only to your first subscription purchase.</p>
            </>
        )
    },
    {
        id: 'billing-errors',
        title: '3. Billing Errors',
        content: (
            <>
                <p>If you believe you've been charged incorrectly, contact us immediately at support@vayva.ng</p>
                <p><strong>Required Information:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Invoice ID or transaction reference</li>
                    <li>Description of the error</li>
                    <li>Expected vs. actual charge amount</li>
                </ul>
                <p className="mt-4">We will investigate and respond within 5 business days.</p>
            </>
        )
    },
    {
        id: 'chargebacks',
        title: '4. Chargebacks',
        content: (
            <>
                <p>Before filing a chargeback with your bank, please contact us first. Chargebacks can result in:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Immediate account suspension</li>
                    <li>Loss of access to your data</li>
                    <li>Additional fees to cover chargeback costs</li>
                </ul>
                <p className="mt-4">We are committed to resolving billing issues fairly and quickly.</p>
            </>
        )
    },
    {
        id: 'trials',
        title: '5. Trials',
        content: (
            <>
                <p>If we offer a free trial:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>You will not be charged during the trial period</li>
                    <li>You can cancel anytime before the trial ends to avoid charges</li>
                    <li>If you do not cancel, your subscription will automatically begin and you will be charged</li>
                </ul>
            </>
        )
    },
];

export default function RefundsPage() {
    return (
        <MarketingShell>
            <PageHero
                title="Refund Policy"
                subtitle="Refund rules for Vayva subscription fees (this is not a merchant product refund policy)."
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
