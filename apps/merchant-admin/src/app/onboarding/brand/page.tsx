'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, GlassPanel } from '@vayva/ui';
import { StoreService } from '@/services/store';
import { useAuth } from '@/context/AuthContext';
import Cookies from 'js-cookie';

export default function BrandPage() {
    const router = useRouter();
    const storeId = Cookies.get('vayva_store_id');
    const [color, setColor] = useState('#000000');
    const [loading, setLoading] = useState(false);

    if (!storeId) {
        router.push('/onboarding/store-details');
        return null; // or spinner
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Update Store with branding
            await StoreService.update(storeId, {
                // Assuming json field 'settings' or specific columns
                // V1 schema might not have all branding fields, assuming 'settings' JSONB or similar?
                // Checked schema: Store has `settings Json`.
                settings: {
                    brandColor: color
                }
            });
            router.push('/onboarding/products');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassPanel className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Brand Identity</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Brand Color</label>
                    <div className="flex gap-4 items-center">
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-12 h-12 rounded cursor-pointer border-none"
                        />
                        <span className="text-white">{color}</span>
                    </div>
                </div>

                {/* Logo Upload Placeholder */}
                <div className="p-6 border-2 border-dashed border-white/10 rounded-xl text-center">
                    <span className="text-text-secondary">Logo Upload (Coming Soon)</span>
                </div>

                <div className="flex justify-between pt-4">
                    <Button variant="ghost" onClick={() => router.back()}>Back</Button>
                    <Button type="submit" disabled={loading} size="lg">Next Step</Button>
                </div>
            </form>
        </GlassPanel>
    );
}
