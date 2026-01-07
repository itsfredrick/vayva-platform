import React, { useState } from "react";
import {
  useStorefrontProducts,
  useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { StorefrontCart } from "./StorefrontCart";
import { ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { StorefrontSEO } from "./StorefrontSEO";

export function BloomeHome({
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
    primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#44403C",
    heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "Objects for Mindful Living",
    showJournal: configOverride?.showJournal ?? store?.templateConfig?.showJournal ?? true,
    accentColor: configOverride?.accentColor || store?.templateConfig?.accentColor || "#78716C",
  };
  const { products, isLoading } = useStorefrontProducts(storeSlug, {
    limit: 8,
  });

  // Split products for layout
  const newArrivals = products.slice(0, 4);
  const collection = products.slice(4, 8);

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

  const displayName = store?.name || initialStoreName;

  return (
    <div
      className="bg-[#FAFAF9] min-h-screen font-serif"
      style={{ color: config.primaryColor } as any}
    >
      <StorefrontSEO store={store} products={products} />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={total}
        storeSlug={storeSlug || ""}
        onSuccess={clearCart}
      />

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 sticky top-0 bg-[#FAFAF9]/90 backdrop-blur z-50 border-b border-[#E7E5E4]">
        <div className="text-sm font-sans tracking-widest uppercase flex gap-6">
          <a href="#" className="hover:text-black transition-colors">
            Shop
          </a>
          <a href="#" className="hover:text-black transition-colors">
            About
          </a>
          {config.showJournal && (
            <a href="#" className="hover:text-black transition-colors">
              Journal
            </a>
          )}
        </div>
        <div className="text-3xl font-bold tracking-tight text-[#292524]">
          {displayName}
        </div>
        <div className="flex gap-4 items-center">
          <button className="text-sm font-sans tracking-widest uppercase hover:text-black">
            Account
          </button>
          <button
            className="text-sm font-sans tracking-widest uppercase hover:text-black flex items-center gap-2"
            onClick={() => setIsCartOpen(true)}
          >
            Cart ({cart.length})
          </button>
        </div>
      </nav>

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

      {/* Hero */}
      <header className="relative py-24 px-8 text-center max-w-4xl mx-auto">
        <span className="text-xs font-sans font-bold tracking-[0.2em] text-[#A8A29E] uppercase block mb-6">
          Est. 2024
        </span>
        <h1
          className="text-6xl md:text-8xl mb-8 leading-none tracking-tight text-[#292524]"
          dangerouslySetInnerHTML={{ __html: config.heroTitle.replace('Mindful Living', `<i class="font-serif font-light text-[${config.accentColor}]">Mindful Living</i>`) }}
        />
        <p className="text-lg text-[#78716C] leading-relaxed max-w-xl mx-auto mb-10">
          Curated essentials designed to bring calm, balance, and beauty to your
          everyday rituals.
        </p>
        <div className="aspect-[16/9] bg-[#E7E5E4] w-full overflow-hidden relative">
          <Image
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=2000"
            alt="Hero"
            fill
            priority
            className="object-cover opacity-90 hover:scale-105 transition-transform duration-[2s]"
          />
        </div>
      </header>

      {/* Products - Section 1 */}
      <section className="px-8 py-20 max-w-7xl mx-auto">
        <div className="flex justify-between items-baseline mb-12 border-b border-[#E7E5E4] pb-6">
          <h2 className="text-3xl text-[#292524]">New Arrivals</h2>
          <a
            href="#"
            className="font-sans text-xs font-bold uppercase tracking-widest hover:underline decoration-[#A8A29E] underline-offset-4"
          >
            View All
          </a>
        </div>

        {isLoading && newArrivals.length === 0 ? (
          <div className="text-center py-20 text-[#A8A29E]">
            Loading objects...
          </div>
        ) : newArrivals.length === 0 ? (
          <div className="text-center py-20 bg-[#F5F5F4]">
            <p className="text-[#A8A29E]">No products found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-x-8 gap-y-12">
            {newArrivals.map((product) => (
              <article key={product.id} className="group cursor-pointer">
                <div className="aspect-[4/5] bg-[#F5F5F4] mb-6 overflow-hidden relative">
                  <Image
                    src={
                      product.image ||
                      `https://via.placeholder.com/400x500?text=${encodeURIComponent(product.name)}`
                    }
                    alt={product.name}
                    fill
                    className="object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-sm hover:shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#292524]" />
                  </button>
                </div>
                <h3 className="text-lg text-[#292524] mb-1 group-hover:underline underline-offset-4 decoration-[#D6D3D1] transition-all">
                  {product.name}
                </h3>
                <div className="flex justify-between items-baseline">
                  <p className="text-sm text-[#A8A29E] font-sans truncate pr-4">
                    {product.description}
                  </p>
                  <span className="text-[#57534E] font-medium">
                    ₦{product.price.toLocaleString()}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-[#292524] text-[#A8A29E] py-20 px-8 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-bold text-[#FAFAF9]">{displayName}</div>
          <div className="font-sans text-xs tracking-widest uppercase flex gap-8">
            <a href="#" className="hover:text-white transition-colors">
              Shipping
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Returns
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
          </div>
          <div className="font-serif italic text-sm">
            © {new Date().getFullYear()} {displayName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
