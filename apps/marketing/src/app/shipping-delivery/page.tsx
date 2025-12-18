import { Metadata } from 'next';
import { PolicyLayout } from '@/components/marketing/PolicyLayout';

export const metadata: Metadata = {
    title: 'Shipping & Delivery | Vayva',
    description: 'Information about Vayva delivery services and merchant shipping.'
};

export default function ShippingPage() {
    return (
        <PolicyLayout title="Shipping & Delivery" lastUpdated="December 18, 2025">
            <p>Vayva helps merchants manage delivery, but we are not a logistics company ourselves.</p>

            <h2>1. Vayva's Role</h2>
            <p>Vayva provides software to connect merchants with delivery partners (like Kwik) or manage their own fleet. We do not physically handle packages.</p>

            <h2>2. Partner Deliveries</h2>
            <p>If you use a partner integration, the partner's terms of service apply to the delivery execution.</p>

            <h2>3. Merchant Responsibilities</h2>
            <p>You are responsible for packaging items securely and providing accurate pickup/delivery details.</p>
        </PolicyLayout>
    );
}
