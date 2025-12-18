import { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { Section } from '@/components/marketing/Section';
import { LegalTOC, LegalTOCItem } from '@/components/legal/LegalTOC';
import { LegalContent, LegalSection } from '@/components/legal/LegalContent';

export const metadata: Metadata = {
    title: 'Cookies Policy | Vayva',
    description: 'How cookies and similar technologies are used on Vayva.'
};

const tocItems: LegalTOCItem[] = [
    { id: 'what-are-cookies', title: 'What Are Cookies' },
    { id: 'types', title: 'Types of Cookies' },
    { id: 'usage', title: 'What We Use Them For' },
    { id: 'managing', title: 'Managing Cookies' },
    { id: 'third-party', title: 'Third-Party Cookies' },
    { id: 'changes', title: 'Changes' },
];

const sections: LegalSection[] = [
    {
        id: 'what-are-cookies',
        title: '1. What Are Cookies',
        content: (
            <>
                <p>Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your experience.</p>
            </>
        )
    },
    {
        id: 'types',
        title: '2. Types of Cookies We Use',
        content: (
            <>
                <p><strong>Essential Cookies:</strong> Required for the Service to function. These cannot be disabled.</p>
                <p><strong>Analytics Cookies:</strong> Help us understand how you use the Service so we can improve it.</p>
                <p><strong>Functional Cookies:</strong> Remember your preferences and settings.</p>
                <p><strong>Marketing Cookies:</strong> Used to deliver relevant ads (if applicable).</p>
            </>
        )
    },
    {
        id: 'usage',
        title: '3. What We Use Them For',
        content: (
            <ul className="list-disc pl-6 space-y-2">
                <li>Keep you logged in</li>
                <li>Remember your preferences</li>
                <li>Analyze site traffic and usage patterns</li>
                <li>Improve security and prevent fraud</li>
                <li>Deliver personalized content</li>
            </ul>
        )
    },
    {
        id: 'managing',
        title: '4. Managing Cookies',
        content: (
            <>
                <p>You can control cookies through your browser settings. Most browsers allow you to:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>View and delete cookies</li>
                    <li>Block all cookies</li>
                    <li>Block third-party cookies</li>
                    <li>Clear cookies when you close your browser</li>
                </ul>
                <p className="mt-4"><strong>Note:</strong> Disabling essential cookies may affect the functionality of the Service.</p>
            </>
        )
    },
    {
        id: 'third-party',
        title: '5. Third-Party Cookies',
        content: (
            <>
                <p>Some cookies are placed by third-party services we use, such as:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Analytics providers (e.g., Google Analytics)</li>
                    <li>Payment processors</li>
                    <li>Social media platforms</li>
                </ul>
                <p className="mt-4">These third parties have their own privacy policies.</p>
            </>
        )
    },
    {
        id: 'changes',
        title: '6. Changes to This Policy',
        content: (
            <>
                <p>We may update this Cookies Policy from time to time. Changes will be posted on this page with an updated "Last updated" date.</p>
            </>
        )
    },
];

export default function CookiesPage() {
    return (
        <MarketingShell>
            <PageHero
                title="Cookies Policy"
                subtitle="How cookies and similar technologies are used on Vayva."
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
