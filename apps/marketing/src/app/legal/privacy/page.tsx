import { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { Section } from '@/components/marketing/Section';
import { LegalTOC, LegalTOCItem } from '@/components/legal/LegalTOC';
import { LegalContent, LegalSection } from '@/components/legal/LegalContent';

export const metadata: Metadata = {
    title: 'Privacy Policy | Vayva',
    description: 'How Vayva collects, uses, shares, and protects personal data.'
};

const tocItems: LegalTOCItem[] = [
    { id: 'overview', title: 'Overview' },
    { id: 'data-collection', title: 'Data We Collect' },
    { id: 'usage', title: 'How We Use Data' },
    { id: 'legal-basis', title: 'Legal Basis' },
    { id: 'sharing', title: 'How We Share Data' },
    { id: 'international', title: 'International Transfers' },
    { id: 'retention', title: 'Data Retention' },
    { id: 'security', title: 'Security' },
    { id: 'merchant-responsibilities', title: 'Merchant Responsibilities' },
    { id: 'rights', title: 'Your Rights' },
    { id: 'children', title: 'Children\'s Privacy' },
    { id: 'changes', title: 'Changes to Policy' },
];

const sections: LegalSection[] = [
    {
        id: 'overview',
        title: '1. Overview',
        content: (
            <>
                <p>Vayva respects your privacy. This Privacy Policy explains how we collect, use, share, and protect personal data when you use our Service.</p>
                <p>This policy applies to merchants using Vayva and, where applicable, to their customers whose data flows through the Service.</p>
                <p><strong>Important:</strong> If you are a merchant, you are responsible for your store's privacy policy shown to customers.</p>
            </>
        )
    },
    {
        id: 'data-collection',
        title: '2. Data We Collect',
        content: (
            <>
                <p><strong>A) Account Data:</strong> Name, email address, phone number, business name</p>
                <p><strong>B) Business/Store Data:</strong> Store name, address, delivery zones, product catalog, settings</p>
                <p><strong>C) Transaction Data:</strong> Orders, payment status, refunds, customer purchase history</p>
                <p><strong>D) Communications Data:</strong> WhatsApp conversation metadata (message timestamps, delivery status). Message content is stored only if you enable this feature.</p>
                <p><strong>E) Device/Usage Data:</strong> IP address, browser type, device information, access logs</p>
                <p><strong>F) Cookies:</strong> See our <a href="/legal/cookies" className="text-[#22C55E] hover:underline">Cookies Policy</a></p>
            </>
        )
    },
    {
        id: 'usage',
        title: '3. How We Use Data',
        content: (
            <ul className="list-disc pl-6 space-y-2">
                <li>Provide and improve the Service</li>
                <li>Process transactions and manage orders</li>
                <li>Prevent fraud and enhance security</li>
                <li>Provide customer support</li>
                <li>Comply with legal obligations</li>
                <li>Generate analytics and reports</li>
                <li>Send service-related communications (non-marketing)</li>
            </ul>
        )
    },
    {
        id: 'legal-basis',
        title: '4. Legal Basis for Processing',
        content: (
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Contract Necessity:</strong> Processing is necessary to provide the Service you've subscribed to</li>
                <li><strong>Legitimate Interests:</strong> We process data to improve security, prevent fraud, and enhance the Service</li>
                <li><strong>Consent:</strong> For marketing communications and optional features, we obtain your consent</li>
            </ul>
        )
    },
    {
        id: 'sharing',
        title: '5. How We Share Data',
        content: (
            <>
                <p>We share data with:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Payment Processors:</strong> To process payments (e.g., Paystack, Stripe)</li>
                    <li><strong>WhatsApp Providers:</strong> To deliver messages via WhatsApp Business API</li>
                    <li><strong>Delivery Partners:</strong> Customer address and phone for delivery if you enable partner delivery (e.g., Kwik)</li>
                    <li><strong>Service Providers:</strong> Hosting, analytics, and infrastructure providers</li>
                    <li><strong>Legal Requirements:</strong> When required by court order, law enforcement, or legal process</li>
                </ul>
                <p className="mt-4">We do not sell your personal data.</p>
            </>
        )
    },
    {
        id: 'international',
        title: '6. International Transfers',
        content: (
            <>
                <p>Data may be processed outside Nigeria depending on our hosting providers and service partners.</p>
                <p>We ensure appropriate safeguards are in place to protect your data, including standard contractual clauses and security measures.</p>
            </>
        )
    },
    {
        id: 'retention',
        title: '7. Data Retention',
        content: (
            <>
                <p>We retain data as long as necessary to provide the Service and comply with legal obligations.</p>
                <p>You may request deletion of your data, subject to legal and contractual retention requirements (e.g., tax records, dispute resolution).</p>
            </>
        )
    },
    {
        id: 'security',
        title: '8. Security',
        content: (
            <>
                <p>We implement security measures including:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Access controls and authentication</li>
                    <li>Encryption in transit (HTTPS/TLS)</li>
                    <li>Activity logging and monitoring</li>
                    <li>Regular security reviews</li>
                </ul>
                <p className="mt-4">However, no system is perfectly secure. We cannot guarantee absolute security.</p>
            </>
        )
    },
    {
        id: 'merchant-responsibilities',
        title: '9. Merchant Responsibilities',
        content: (
            <>
                <p>As a merchant, you must:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Only upload lawful customer data</li>
                    <li>Obtain necessary consents for messaging and marketing</li>
                    <li>Provide your own privacy policy to customers</li>
                    <li>Comply with data protection laws in Nigeria</li>
                    <li>Respect customer opt-outs and data deletion requests</li>
                </ul>
            </>
        )
    },
    {
        id: 'rights',
        title: '10. Your Rights',
        content: (
            <>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Access:</strong> Request a copy of your data</li>
                    <li><strong>Correction:</strong> Update inaccurate data</li>
                    <li><strong>Deletion:</strong> Request deletion (subject to legal requirements)</li>
                    <li><strong>Objection:</strong> Object to certain processing activities</li>
                    <li><strong>Portability:</strong> Receive your data in a structured format</li>
                </ul>
                <p className="mt-4">To exercise these rights, contact us at support@vayva.ng</p>
            </>
        )
    },
    {
        id: 'children',
        title: '11. Children\'s Privacy',
        content: (
            <>
                <p>The Service is not intended for individuals under 18 years of age.</p>
                <p>We do not knowingly collect data from children. If you believe we have collected data from a child, please contact us immediately.</p>
            </>
        )
    },
    {
        id: 'changes',
        title: '12. Changes to This Policy',
        content: (
            <>
                <p>We may update this Privacy Policy from time to time. We will notify you of material changes by email or through the Service.</p>
                <p>Your continued use after changes take effect constitutes acceptance of the updated policy.</p>
            </>
        )
    },
];

export default function PrivacyPage() {
    return (
        <MarketingShell>
            <PageHero
                title="Privacy Policy"
                subtitle="How Vayva collects, uses, shares, and protects personal data."
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
