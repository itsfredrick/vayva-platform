'use client';

import { useEffect, useState } from 'react';
import { StorefrontService } from '@/services/storefront';
import Link from 'next/link';
import { Button } from '@vayva/ui'; // Assuming we re-exported or copied ui package components

// Mock UI copy if @vayva/ui not fully linked in simple scaffold or if it relies on admin providers
// For simplicity in scaffold, I'll use raw Tailwind if UI package setup is complex.
// But we copied `apps/merchant-admin` package.json which has `workspace:*` dep on ui. 
// So imports should work if tsconfig paths align.

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    StorefrontService.getProducts().then(setProducts).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter">VAYVA STORE</h1>
        <Link href="/cart" className="text-sm font-medium hover:text-primary">
          Cart
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.length === 0 ? (
          <p className="text-gray-500 col-span-3 text-center py-20">Loading products...</p>
        ) : (
          products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id} className="group">
              <div className="aspect-square bg-white/5 rounded-2xl mb-4 overflow-hidden relative">
                {/* Placeholder Image */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono border border-white/10">
                    {product.variants[0]?.price ? `NGN ${product.variants[0].price.toLocaleString()}` : 'N/A'}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-medium mb-1 group-hover:text-primary transition-colors">{product.name}</h3>
              <p className="text-sm text-gray-400 line-clamp-2">{product.description}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
