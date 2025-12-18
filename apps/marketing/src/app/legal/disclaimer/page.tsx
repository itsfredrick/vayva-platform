import { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { Section } from '@/components/marketing/Section';
import { LegalTOC, LegalTOCItem } from '@/components/legal/LegalTOC';
import { LegalContent, LegalSection } from '@/components/legal/LegalContent';

export const metadata: Metadata = {
    title: 'Disclaimer | Vayva',
    description: 'Important information about using Vayva.'
};

const tocItems: LegalTOCItem[] = [
    { id: 'platform-only', title: 'Platform-Only Disclaimer' },
    { id: 'delivery', title: 'Delivery Disclaimer' },
    { id: 'third-party', title: 'Third-Party Integrations' },
    { id: 'no-guarantees', title: 'No Guarantee of Outcomes' },
];

const sections: LegalSection[] = [
    {
        id: 'platform-only',
        title: '1. Platform-Only Disclaimer',
        content: (
            <>
                <p><strong>Vayva is a platform provider, not a seller.</strong></p>
                <p>Merchants using Vayva are independent sellers. Vayva does not:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Own, manufacture, or sell the products listed on merchant storefronts</li>
                    <li>Act as the merchant of record for transactions</li>
                    <li>Control product quality, pricing, or availability</li>
                    <li>Handle customer disputes related to products</li>
                </ul>
                <p className="mt-4">All product-related inquiries, complaints, and disputes should be directed to the merchant.</p>
            </>
        )
    },
    {
        id: 'delivery',
        title: '2. Delivery Disclaimer',
        content: (
            <>
                <p><strong>Vayva provides delivery management tools only.</strong></p>
                <p>Fulfillment and delivery are the merchant's responsibility. Vayva is not responsible for:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Delivery delays or failures</li>
                    <li>Lost, damaged, or stolen packages</li>
                    <li>Incorrect addresses provided by customers</li>
                    <li>Delivery partner performance (e.g., Kwik)</li>
                    <li>Self-dispatch rider conduct</li>
                </ul>
                <p className="mt-4">Merchants are responsible for ensuring successful delivery to customers.</p>
            </>
        )
    },
    {
        id: 'third-party',
        title: '3. Third-Party Integrations Disclaimer',
        content: (
            <>
                <p>Vayva integrates with third-party services including:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>WhatsApp Business API</li>
                    <li>Payment processors (Paystack, Stripe, etc.)</li>
                    <li>Delivery partners (Kwik, etc.)</li>
                </ul>
                <p className="mt-4">These services are governed by their own terms and policies. Vayva is not responsible for:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Third-party service outages or downtime</li>
                    <li>Changes to third-party terms or pricing</li>
                    <li>Third-party data breaches or security issues</li>
                    <li>Third-party policy violations</li>
                </ul>
            </>
        )
    },
    {
        id: 'no-guarantees',
        title: '4. No Guarantee of Outcomes',
        content: (
            <>
                <p>Vayva provides tools to help merchants sell online, but we do not guarantee:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Sales or Revenue:</strong> Success depends on many factors including product quality, pricing, marketing, and customer service</li>
                    <li><strong>Customer Acquisition:</strong> Merchants are responsible for attracting and retaining customers</li>
                    <li><strong>Delivery Times:</strong> Actual delivery times may vary based on location, traffic, and other factors</li>
                    <li><strong>Uptime:</strong> While we strive for high availability, we cannot guarantee 100% uptime</li>
                    <li><strong>Specific Results:</strong> Past performance or case studies do not guarantee future results</li>
                </ul>
                <p className="mt-4">Your success as a merchant depends on your own efforts, products, and business practices.</p>
            </>
        )
    },
];

export default function DisclaimerPage() {
    return (
        <MarketingShell>
            <PageHero
                title="Disclaimer"
                subtitle="Important information about using Vayva."
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
