import { Metadata } from 'next';
import { PolicyLayout } from '@/components/marketing/PolicyLayout';

export const metadata: Metadata = {
    title: 'Terms of Service | Vayva',
    description: 'Terms and conditions for using the Vayva platform.'
};

export default function TermsPage() {
    return (
        <PolicyLayout title="Terms of Service" lastUpdated="December 18, 2025">
            <p>Welcome to Vayva. By accessing or using our platform, you agree to be bound by these Terms of Service.</p>

            <h2>1. Account Registration</h2>
            <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account credentials.</p>

            <h2>2. Permitted Use</h2>
            <p>You agree to use Vayva only for lawful business purposes. You may not use the platform to sell illegal or prohibited goods.</p>

            <h2>3. Payment Services</h2>
            <p>Vayva integrates with third-party payment processors (e.g., Paystack). We do not store your customers' full credit card information.</p>

            <h2>4. Delivery Services</h2>
            <p>You may use our partner delivery services or manage your own fleet. Vayva is not responsible for the physical delivery of goods unless explicitly stated in a managed service agreement.</p>

            <h2>5. Termination</h2>
            <p>We reserve the right to suspend or terminate your account if you violate these terms.</p>
        </PolicyLayout>
    );
}
