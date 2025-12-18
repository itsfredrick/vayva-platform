import { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { Section } from '@/components/marketing/Section';
import { LegalTOC, LegalTOCItem } from '@/components/legal/LegalTOC';
import { LegalContent, LegalSection } from '@/components/legal/LegalContent';

export const metadata: Metadata = {
    title: 'Security | Vayva',
    description: 'How Vayva protects accounts and data.'
};

const tocItems: LegalTOCItem[] = [
    { id: 'account-security', title: 'Account Security' },
    { id: 'encryption', title: 'Encryption' },
    { id: 'access-controls', title: 'Access Controls' },
    { id: 'logging', title: 'Logging and Monitoring' },
    { id: 'vulnerability', title: 'Vulnerability Reporting' },
    { id: 'incident', title: 'Incident Response' },
    { id: 'merchant-responsibilities', title: 'Merchant Responsibilities' },
];

const sections: LegalSection[] = [
    {
        id: 'account-security',
        title: '1. Account Security Tips',
        content: (
            <>
                <p>Protect your account by:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Using a strong, unique password</li>
                    <li>Enabling two-factor authentication (2FA) if available</li>
                    <li>Not sharing your credentials</li>
                    <li>Logging out on shared devices</li>
                    <li>Monitoring account activity regularly</li>
                </ul>
            </>
        )
    },
    {
        id: 'encryption',
        title: '2. Encryption in Transit',
        content: (
            <>
                <p>All data transmitted between your browser and Vayva servers is encrypted using HTTPS/TLS protocols.</p>
                <p>This protects your data from interception during transmission.</p>
            </>
        )
    },
    {
        id: 'access-controls',
        title: '3. Access Controls',
        content: (
            <>
                <p>We implement strict access controls:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Role-based access for team members</li>
                    <li>Multi-factor authentication for administrative access</li>
                    <li>Regular access reviews</li>
                    <li>Principle of least privilege</li>
                </ul>
            </>
        )
    },
    {
        id: 'logging',
        title: '4. Logging and Monitoring',
        content: (
            <>
                <p>We maintain logs of system activity to:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Detect suspicious activity</li>
                    <li>Investigate security incidents</li>
                    <li>Comply with legal requirements</li>
                    <li>Improve security measures</li>
                </ul>
            </>
        )
    },
    {
        id: 'vulnerability',
        title: '5. Vulnerability Reporting',
        content: (
            <>
                <p>If you discover a security vulnerability, please report it responsibly:</p>
                <p><strong>Email:</strong> security@vayva.ng</p>
                <p className="mt-4">Please do not publicly disclose vulnerabilities until we have had a chance to address them.</p>
                <p>We appreciate responsible disclosure and will work with you to resolve issues promptly.</p>
            </>
        )
    },
    {
        id: 'incident',
        title: '6. Incident Response',
        content: (
            <>
                <p>In the event of a security incident:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>We will investigate and contain the incident</li>
                    <li>Affected users will be notified as required by law</li>
                    <li>We will take steps to prevent recurrence</li>
                    <li>We will cooperate with law enforcement if necessary</li>
                </ul>
            </>
        )
    },
    {
        id: 'merchant-responsibilities',
        title: '7. Merchant Responsibilities',
        content: (
            <>
                <p>As a merchant, you are responsible for:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Keeping your password secure</li>
                    <li>Managing team member access appropriately</li>
                    <li>Reporting suspicious activity immediately</li>
                    <li>Educating your team about security best practices</li>
                    <li>Complying with security requirements in these Terms</li>
                </ul>
            </>
        )
    },
];

export default function SecurityPage() {
    return (
        <MarketingShell>
            <PageHero
                title="Security"
                subtitle="How Vayva protects accounts and data."
                lastUpdated="2025-12-18"
                align="left"
            />

            <Section className="py-12">
                <div className="grid lg:grid-cols-[240px_1fr] gap-12 max-w-6xl mx-auto">
                    <LegalTOC items={tocItems} />
                    <LegalContent sections={sections} contactEmail="security@vayva.ng" />
                </div>
            </Section>
        </MarketingShell>
    );
}
