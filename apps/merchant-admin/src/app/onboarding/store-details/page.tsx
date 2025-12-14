'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, GlassPanel } from '@vayva/ui';
import { StoreService } from '@/services/store';
import { useAuth } from '@/context/AuthContext';
import Cookies from 'js-cookie';

export default function StoreDetailsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Check if user already has a draft store?
            // For now, create new.
            const store = await StoreService.create({ name, slug }); // Status defaults to DRAFT in backend

            // Set context
            Cookies.set('vayva_store_id', store.id);

            router.push('/onboarding/brand');
        } catch (err) {
            console.error(err);
            // Handle error
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassPanel className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Store Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Store Name"
                    placeholder="My Awesome Store"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        // Auto-gen slug
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    }}
                    required
                />
                <Input
                    label="Store URL"
                    prefix="vayva.com/"
                    placeholder="my-awesome-store"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                />

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={loading} size="lg">
                        {loading ? 'Creating...' : 'Next Step'}
                    </Button>
                </div>
            </form>
        </GlassPanel>
    );
}
