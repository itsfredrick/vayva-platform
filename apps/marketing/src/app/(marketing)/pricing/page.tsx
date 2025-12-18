import React from 'react';
import { PricingHome } from '@/components/sections/home/pricing-home';
import { TrustAndFAQ } from '@/components/sections/home/trust-faq';

export default function PricingPage() {
    return (
        <div className="pt-20">
            <PricingHome />
            <TrustAndFAQ />
        </div>
    );
}
