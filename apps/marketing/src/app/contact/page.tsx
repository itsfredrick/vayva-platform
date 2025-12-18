import { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { Section } from '@/components/marketing/Section';
import { GlassCard } from '@/components/marketing/GlassCard';
import { MagneticButton } from '@/components/MagneticButton';
import { ROUTES } from '@/lib/routes'; // Ensure ROUTES is imported if used (e.g. for demo link)

export const metadata: Metadata = {
    title: 'Contact Us | Vayva',
    description: 'Get in touch with the Vayva team for sales, support, or partnership inquiries.'
};

export default function ContactPage() {
    return (
        <MarketingShell>
            <PageHero
                title="Talk to the Vayva team"
                subtitle="Questions about setup, delivery options, or migrating from Instagram/WhatsApp selling? Send a message."
            />

            <Section>
                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">

                    {/* Contact Info */}
                    <div className="space-y-8 py-8">
                        <div>
                            <h3 className="font-bold text-xl mb-4 text-[#0B1220]">Office</h3>
                            <p className="text-gray-600">Lagos, Nigeria</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-xl mb-4 text-[#0B1220]">Email</h3>
                            <p className="text-gray-600 mb-2">Support: support@vayva.ng</p>
                            <p className="text-gray-600">Sales: sales@vayva.ng</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <GlassCard className="bg-white/80">
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/50 focus:border-[#22C55E] transition-all bg-white/50"
                                    placeholder="Your full name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Work Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/50 focus:border-[#22C55E] transition-all bg-white/50"
                                    placeholder="you@company.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/50 focus:border-[#22C55E] transition-all bg-white/50 resize-none"
                                    placeholder="How can we help?"
                                />
                            </div>
                            <MagneticButton className="w-full btn-primary font-bold">
                                Send message
                            </MagneticButton>
                            <p className="text-center text-xs text-gray-500 mt-3">We typically reply within 1 business day.</p>
                        </form>
                    </GlassCard>

                </div>
            </Section>
        </MarketingShell>
    );
}
