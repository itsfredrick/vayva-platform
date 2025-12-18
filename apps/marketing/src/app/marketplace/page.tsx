import { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { MagneticButton } from '@/components/MagneticButton';
import { ROUTES } from '@/lib/routes';

export const metadata: Metadata = {
    title: 'Marketplace | Vayva',
    description: 'Connect with partners, delivery fleets, and marketing agencies.'
};

export default function MarketplacePage() {
    return (
        <MarketingShell>
            <PageHero
                title="App Marketplace"
                subtitle="Extensions and integrations for your Vayva store."
            />
            <div className="py-20 text-center">
                <span className="inline-block bg-[#22C55E]/10 text-[#22C55E] px-4 py-2 rounded-full font-bold mb-6">Coming Soon</span>
                <p className="max-w-md mx-auto text-gray-600 mb-8">
                    The extension marketplace is under development.
                </p>
                <MagneticButton asChild variant="secondary">
                    <a href={ROUTES.home}>Back to Home</a>
                </MagneticButton>
            </div>
        </MarketingShell>
    );
}
