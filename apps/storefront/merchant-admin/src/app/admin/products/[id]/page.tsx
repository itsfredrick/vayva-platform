'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AppShell, Button, GlassPanel, Input } from '@vayva/ui';
import { ProductService } from '@/services/products';
import { useAuth } from '@/context/AuthContext';

export default function ProductFormPage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuth();
    const id = params?.id as string;
    const isEdit = !!id && id !== 'new';

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);

    useEffect(() => {
        if (isEdit) {
            ProductService.get(id).then(product => {
                if (product) {
                    setName(product.name);
                    setDescription(product.description || '');
                    const v = product.variants?.[0];
                    if (v) {
                        setPrice(v.price.toString());
                        setStock(v.stock.toString());
                    }
                }
                setFetching(false);
            }).catch(console.error);
        }
    }, [id, isEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { name, price, stock, description };
            if (isEdit) {
                await ProductService.update(id, payload);
            } else {
                await ProductService.create(payload);
            }
            router.push('/admin/products');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8 text-center text-white">Loading...</div>;

    return (
        <AppShell
            title={isEdit ? 'Edit Product' : 'New Product'}
            breadcrumbs={[
                { label: 'Products', href: '/admin/products' },
                { label: isEdit ? 'Edit' : 'New', href: '#' }
            ]}
            profile={{ name: user?.name || '', email: user?.email || '' }}
            storeName="Store"
            onLogout={() => router.push('/signin')}
        >
            <GlassPanel className="max-w-2xl mx-auto p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input label="Name" value={name} onChange={e => setName(e.target.value)} required />
                    <Input label="Description" value={description} onChange={e => setDescription(e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} required />
                        <Input label="Stock" type="number" value={stock} onChange={e => setStock(e.target.value)} required />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Product'}</Button>
                    </div>
                </form>
            </GlassPanel>
        </AppShell>
    );
}
