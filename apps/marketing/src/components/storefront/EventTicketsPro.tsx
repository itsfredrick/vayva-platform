import React, { useState } from "react";
import Image from "next/image";
import {
  useStorefrontProducts,
  useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { StorefrontCart } from "./StorefrontCart";
import { ShoppingCart, X, Share2, Plus, Minus } from "lucide-react";
import { StorefrontSEO } from "./StorefrontSEO";
import { useCartQuery } from "@/hooks/storefront/useStorefrontQuery";

export function EventTicketsPro({
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
    primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#d1410c", // Eventbrite Orange
    heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "Make memories live.",
    heroDesc: configOverride?.heroDesc || store?.templateConfig?.heroDesc || "Trending events happening near you.",
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

  useCartQuery(isCartOpen, setIsCartOpen);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const displayName = store?.name || initialStoreName;

  return (
    <div className="bg-[#f8f7fa] min-h-screen font-sans text-[#1e0a3c]">
      <StorefrontSEO store={store} products={products} />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={total}
        storeSlug={storeSlug || ""}
        onSuccess={clearCart}
      />

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-2xl tracking-tight" style={{ color: config.primaryColor }}>
            {displayName}
          </div>

          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <input
              type="text"
              placeholder="Search events..."
              className="w-full bg-[#f8f7fa] border border-gray-200 rounded-full px-5 py-2 text-sm focus:outline-none focus:border-red-300"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: config.primaryColor }}>
              Find Events
            </button>
            <button className="text-sm font-medium hover:text-red-600">
              Create Event
            </button>
            <button
              className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {cart.length > 0 && (
                <span className="absolute top-1 right-0 w-2 h-2 rounded-full" style={{ backgroundColor: config.primaryColor }}></span>
              )}
            </button>
            <button className="text-sm font-medium">Log In</button>
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

      {/* Hero */}
      <header className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2000"
            alt="Event Hero"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e0a3c] via-transparent to-transparent opacity-90"></div>
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-6 flex items-end pb-20">
          <div className="max-w-3xl text-white">
            <div className="inline-block text-white text-xs font-bold px-3 py-1 rounded mb-4 uppercase tracking-wide" style={{ backgroundColor: config.primaryColor }}>
              Trending
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              {config.heroTitle.split(" ").length > 1 ? (
                <>
                  {config.heroTitle.split(" ").slice(0, -1).join(" ")}
                  <br />
                  {config.heroTitle.split(" ").slice(-1)}
                </>
              ) : (
                config.heroTitle
              )}
            </h1>
            <button className="text-white px-8 py-4 font-bold rounded transition-colors text-lg" style={{ backgroundColor: config.primaryColor }}>
              Explore Events
            </button>
          </div>
        </div>
      </header>

      {/* Events Grid */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-8 text-[#1e0a3c]">
          Upcoming Events
        </h2>

        {
          isLoading && products.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              Loading events...
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 border border-gray-200 rounded-lg">
              <p className="text-gray-400">No upcoming events.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-4 gap-8">
              {products.map((event) => (
                <article
                  key={event.id}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow cursor-pointer border border-gray-100 overflow-hidden flex flex-col h-full"
                  onClick={() => addToCart(event)}
                >
                  <div className="aspect-[3/2] bg-gray-100 relative overflow-hidden">
                    <Image
                      src={
                        event.image ||
                        `https://via.placeholder.com/400x300?text=${encodeURIComponent(event.name)}`
                      }
                      alt={event.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-red-500">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="font-bold text-sm mb-1 uppercase tracking-wide" style={{ color: config.primaryColor }}>
                      DEC 14{" "}
                      <span className="text-gray-400 font-normal ml-2">
                        7:00 PM
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-[#1e0a3c] mb-2 leading-tight line-clamp-2 hover:underline">
                      {event.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <div className="font-bold text-gray-700">
                        From ₦{event.price.toLocaleString()}
                      </div>
                      <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50">
                        <ShoppingCart className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )
        }
      </main >

      <footer className="bg-[#1e0a3c] text-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm opacity-60">
          &copy; 2024 {displayName} Events.
        </div>
      </footer>
    </div >
  );
}
