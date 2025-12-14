import type { Metadata } from 'next';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';
import { MarketingShell } from '@/components/marketing/marketing-shell';

export const metadata: Metadata = {
    title: 'Vayva | Sell online in Nigeria',
    description: 'The all-in-one commerce platform for African merchants. Build your store, sell on WhatsApp, and manage deliveries.',
};

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MarketingShell>
            <MarketingHeader />
            <main className="pt-20">
                {children}
            </main>
            <MarketingFooter />
        </MarketingShell>
    );
}
