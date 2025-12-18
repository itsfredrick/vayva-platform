import React from 'react';
import { Hero } from '@/components/sections/home/hero';
import { FeaturesGrid } from '@/components/sections/home/features-grid';
import { MarketplacePreview } from '@/components/sections/home/marketplace-preview';
import { HowItWorks } from '@/components/sections/home/how-it-works';
import { PricingHome } from '@/components/sections/home/pricing-home';
import { TrustAndFAQ } from '@/components/sections/home/trust-faq';

export default function HomePage() {
    return (
        <>
            <Hero />
            <FeaturesGrid />
            <MarketplacePreview />
            <HowItWorks />
            <PricingHome />
            <TrustAndFAQ />
        </>
    );
}
