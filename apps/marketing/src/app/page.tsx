import Script from 'next/script';
import Link from 'next/link';
import { HeroPhysicsBackground } from '@/components/HeroPhysicsBackground';
import { MagneticButton } from '@/components/MagneticButton';
import { TiltCard } from '@/components/TiltCard';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { Section } from '@/components/marketing/Section';
import { GlassCard } from '@/components/marketing/GlassCard';
import { generateFAQSchema, generateOrganizationSchema, generateWebSiteSchema } from '@/lib/schema';
import { PLANS, formatNGN } from '@/config/pricing';
import { ROUTES } from '@/lib/routes';

const faqs = [
    { question: 'Can I use my own dispatch rider?', answer: 'Yes. Self-dispatch is built-in. Assign a rider, update status, and send tracking on WhatsApp.' },
    { question: 'Do I need shipping labels?', answer: 'No. Labels are optional. If a carrier supports labels, you can generate them — otherwise you can run delivery without labels.' },
    { question: 'Can I do Pay on Delivery (COD)?', answer: 'Yes. You can support COD and manual payment marking, with clear audit logs for every transaction.' },
    { question: 'What do customers see after payment?', answer: 'A professional order confirmation page with a live tracking link they can open anytime.' },
    { question: 'Can I switch templates without losing products?', answer: 'Yes. Your product catalog and settings are safe. Switch templates instantly to refresh your store.' },
    { question: 'Does this work outside Lagos?', answer: 'Yes. You can configure delivery zones across all of Nigeria by state and city.' }
];

const features = [
    { title: 'WhatsApp Inbox that closes sales', desc: 'Reply, send checkout links, and track every conversation.' },
    { title: 'Payments you can reconcile', desc: 'Instant confirmations, refunds with approvals, and clean records.' },
    { title: 'Delivery that fits Nigeria', desc: 'Self-dispatch, pickup, or partner delivery—with tracking.' },
    { title: 'Catalog + inventory', desc: 'Variants, stock alerts, and easy updates.' },
    { title: 'Template Gallery', desc: 'Start with the Vayva default. Switch anytime.' },
    { title: 'Reports + Health Score', desc: 'Spot what’s leaking revenue and fix it quickly.' }
];

