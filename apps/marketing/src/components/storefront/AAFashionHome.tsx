import React, { useState } from "react";
import {
  useStorefrontProducts,
  useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { StorefrontCart } from "./StorefrontCart";
import {
  ShoppingBag, X, Plus, Check, Search,
} from "lucide-react";
import { StorefrontSEO } from "./StorefrontSEO";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { StorefrontProductCard } from "./StorefrontProductCard";
import { useCartQuery } from "@/hooks/storefront/useStorefrontQuery";

export function AAFashionHome({
  storeName: initialStoreName,
  storeSlug,
  basePath = "",
  config: configOverride,
}: {
  storeName: string;
  storeSlug?: string;
  basePath?: string;
  config?: any;
}) {
  const { store } = useStorefrontStore(storeSlug);

  // Merge config: Props override (preview) > DB config > Defaults
  const config = configOverride || store?.templateConfig || {};

  const primaryColor = config.primaryColor || "#000000";
  const heroTitle = config.heroTitle || "New Collection";
  const showAnnouncement = config.showAnnouncement ?? true;
  const logoWidth = config.logoWidth || 120;
  const { products, isLoading } = useStorefrontProducts(storeSlug, {
    limit: 12,
  });

  // Cart Integration
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

  useCartQuery(isCartOpen, setIsCartOpen);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Mock Size Selection
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categories = ["T-Shirts", "Hoodies", "Accessories", "Outerwear"]; // Example categories

  const displayName = store?.name || initialStoreName;

  const handleSizeSelect = (productId: string, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-black selection:text-white">
      <StorefrontSEO store={store} products={products} />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={total}
        storeSlug={storeSlug || ""}
        onSuccess={clearCart}
      />

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

      {/* Top Bar */}
      {showAnnouncement && (
        <aside className="bg-black text-white text-center py-2 text-xs font-bold uppercase tracking-widest">
          Worldwide Shipping • Free Returns • New Collection Dropping Soon
        </aside>
      )}

      {/* Navigation */}
      <nav className="fixed w-full z-50 mix-blend-difference px-8 py-6 flex justify-between items-center bg-black/50 backdrop-blur-sm border-b border-white/10 md:bg-transparent md:border-none md:backdrop-filter-none">
        <div className="text-2xl font-black tracking-tighter uppercase relative group cursor-pointer" style={{ width: logoWidth }}>
          {displayName}
          <div className="absolute top-1/2 left-0 h-[2px] w-0 bg-white group-hover:w-full transition-all duration-300" style={{ backgroundColor: primaryColor }}></div>
        </div>
        <div className="flex gap-8 text-sm font-medium tracking-wide items-center">
          <button className="hidden md:block hover:underline underline-offset-4">
            Collection
          </button>
          <button className="hidden md:block hover:underline underline-offset-4">
            Editorial
          </button>
          <button
            className="hover:scale-105 transition-transform flex items-center gap-2 border border-white/20 rounded-full px-4 py-2 bg-white/5 backdrop-blur-md"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden md:inline">Cart</span>
            <span className="bg-white text-black px-1.5 rounded text-xs font-bold">{cart.length}</span>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60 scale-105 animate-[kenburns_20s_infinite_alternate]"
            src="https://cdn.coverr.co/videos/coverr-fashion-photoshoot-with-a-model-5343/1080p.mp4"
          />
        </div>

        <div className="relative z-20 text-center max-w-4xl mx-auto px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base mb-4 font-bold tracking-[0.3em] uppercase"
          >
            Season 04 / 24
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-9xl font-bold tracking-tighter mb-8 leading-[0.8] whitespace-pre-line"
          >
            {heroTitle.includes("\n") ? heroTitle : heroTitle.toUpperCase()}
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border border-white px-12 py-4 text-sm font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500"
          >
            View Lookbook
          </motion.button>
        </div>
      </header>

      {/* Collection Grid */}
      <section className="px-6 py-24 max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-8">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">New Arrivals</h2>
          <div className="flex gap-8 text-sm font-bold uppercase tracking-widest text-gray-500 overflow-x-auto">
            <button
              className={`whitespace-nowrap ${activeCategory === null ? "text-black border-b-2 border-black" : "hover:text-black"}`}
              onClick={() => setActiveCategory(null)}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`whitespace-nowrap ${activeCategory === cat ? "text-black border-b-2 border-black" : "hover:text-black"}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {isLoading && products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            Loading collection...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 border border-gray-800 rounded">
            <p className="text-gray-500">No products available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24">
            {filteredProducts.map((product) => (
              <StorefrontProductCard
                key={product.id}
                product={product}
                storeSlug={storeSlug || ""}
                basePath={basePath}
                layout="grid"
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer Minimal */}
      <footer className="py-24 border-t border-gray-900 bg-black text-center">
        <h2 className="text-[10vw] font-black tracking-tighter leading-none opacity-20 hover:opacity-100 transition-opacity duration-700 cursor-default select-none">
          {displayName}
        </h2>
        <div className="mt-8 flex justify-center gap-8 text-xs font-mono text-gray-500 uppercase">
          <a href="#" className="hover:text-white">Instagram</a>
          <a href="#" className="hover:text-white">Twitter</a>
          <a href="#" className="hover:text-white">Legal</a>
        </div>
      </footer>
    </div>
  );
}
