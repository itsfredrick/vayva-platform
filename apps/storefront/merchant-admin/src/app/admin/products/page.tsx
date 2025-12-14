'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, Button, GlassPanel, StatusChip } from '@vayva/ui';
import { ProductService } from '@/services/products';
import { useAuth } from '@/context/AuthContext';

export default function ProductsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ProductService.list()
            .then(setProducts)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <AppShell
            title="Products"
            breadcrumbs={[{ label: 'Products', href: '/admin/products' }]}
            profile={{ name: user?.name || '', email: user?.email || '' }}
            storeName="Store"
            onLogout={() => router.push('/signin')}
        >
            <div className="flex justify-end mb-6">
                <Button onClick={() => router.push('/admin/products/new')}>
                    Add Product
                </Button>
            </div>

            <GlassPanel className="p-0 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-sm font-medium text-text-secondary">Name</th>
                            <th className="p-4 text-sm font-medium text-text-secondary">Price</th>
                            <th className="p-4 text-sm font-medium text-text-secondary">Stock</th>
                            <th className="p-4 text-sm font-medium text-text-secondary">Status</th>
                            <th className="p-4 text-sm font-medium text-text-secondary">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-text-secondary">Loading...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-text-secondary">No products found.</td></tr>
                        ) : (
                            products.map((product) => {
                                const variant = product.variants?.[0] || {};
                                return (
                                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-white font-medium">{product.name}</td>
                                        <td className="p-4 text-white">NGN {variant.price?.toLocaleString() || '-'}</td>
                                        <td className="p-4 text-white">{variant.stock || 0}</td>
                                        <td className="p-4"><StatusChip status={product.status || 'ACTIVE'} /></td>
                                        <td className="p-4">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => router.push(`/admin/products/${product.id}`)}
                                            >
                                                Edit
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </GlassPanel>
        </AppShell>
    );
}
