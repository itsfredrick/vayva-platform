import { Metadata } from 'next';
import { PolicyLayout } from '@/components/marketing/PolicyLayout';

export const metadata: Metadata = {
    title: 'Privacy Policy | Vayva',
    description: 'How Vayva collects, uses, and protects your data.'
};

export default function PrivacyPage() {
    return (
        <PolicyLayout title="Privacy Policy" lastUpdated="December 18, 2025">
            <p>Your privacy is important to us. This policy explains how we handle your data.</p>

            <h2>1. Information We Collect</h2>
            <p>We collect information you provide directly, such as your name, email address, and store details. We also collect data about your usage of the platform.</p>

            <h2>2. How We Use Your Information</h2>
            <p>We use your information to provide and improve our services, process payments, and communicate with you.</p>

            <h2>3. Data Sharing</h2>
            <p>We do not sell your personal data. We may share data with trusted third-party service providers (like payment processors) solely to provide our services.</p>

            <h2>4. Security</h2>
            <p>We implement industry-standard security measures to protect your data.</p>
        </PolicyLayout>
    );
}
