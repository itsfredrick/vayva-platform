import { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { MagneticButton } from '@/components/MagneticButton';
import { ROUTES } from '@/lib/routes';

export const metadata: Metadata = {
    title: 'Store Directory | Vayva',
    description: 'Discover popular stores built on Vayva.'
};

export default function StoresPage() {
    return (
        <MarketingShell>
            <PageHero
                title="Store Directory"
                subtitle="Browse thousands of products from verified Vayva merchants."
            />
            <div className="py-20 text-center">
                <span className="inline-block bg-[#22C55E]/10 text-[#22C55E] px-4 py-2 rounded-full font-bold mb-6">Coming Soon</span>
                <p className="max-w-md mx-auto text-gray-600 mb-8">
                    We are currently onboarding our first batch of merchants. The public directory will launch in Q1 2026.
                </p>
                <MagneticButton asChild variant="secondary">
                    <a href={ROUTES.home}>Back to Home</a>
                </MagneticButton>
            </div>
        </MarketingShell>
    );
}
