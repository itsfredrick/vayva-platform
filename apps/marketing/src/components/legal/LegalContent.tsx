import { ReactNode } from 'react';
import { GlassCard } from '@/components/marketing/GlassCard';

export interface LegalSection {
    id: string;
    title: string;
    content: ReactNode;
}

interface LegalContentProps {
    sections: LegalSection[];
    contactEmail?: string;
    contactAddress?: string;
}

export function LegalContent({ sections, contactEmail = 'support@vayva.ng', contactAddress = 'Lagos, Nigeria' }: LegalContentProps) {
    return (
        <div className="space-y-12">
            {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-24">
                    <h2 className="text-xl font-semibold text-[#0B1220] mb-4">{section.title}</h2>
                    <div className="text-sm leading-7 text-[#0B1220]/75 space-y-4">
                        {section.content}
                    </div>
                </section>
            ))}

            {/* Contact Block */}
            <GlassCard className="bg-white/70 mt-12">
                <h3 className="text-lg font-semibold text-[#0B1220] mb-4">Contact</h3>
                <div className="text-sm leading-7 text-[#0B1220]/75 space-y-2">
                    <p>If you have questions about this policy, contact us:</p>
                    <p>
                        <strong>Email:</strong> {contactEmail}
                    </p>
                    <p>
                        <strong>Address:</strong> {contactAddress}
                    </p>
                </div>
            </GlassCard>
        </div>
    );
}
