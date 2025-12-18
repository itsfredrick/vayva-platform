import { Metadata } from 'next';
import { PolicyLayout } from '@/components/marketing/PolicyLayout';

export const metadata: Metadata = {
    title: 'Refund Policy | Vayva',
    description: 'Vayva subscription refund policy.'
};

export default function RefundsPage() {
    return (
        <PolicyLayout title="Refund Policy" lastUpdated="December 18, 2025">
            <p>We want you to be satisfied with Vayva. Here is our refund policy for platform subscriptions.</p>

            <h2>1. Subscription Cancellations</h2>
            <p>You can cancel your monthly subscription at any time. Your access will continue until the end of the current billing period.</p>

            <h2>2. Refund Eligibility</h2>
            <p>We generally do not offer refunds for partial months. However, if you believe you were charged in error, please contact support.</p>

            <h2>3. Merchant Refunds to Customers</h2>
            <p>Refunds for orders placed on your store are managed by you. Vayva provides tools to issue refunds via your payment processor, but the policy toward your customers is set by you.</p>
        </PolicyLayout>
    );
}
