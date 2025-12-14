'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, GlassPanel, Icon } from '@vayva/ui';
import { StoreService } from '@/services/store';
import Cookies from 'js-cookie';

export default function ReviewPage() {
    const router = useRouter();
    const storeId = Cookies.get('vayva_store_id');
    const [loading, setLoading] = useState(false);

    if (!storeId) {
        router.push('/onboarding/store-details');
        return null;
    }

    const handlePublish = async () => {
        setLoading(true);
        try {
            // Publish Store
            await StoreService.update(storeId, {
                status: 'ACTIVE'
            });
            // Redirect to Dashboard
            router.push('/admin/dashboard?onboarding=complete');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassPanel className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="Sparkles" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Launch!</h2>
            <p className="text-text-secondary max-w-md mx-auto mb-8">
                You've set up the basics. Publish your store now to start selling, or continue setting up payments and shipping in the dashboard.
            </p>

            <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <Button
                    onClick={handlePublish}
                    disabled={loading}
                    size="lg"
                    className="h-14 bg-white text-black hover:bg-white/90 font-bold"
                >
                    {loading ? 'Launching...' : 'Publish Store'}
                </Button>
                <Button variant="ghost" onClick={() => router.back()}>Back</Button>
            </div>
        </GlassPanel>
    );
}
