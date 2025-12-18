import { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { Section } from '@/components/marketing/Section';
import { LegalTOC, LegalTOCItem } from '@/components/legal/LegalTOC';
import { LegalContent, LegalSection } from '@/components/legal/LegalContent';

export const metadata: Metadata = {
    title: 'Acceptable Use Policy | Vayva',
    description: 'Rules for using Vayva safely and lawfully.'
};

const tocItems: LegalTOCItem[] = [
    { id: 'prohibited-content', title: 'Prohibited Content' },
    { id: 'prohibited-behavior', title: 'Prohibited Behavior' },
    { id: 'whatsapp-rules', title: 'WhatsApp Messaging Rules' },
    { id: 'rate-limits', title: 'Rate Limits' },
    { id: 'enforcement', title: 'Enforcement' },
];

const sections: LegalSection[] = [
    {
        id: 'prohibited-content',
        title: '1. Prohibited Content',
        content: (
            <>
                <p>You may not use Vayva to sell or promote:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Illegal goods or services</li>
                    <li>Counterfeit or stolen goods</li>
                    <li>Weapons, explosives, or hazardous materials</li>
                    <li>Drugs or controlled substances</li>
                    <li>Adult content or services</li>
                    <li>Hate speech or discriminatory content</li>
                    <li>Content that infringes intellectual property rights</li>
                    <li>Misleading or deceptive products</li>
                </ul>
            </>
        )
    },
    {
        id: 'prohibited-behavior',
        title: '2. Prohibited Behavior',
        content: (
            <>
                <p>You may not:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Engage in fraud, phishing, or scams</li>
                    <li>Send spam or unsolicited messages</li>
                    <li>Harass, threaten, or abuse others</li>
                    <li>Distribute malware or viruses</li>
                    <li>Scrape or harvest data without permission</li>
                    <li>Attempt to bypass security measures</li>
                    <li>Impersonate others or misrepresent your identity</li>
                    <li>Interfere with the Service or other users</li>
                </ul>
            </>
        )
    },
    {
        id: 'whatsapp-rules',
        title: '3. WhatsApp Messaging Rules',
        content: (
            <>
                <p><strong>Consent Required:</strong> You may only message customers who have explicitly consented to receive messages from you.</p>
                <p><strong>Respect Opt-Outs:</strong> If a customer asks to stop receiving messages, you must honor their request immediately.</p>
                <p><strong>WhatsApp Business Policy:</strong> You must comply with WhatsApp's Business Policy and Commerce Policy.</p>
                <p className="mt-4"><strong>Prohibited:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Sending spam or bulk unsolicited messages</li>
                    <li>Using automated messaging without proper consent</li>
                    <li>Sharing misleading information</li>
                    <li>Violating WhatsApp's terms of service</li>
                </ul>
            </>
        )
    },
    {
        id: 'rate-limits',
        title: '4. Rate Limits and Abuse Prevention',
        content: (
            <>
                <p>To ensure fair use and prevent abuse, we may implement:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Rate limits on API calls</li>
                    <li>Limits on message volume</li>
                    <li>Restrictions on automated activity</li>
                    <li>Throttling of excessive requests</li>
                </ul>
                <p className="mt-4">If you need higher limits for legitimate business purposes, contact us to discuss your needs.</p>
            </>
        )
    },
    {
        id: 'enforcement',
        title: '5. Enforcement',
        content: (
            <>
                <p>Violations of this Acceptable Use Policy may result in:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Warning:</strong> First-time or minor violations</li>
                    <li><strong>Suspension:</strong> Temporary account suspension pending investigation</li>
                    <li><strong>Termination:</strong> Permanent account closure for serious or repeated violations</li>
                    <li><strong>Legal Action:</strong> We may report illegal activity to law enforcement</li>
                </ul>
                <p className="mt-4">We reserve the right to take action at our discretion to protect the Service and other users.</p>
            </>
        )
    },
];

export default function AcceptableUsePage() {
    return (
        <MarketingShell>
            <PageHero
                title="Acceptable Use Policy"
                subtitle="Rules for using Vayva safely and lawfully."
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
