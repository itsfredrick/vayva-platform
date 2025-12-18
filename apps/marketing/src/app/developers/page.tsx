import { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { MagneticButton } from '@/components/MagneticButton';
import { ROUTES } from '@/lib/routes';

export const metadata: Metadata = {
    title: 'Developers | Vayva',
    description: 'Build on top of the Vayva commerce engine.'
};

export default function DevelopersPage() {
    return (
        <MarketingShell>
            <PageHero
                title="Vayva for Developers"
                subtitle="API documentation, SDKs, and developer tools."
            />
            <div className="py-20 text-center">
                <span className="inline-block bg-[#22C55E]/10 text-[#22C55E] px-4 py-2 rounded-full font-bold mb-6">Coming Soon</span>
                <p className="max-w-md mx-auto text-gray-600 mb-8">
                    Public API access will be available in the next release.
                </p>
                <MagneticButton asChild variant="secondary">
                    <a href={ROUTES.home}>Back to Home</a>
                </MagneticButton>
            </div>
        </MarketingShell>
    );
}
