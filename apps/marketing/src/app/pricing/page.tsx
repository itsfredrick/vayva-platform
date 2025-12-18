import Link from 'next/link';
import { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { Section } from '@/components/marketing/Section';
import { TiltCard } from '@/components/TiltCard';
import { MagneticButton } from '@/components/MagneticButton';
import { GlassCard } from '@/components/marketing/GlassCard';
import { PLANS, formatNGN } from '@/config/pricing';
import { ROUTES } from '@/lib/routes';

export const metadata: Metadata = {
    title: 'Pricing | Vayva',
    description: 'Simple, transparent pricing for growing businesses in Nigeria.'
};

export default function PricingPage() {
    return (
        <MarketingShell>
            <PageHero
                title="Pricing that grows with your store"
                subtitle="Clear NGN pricing. No confusing tiers."
            />

            <Section>
                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {PLANS.map((plan) => (
                        <TiltCard
                            key={plan.key}
                            className={`p-8 h-full flex flex-col ${plan.featured ? 'border-[#22C55E]/50 ring-2 ring-[#22C55E]/20' : ''}`}
                        >
                            {plan.featured && (
                                <div className="mb-4">
                                    <span className="bg-[#22C55E]/10 text-[#22C55E] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <h3 className="font-bold text-2xl mb-1 text-[#0B1220]">{plan.name}</h3>
                            {plan.tagline && <p className="text-sm text-gray-500 mb-2">{plan.tagline}</p>}
                            <div className="mb-6">
                                <span className="text-4xl font-bold tracking-tight text-[#0B1220]">
                                    {plan.monthlyAmount === 0 ? "Free" : formatNGN(plan.monthlyAmount)}
                                </span>
                                {plan.monthlyAmount > 0 && (
                                    <span className="text-gray-500 font-medium ml-1">/mo</span>
                                )}
                            </div>

                            <ul className="space-y-4 mb-8 flex-grow">
                                {plan.bullets.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E] text-xs">✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <MagneticButton
                                asChild
                                variant={plan.featured ? "primary" : "secondary"}
                                className="w-full"
                            >
                                <Link href={ROUTES.signup + `?plan=${plan.key}`}>
                                    {plan.ctaLabel}
                                </Link>
                            </MagneticButton>
                        </TiltCard>
                    ))}
                </div>
            </Section>

            <Section className="py-12">
                <GlassCard className="text-center max-w-2xl mx-auto">
                    <h3 className="font-bold text-xl mb-4 text-[#0B1220]">Need a custom enterprise plan?</h3>
                    <p className="text-gray-600 mb-6">For large organizations with multiple stores and advanced API needs.</p>
                    <a
                        href={`mailto:sales@vayva.ng`}
                        className="text-[#22C55E] font-medium hover:underline decoration-2 underline-offset-4"
                    >
                        Contact Sales &rarr;
                    </a>
                </GlassCard>
            </Section>

            <Section id="faq">
                <h2 className="text-2xl font-bold text-center mb-12 text-[#0B1220]">Frequently Asked Questions</h2>
                <div className="max-w-3xl mx-auto space-y-4">
                    {[
                        { q: "Do you charge commission on sales?", a: "No. We charge a flat monthly fee. You keep 100% of your sales revenue (minus standard payment gateway fees from Paystack/Stripe)." },
                        { q: "Can I cancel anytime?", a: "Yes. There are no long-term contracts. You can cancel your subscription at any time from your dashboard." },
                        { q: "Is the domain included?", a: "You get a free vayva.shop subdomain (e.g., yourbrand.vayva.shop). You can also connect your own custom domain on the Growth and Pro plans." },
                    ].map((faq, i) => (
                        <details key={i} className="group glass-surface p-6 rounded-2xl bg-white/60 border border-slate-900/5">
                            <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-[#0B1220]">
                                {faq.q}
                                <span className="text-[#22C55E] group-open:rotate-45 transition-transform">+</span>
                            </summary>
                            <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
                        </details>
                    ))}
                </div>
            </Section>
        </MarketingShell>
    );
}
