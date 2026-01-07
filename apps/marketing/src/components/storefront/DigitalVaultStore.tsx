import React, { useState } from "react";
import Image from "next/image";
import {
  useStorefrontProducts,
  useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { StorefrontCart } from "./StorefrontCart";
import { ShoppingCart, X, Download, ShieldCheck } from "lucide-react";
import { StorefrontSEO } from "./StorefrontSEO";
import { useCartQuery } from "@/hooks/storefront/useStorefrontQuery";

export function DigitalVaultStore({
  storeName: initialStoreName,
  storeSlug,
  config: configOverride,
}: {
  storeName: string;
  storeSlug?: string;
  config?: any;
}) {
  const { store } = useStorefrontStore(storeSlug);

  // Configuration Merging
  const config = {
    primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#FF90E8", // Pink
    heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "High-quality digital assets for creators.",
    heroDesc: configOverride?.heroDesc || store?.templateConfig?.heroDesc || "Premium fonts, prototypes, templates, and textures. Carefully curated for professional designers. Instant download.",
  };
  const { products, isLoading } = useStorefrontProducts(storeSlug, {
    limit: 12,
  });

  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    total,
    isOpen: isCartOpen,
    setIsOpen: setIsCartOpen,
    clearCart,
  } = useStorefrontCart(storeSlug || "");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useCartQuery(isCartOpen, setIsCartOpen);

  const displayName = store?.name || initialStoreName;

  return (
    <div className="bg-[#fff] min-h-screen font-sans text-[#24292e]">
      <StorefrontSEO store={store} products={products} />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={total}
        storeSlug={storeSlug || ""}
        onSuccess={clearCart}
      />

      {/* Header */}
      <header className="border-b border-gray-100 py-6 px-6 sticky top-0 bg-white/90 backdrop-blur z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center font-bold text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: config.primaryColor }}>
              {displayName.charAt(0)}
            </div>
            <span className="font-bold text-xl tracking-tight">
              {displayName}
            </span>
          </div>
          <button
            className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:translate-y-px hover:shadow-none transition-all flex items-center gap-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Cart ({cart.length})</span>
          </button>
        </div>
      </header>

      {/* Shared Cart Component */}
      <StorefrontCart
        storeSlug={storeSlug || ""}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="w-20 h-2 mb-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: config.primaryColor }}></div>
        <h1 className="text-5xl font-black mb-6 leading-none">
          {config.heroTitle}
        </h1>
        <p className="text-xl text-gray-500 mb-16 max-w-2xl">
          {config.heroDesc}
        </p>

        <h2 className="sr-only">Digital Assets</h2>

        {isLoading && products.length === 0 ? (
          <div className="py-20 text-center text-gray-500 font-bold">
            Loading assets...
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-gray-300 rounded-2xl">
            <p className="text-gray-400 font-bold text-xl">
              No products found.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <article key={product.id} className="group cursor-pointer">
                <div className="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200">
                  <div className="aspect-[4/3] bg-gray-100 border-b-2 border-black relative">
                    <Image
                      src={
                        product.image ||
                        `https://via.placeholder.com/400x300?text=${encodeURIComponent(product.name)}`
                      }
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute top-3 left-3 bg-white px-3 py-1 text-xs font-black uppercase tracking-widest border-2 border-black rounded-lg">
                      {product.category || "Asset"}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 h-10">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-black">
                        ₦{product.price.toLocaleString()}
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="text-black px-6 py-2 rounded-lg font-bold border-2 border-black hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: config.primaryColor }}
                      >
                        I want this!
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-gray-100 mt-20 py-12 text-center text-gray-400 font-bold text-sm">
        Powered by {displayName}.
      </footer>
    </div>
  );
}
