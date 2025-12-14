'use client';

import { useEffect, useState } from 'react';
import { StorefrontService } from '@/services/storefront';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@vayva/ui';

export default function ProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            StorefrontService.getProduct(id as string)
                .then(setProduct)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [id]);

    const addToCart = () => {
        // Simple LocalStorage Cart for V1
        const cart = JSON.parse(localStorage.getItem('vayva_cart') || '[]');
        const existing = cart.find((item: any) => item.productId === product.id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                productId: product.id,
                variantId: product.variants[0]?.id,
                title: product.name,
                price: product.variants[0]?.price || 0,
                quantity: 1
            });
        }

        localStorage.setItem('vayva_cart', JSON.stringify(cart));
        router.push('/cart');
    };

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
    if (!product) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Product not found</div>;

    const price = product.variants[0]?.price;

    return (
        <div className="min-h-screen bg-black text-white p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white/5 rounded-3xl h-[600px] w-full" />
            <div className="flex flex-col justify-center space-y-6">
                <div>
                    <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
                    <div className="text-2xl font-mono text-primary">NGN {price?.toLocaleString()}</div>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed">{product.description}</p>

                <div className="pt-8">
                    <button
                        onClick={addToCart}
                        className="w-full bg-white text-black font-bold h-14 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        Add to Cart
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full mt-4 text-gray-500 hover:text-white transition-colors"
                    >
                        Back to Store
                    </button>
                </div>
            </div>
        </div>
    );
}
