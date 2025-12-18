import { Metadata } from 'next';
import { MarketingShell } from '@/components/marketing/MarketingShell';
import { PageHero } from '@/components/marketing/PageHero';
import { Section } from '@/components/marketing/Section';
import { LegalTOC, LegalTOCItem } from '@/components/legal/LegalTOC';
import { LegalContent, LegalSection } from '@/components/legal/LegalContent';

export const metadata: Metadata = {
    title: 'Shipping & Delivery Policy | Vayva',
    description: 'How delivery works for orders placed through Vayva storefronts.'
};

const tocItems: LegalTOCItem[] = [
    { id: 'scope', title: 'Scope' },
    { id: 'delivery-methods', title: 'Delivery Methods' },
    { id: 'fees-timelines', title: 'Fees and Timelines' },
    { id: 'address-accuracy', title: 'Address Accuracy' },
    { id: 'failed-delivery', title: 'Failed Delivery' },
    { id: 'proof', title: 'Proof of Delivery' },
    { id: 'risk', title: 'Risk and Ownership' },
];

const sections: LegalSection[] = [
    {
        id: 'scope',
        title: '1. Scope',
        content: (
            <>
                <p>This policy applies to orders placed via storefronts using Vayva tools.</p>
                <p><strong>Important:</strong> The merchant remains the seller and fulfiller. Vayva provides delivery management tools but is not responsible for fulfillment.</p>
            </>
        )
    },
    {
        id: 'delivery-methods',
        title: '2. Delivery Methods Supported',
        content: (
            <>
                <p>Vayva supports multiple delivery methods:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Self-dispatch:</strong> Merchant uses their own riders</li>
                    <li><strong>Customer pickup:</strong> Customers collect orders from merchant location</li>
                    <li><strong>Partner delivery:</strong> Optional integration with delivery partners (e.g., Kwik)</li>
                </ul>
                <p className="mt-4"><strong>Shipping Labels:</strong> Labels are optional and not required for all deliveries. Many merchants in Nigeria successfully deliver without labels.</p>
            </>
        )
    },
    {
        id: 'fees-timelines',
        title: '3. Delivery Fees and Timelines',
        content: (
            <>
                <p>Merchants set their own delivery fees and estimated delivery timelines.</p>
                <p><strong>Important:</strong> Delivery estimates are not guarantees. Actual delivery times may vary due to:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Traffic conditions</li>
                    <li>Weather</li>
                    <li>Customer availability</li>
                    <li>Rider availability</li>
                    <li>Location accessibility</li>
                </ul>
            </>
        )
    },
    {
        id: 'address-accuracy',
        title: '4. Address Accuracy',
        content: (
            <>
                <p>Customers are responsible for providing accurate delivery addresses and phone numbers.</p>
                <p>Merchants may confirm addresses via WhatsApp before dispatch to reduce failed deliveries.</p>
                <p><strong>Tip:</strong> In Nigeria, landmarks and detailed descriptions are often more helpful than formal addresses.</p>
            </>
        )
    },
    {
        id: 'failed-delivery',
        title: '5. Failed Delivery / Re-delivery',
        content: (
            <>
                <p>Common reasons for failed delivery in Nigeria:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Unreachable phone number</li>
                    <li>Incorrect or incomplete address</li>
                    <li>Customer unavailable</li>
                    <li>Refused delivery</li>
                </ul>
                <p className="mt-4"><strong>Re-delivery:</strong> Merchants may charge additional fees for re-delivery attempts. This should be clearly stated in the merchant's own delivery policy.</p>
            </>
        )
    },
    {
        id: 'proof',
        title: '6. Proof of Delivery',
        content: (
            <>
                <p>Merchants may collect proof of delivery, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Customer confirmation via WhatsApp</li>
                    <li>Signature (if applicable)</li>
                    <li>Photo of delivered package</li>
                </ul>
                <p className="mt-4"><strong>Privacy:</strong> Merchants must handle proof of delivery data responsibly and in compliance with privacy laws.</p>
            </>
        )
    },
    {
        id: 'risk',
        title: '7. Risk and Ownership',
        content: (
            <>
                <p>Risk of loss or damage passes to the customer upon successful delivery confirmation.</p>
                <p>Merchants should clearly state in their own policies when ownership transfers (e.g., upon payment, upon dispatch, or upon delivery).</p>
            </>
        )
    },
];

export default function ShippingDeliveryPage() {
    return (
        <MarketingShell>
            <PageHero
                title="Shipping & Delivery Policy"
                subtitle="How delivery works for orders placed through Vayva storefronts."
                lastUpdated="2025-12-18"
                align="left"
            />

            <Section className="py-12">
                <div className="grid lg:grid-cols-[240px_1fr] gap-12 max-w-6xl mx-auto">
                    <LegalTOC items={tocItems} />
                    <LegalContent sections={sections} />
                </div>
            </Section>
        </MarketingShell>
    );
}
