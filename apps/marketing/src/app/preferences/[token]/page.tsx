import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

// We need to use a client component for the form interaction logic
// forcing dynamic rendering
export const dynamic = 'force-dynamic';

interface PreferenceState {
    phoneMasked: string;
    marketingOptIn: boolean;
    transactionalAllowed: boolean;
    fullyBlocked: boolean;
}

export default async function PreferencePage({ params }: { params: { token: string } }) {
    // In a real app, we might fetch initial state server-side here to SEO/Render fast.
    // Fetching from our own API (localhost)
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

    let initialState: PreferenceState | null = null;
    let error = false;

    try {
        const res = await fetch(`${protocol}://${host}/api/preferences/${params.token}`, {
            cache: 'no-store'
        });
        if (res.ok) {
            initialState = await res.json();
        } else {
            error = true;
        }
    } catch (e) {
        error = true;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-sm border p-8 text-center">
                    <h1 className="text-xl font-semibold mb-2">Link Expired</h1>
                    <p className="text-gray-600 mb-6">
                        This preference link is invalid or has expired. Please request a new one from the store or support.
                    </p>
                </div>
            </div>
        );
    }

    if (!initialState) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="px-6 py-8 border-b border-gray-100">
                    <h1 className="text-xl font-semibold text-gray-900">Communication Preferences</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your WhatsApp settings for {initialState.phoneMasked}
                    </p>
                </div>

                <PreferenceForm token={params.token} initialState={initialState} />

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400">
                    Powered by Vayva • Secure & Private
                </div>
            </div>
        </div>
    );
}

import PreferenceForm from './form';

// ... (rest of file)
