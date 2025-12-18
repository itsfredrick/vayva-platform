import { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { Section } from '@/components/marketing/Section';
import { MagneticButton } from '@/components/MagneticButton';
import { ROUTES } from '@/lib/routes';

export const metadata: Metadata = {
    title: 'Book a Demo | Vayva',
    description: 'See Vayva in action with a personalized walkthrough.'
};

export default function DemoPage() {
    return (
        <MarketingShell>
            <PageHero
                title="See Vayva in action"
                subtitle="Schedule a 15-minute walkthrough with our team to see how we can fail-proof your WhatsApp commerce."
            />

            <Section>
                <div className="max-w-2xl mx-auto text-center bg-white/70 backdrop-blur-xl border border-slate-900/10 rounded-3xl p-12">
                    <p className="text-xl text-[#0B1220] mb-8 font-medium">
                        Our calendar is currently open for early access merchants.
                    </p>
                    <MagneticButton asChild variant="primary">
                        <a href="mailto:demo@vayva.ng?subject=Requesting Demo Access" className="text-lg px-8 py-4">
                            Request Demo Access
                        </a>
                    </MagneticButton>
                    <p className="mt-6 text-sm text-gray-500">
                        Or create a free account and explore yourself.
                    </p>
                    <div className="mt-4">
                        <MagneticButton asChild variant="ghost">
                            <a href={ROUTES.signup}>Get Started &rarr;</a>
                        </MagneticButton>
                    </div>
                </div>
            </Section>
        </MarketingShell>
    );
}
