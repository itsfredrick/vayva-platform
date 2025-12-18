import { ReactNode } from 'react';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { Section } from '@/components/marketing/Section';

interface PolicyLayoutProps {
    title: string;
    lastUpdated: string;
    children: ReactNode;
}

export function PolicyLayout({ title, lastUpdated, children }: PolicyLayoutProps) {
    return (
        <MarketingShell>
            <PageHero
                title={title}
                subtitle={`Last Updated: ${lastUpdated}`}
                align="left"
            />
            <Section className="py-0">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Fixed Table of Contents Sidebar (Desktop) would go here if implemented */}
                    {/* For now, just the main content column */}
                    <div className="w-full max-w-3xl prose prose-lg prose-headings:text-[#0B1220] prose-p:text-gray-600 prose-a:text-[#22C55E] prose-li:text-gray-600 marker:text-[#22C55E]">
                        {children}
                    </div>
                </div>
            </Section>
        </MarketingShell>
    );
}
