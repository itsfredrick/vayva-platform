import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, User, ShoppingBag } from "lucide-react";
import {
  useStorefrontProducts,
  useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { StorefrontCart } from "./StorefrontCart";
import { useCartQuery, useCategoryQuery } from "@/hooks/storefront/useStorefrontQuery";
import { StorefrontSEO } from "./StorefrontSEO";

interface StandardRetailHomeProps {
  storeName?: string;
  storeSlug?: string;
  config?: any;
}

export function StandardRetailHome({
  storeName: initialStoreName,
  storeSlug,
  config: configOverride,
}: StandardRetailHomeProps) {
  const { store } = useStorefrontStore(storeSlug);
  const { products, isLoading } = useStorefrontProducts(storeSlug, {
    limit: 8,
  });

  // Cart Hooks
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

  // Deep Linking
  useCartQuery(isCartOpen, setIsCartOpen);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState("All");
  useCategoryQuery(activeCategory, setActiveCategory, "All");

  const displayName = store?.name || initialStoreName || "Standard Retail";

  // Configuration Merging (Override > Store > Defaults)
  const config = {
    primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#000000",
    heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "Timeless Essentials For Modern Living",
    showAnnouncement: configOverride?.showAnnouncement ?? store?.templateConfig?.showAnnouncement ?? true,
    logoWidth: configOverride?.logoWidth || store?.templateConfig?.logoWidth || 120,
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900" style={{ "--primary": config.primaryColor } as any}>
      <StorefrontSEO store={store} products={products} />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={total}
        storeSlug={storeSlug || ""}
        onSuccess={clearCart}
      />

      {/* Announcement Bar */}
      {config.showAnnouncement && (
        <aside className="bg-black text-white text-center py-2 text-sm font-medium">
          Free shipping on orders over ₦50,000
        </aside>
      )}

      {/* Navigation */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div
              className="text-2xl font-black tracking-tighter cursor-pointer"
              style={{ color: config.primaryColor }}
            >
              {displayName}
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
              <a href="#" className="hover:text-black">
                New Arrivals
              </a>
              <a href="#" className="hover:text-black">
                Best Sellers
              </a>
              <a href="#" className="hover:text-black">
                Accessories
              </a>
              <a href="#" className="hover:text-black">
                Sale
              </a>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <User className="w-5 h-5" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-full relative"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
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

      {/* Hero Section */}
      <header className="relative h-[80vh] bg-[#F3F4F6] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000"
            alt="Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center text-white px-4">
          <div className="max-w-3xl">
            <span className="text-sm font-bold tracking-widest uppercase mb-4 block">
              New Collection 2024
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              {config.heroTitle}
            </h1>
            <div className="flex gap-4 justify-center">
              <button className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-all">
                Shop Collection
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <div className="flex gap-4">
            <button
              className={`text-sm font-bold border-b-2 pb-1 ${activeCategory === "All" ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black"}`}
              onClick={() => setActiveCategory("All")}
            >
              All
            </button>
            <button
              className={`text-sm font-medium ${activeCategory === "Clothing" ? "border-b-2 border-black text-black pb-1 font-bold" : "text-gray-500 hover:text-black"}`}
              onClick={() => setActiveCategory("Clothing")}
            >
              Clothing
            </button>
            <button
              className={`text-sm font-medium ${activeCategory === "Accessories" ? "border-b-2 border-black text-black pb-1 font-bold" : "text-gray-500 hover:text-black"}`}
              onClick={() => setActiveCategory("Accessories")}
            >
              Accessories
            </button>
          </div>
        </div>

        {isLoading && products.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center bg-gray-50 rounded-xl">
            <p className="text-gray-500">No products found.</p>
            {!storeSlug && (
              <p className="text-xs text-gray-400 mt-2">
                Connect a store slug to view products.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-y-12 gap-x-8">
            {products.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
                  <Image
                    src={
                      product.image ||
                      `https://via.placeholder.com/400x500?text=${encodeURIComponent(product.name)}`
                    }
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  {/* Using inventory if available in model, otherwise ignore */}
                  {product.inventory === 0 && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span className="text-xs font-bold uppercase tracking-widest border border-black px-2 py-1">
                        Sold Out
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => addToCart(product)}
                    className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black hover:text-white"
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-2 line-clamp-1">
                    {product.description}
                  </p>
                  <div className="font-medium text-lg">
                    ₦{product.price.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="bg-gray-100 py-24">
        <div className="max-w-xl mx-auto text-center px-4">
          <h3 className="text-2xl font-bold mb-4">Join our newsletter</h3>
          <p className="text-gray-600 mb-8">
            Sign up for deals, new products and promotions
          </p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button className="px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800">
              Sign Up
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} {displayName}. Powered by {displayName}.
          </p>
        </div>
      </footer>
    </div>
  );
}
