'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, GlassPanel } from '@vayva/ui';
import { ProductService } from '@/services/products';

export default function ProductsPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [sku, setSku] = useState('');
    const [stock, setStock] = useState('100');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await ProductService.create({
                name,
                price,
                sku: sku || `SKU-${Date.now()}`,
                stock,
                description: 'Product created during onboarding'
            });
            router.push('/onboarding/review');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassPanel className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Add your first product</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Product Name"
                    placeholder="e.g. Classic T-Shirt"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Price (NGN)"
                        type="number"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                    <Input
                        label="Stock"
                        type="number"
                        placeholder="100"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                    />
                </div>

                <Input
                    label="SKU (Optional)"
                    placeholder="Leave blank to auto-generate"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                />

                <div className="flex justify-between pt-4">
                    <Button variant="ghost" type="button" onClick={() => router.back()}>Back</Button>
                    <Button type="submit" disabled={loading} size="lg">Next Step</Button>
                </div>
            </form>
        </GlassPanel>
    );
}