export default function Home() {
    return (
        <MarketingShell className="max-w-none px-0 pb-0" animate={false}>
            <Script
                id="schema-org"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationSchema()) }}
            />
            <Script
                id="schema-website"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebSiteSchema()) }}
            />
            <Script
                id="schema-faq"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faqs)) }}
            />

            <a href="#main" className="skip-to-content">Skip to content</a>

            <div id="main">
                {/* HERO */}
                <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
                    <HeroPhysicsBackground />
                    <div className="relative z-10 max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-[#0B1220]">
                            Sell on WhatsApp.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] to-[#16A34A]">
                                Deliver like a real business.
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#0B1220]/70 max-w-2xl mx-auto mb-8 font-medium">
                            Vayva turns chats into orders, payments, and delivery updates—built for how Nigeria actually buys. Start with a premium storefront template, then automate the rest.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                            <MagneticButton asChild variant="primary">
                                <Link href={ROUTES.signup} className="text-lg px-8 py-4">Get Started</Link>
                            </MagneticButton>
                            <MagneticButton asChild variant="secondary">
                                <Link href="#templates" className="px-6 py-3">Explore Templates</Link>
                            </MagneticButton>
                        </div>
                        <p className="text-sm text-[#0B1220]/50 font-medium">Self-dispatch ready • Kwik delivery partner optional • NGN-first</p>

                        <ul className="mt-8 space-y-3 text-sm text-[#0B1220]/70 text-left max-w-md mx-auto">
                            {[
                                "Send clean checkout links in WhatsApp—stop losing orders in DMs",
                                "Confirm payments instantly and keep every order tracked",
                                "Share delivery updates customers actually follow",
                            ].map((t) => (
                                <li key={t} className="flex items-start gap-3">
                                    <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#22C55E]/15 ring-1 ring-[#22C55E]/25">
                                        <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                                    </span>
                                    <span>{t}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* SOCIAL PROOF */}
                <Section>
                    <h2 className="text-3xl font-bold text-center mb-12 text-[#0B1220]">Built for WhatsApp-first commerce</h2>
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {['Checkout links that look trustworthy', 'Order timeline for every customer', 'Delivery updates without chaos'].map((item, i) => (
                            <GlassCard key={i} className="text-center bg-white/70">
                                <p className="font-medium text-[#0B1220]">{item}</p>
                            </GlassCard>
                        ))}
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <TiltCard className="p-6">
                            <p className="text-gray-600 mb-4">"We stopped chasing screenshots—orders are now properly tracked."</p>
                            <p className="text-sm font-medium">— Merchant, Lagos</p>
                        </TiltCard>
                        <TiltCard className="p-6">
                            <p className="text-gray-600 mb-4">"Customers pay faster when the link looks clean and official."</p>
                            <p className="text-sm font-medium">— Merchant, Abuja</p>
                        </TiltCard>
                    </div>
                </Section>

                {/* NIGERIA REALITY */}
                <Section className="bg-white/50" fullWidth>
                    <div className="max-w-6xl mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Designed for real-world delivery and payment behavior</h2>
                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#22C55E] text-xl">✓</span>
                                        <div>
                                            <h4 className="font-bold text-[#0B1220]">Self-dispatch workflow</h4>
                                            <p className="text-gray-600">Built for merchants with their own riders.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#22C55E] text-xl">✓</span>
                                        <div>
                                            <h4 className="font-bold text-[#0B1220]">Optional shipping labels</h4>
                                            <p className="text-gray-600">Only generate them if your carrier supports it.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-[#22C55E] text-xl">✓</span>
                                        <div>
                                            <h4 className="font-bold text-[#0B1220]">COD-friendly</h4>
                                            <p className="text-gray-600">Operations with clear status updates for Pay on Delivery.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="bg-white p-8 rounded-3xl border border-slate-900/10 shadow-sm max-w-sm text-center">
                                    <p className="text-lg font-medium text-[#0B1220] mb-2">Reduce failed deliveries</p>
                                    <p className="text-gray-500">By setting confirmation steps and clear tracking updates customers actually read.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* FEATURES */}
                <Section id="features">
                    <h2 className="text-3xl font-bold text-center mb-12">Everything you need to sell faster</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <TiltCard key={i} className="p-6">
                                <h3 className="font-semibold mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-600">{feature.desc}</p>
                            </TiltCard>
                        ))}
                    </div>
                </Section>

                {/* HOW IT WORKS */}
                <Section className="bg-white/50" fullWidth>
                    <div className="max-w-4xl mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Go live in under an hour</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { step: 1, title: 'Choose a template', desc: 'Pick the Vayva default or choose from the gallery.' },
                                { step: 2, title: 'Add products + delivery rules', desc: 'Set zones, fees, and dispatch method—self or partner.' },
                                { step: 3, title: 'Sell on WhatsApp', desc: 'Share links, get paid, and keep everything tracked.' }
                            ].map((item) => (
                                <div key={item.step} className="text-center">
                                    <div className="w-12 h-12 rounded-full bg-[#22C55E] text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">{item.step}</div>
                                    <h3 className="font-semibold mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-600">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Section>

                {/* TEMPLATES */}
                <Section id="templates">
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-4">Start with a storefront that looks expensive</h2>
                        <p className="text-gray-600 mb-8">Default Vayva template included. Switch to any other template from the gallery anytime.</p>
                        <MagneticButton asChild className="btn-primary">
                            <Link href={ROUTES.templates}>Explore Templates</Link>
                        </MagneticButton>
                    </div>
                </Section>

                {/* PAYMENTS + DELIVERY */}
                <Section className="bg-white/50" fullWidth>
                    <div className="max-w-4xl mx-auto text-center px-4">
                        <h2 className="text-3xl font-bold mb-4">Payments and delivery that don't break under pressure</h2>
                        <p className="text-gray-600 mb-8">Customers trust clean checkout links. You get confirmations, refunds (approval-gated), and delivery status updates.</p>
                        <ul className="flex flex-wrap justify-center gap-6 text-sm">
                            <li className="flex items-center gap-2"><span className="text-[#22C55E]">✓</span> NGN-first pricing</li>
                            <li className="flex items-center gap-2"><span className="text-[#22C55E]">✓</span> Self-dispatch ready</li>
                            <li className="flex items-center gap-2"><span className="text-[#22C55E]">✓</span> Tracking links customers actually use</li>
                        </ul>
                        <p className="text-xs text-gray-400 mt-4">Carrier labels optional — only show if available.</p>
                    </div>
                </Section>

                {/* PRICING */}
                <Section>
                    <h2 className="text-3xl font-bold text-center mb-4">Simple pricing in NGN</h2>
                    <p className="text-center text-gray-600 mb-12">Switch plans anytime. Start on the default template and upgrade when ready.</p>
                    <div className="grid md:grid-cols-3 gap-6">
                        {PLANS.map((plan, i) => (
                            <TiltCard key={i} className="p-6">
                                <h3 className="font-bold text-xl mb-2">{plan.name}</h3>
                                <p className="text-3xl font-bold text-gradient mb-4">
                                    {plan.monthlyAmount === 0 ? "Free" : formatNGN(plan.monthlyAmount)}
                                    {plan.monthlyAmount > 0 && <span className="text-sm font-normal text-gray-500">/mo</span>}
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                                    {plan.bullets.map((f, j) => <li key={j}>✓ {f}</li>)}
                                </ul>
                            </TiltCard>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <MagneticButton asChild variant="secondary">
                            <Link href={ROUTES.pricing}>View Pricing</Link>
                        </MagneticButton>
                    </div>
                </Section>

                {/* FAQS */}
                <Section id="faqs" className="bg-white/50" fullWidth>
                    <div className="max-w-3xl mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">FAQs</h2>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <details key={i} className="glass-surface p-6 group rounded-2xl bg-white/70 border border-slate-900/10">
                                    <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
                                        {faq.question}
                                        <span className="text-[#22C55E] group-open:rotate-45 transition-transform">+</span>
                                    </summary>
                                    <p className="mt-4 text-gray-600">{faq.answer}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </Section>

                {/* FINAL CTA */}
                <Section>
                    <div className="text-center max-w-4xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Turn WhatsApp into your storefront—today.</h2>
                        <p className="text-gray-600 mb-8">Get started with the default Vayva template. Switch designs anytime. Sell with confidence.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <MagneticButton asChild variant="primary">
                                <Link href={ROUTES.signup} className="text-lg px-8 py-4">Get Started</Link>
                            </MagneticButton>
                        </div>
                    </div>
                </Section>
            </div>
        </MarketingShell>
    );
}
