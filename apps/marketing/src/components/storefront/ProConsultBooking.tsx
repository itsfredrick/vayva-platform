import React, { useState } from "react";
import {
  useStorefrontProducts,
  useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { StorefrontCart } from "./StorefrontCart";
import {
  ShoppingBag,
  X,
  Calendar,
  Linkedin,
  ArrowRight,
  Plus,
  Minus,
  Video,
} from "lucide-react";
import Image from "next/image";
import { StorefrontSEO } from "./StorefrontSEO";

export function ProConsultBooking({
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
    primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#2563eb", // blue-600
    heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "Expert advice, on demand.",
    heroDesc: configOverride?.heroDesc || store?.templateConfig?.heroDesc || "Connect with top-tier consultants across tech, marketing, legal, and finance via high-quality video calls.",
    accentColor: configOverride?.accentColor || store?.templateConfig?.accentColor || "#0f172a", // slate-900
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

  const displayName = store?.name || initialStoreName;

  return (
    <div className="bg-white min-h-screen font-sans text-slate-800">
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
      <nav className="border-b border-slate-100 flex justify-between items-center px-8 py-5 sticky top-0 bg-white/90 backdrop-blur z-50">
        <div className="flex items-center gap-3 font-bold text-xl text-slate-900 tracking-tight">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-lg" style={{ backgroundColor: config.primaryColor }}>
            {displayName.charAt(0)}
          </div>
          {displayName}
        </div>
        <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-500">
          <a href="#" className="hover:text-blue-600">
            Experts
          </a>
          <a href="#" className="hover:text-blue-600">
            Services
          </a>
          <a href="#" className="hover:text-blue-600">
            Enterprise
          </a>
        </div>
        <div className="flex gap-4">
          <button className="text-sm font-bold text-slate-600 hover:text-blue-600">
            Login
          </button>
          <button
            className="px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 flex items-center gap-2"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Bookings ({cart.length})</span>
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
      <header className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 translate-x-20"></div>
        <div className="max-w-6xl mx-auto px-8 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold mb-6 border border-blue-500/30">
              TRUSTED BY 500+ COMPANIES
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              {config.heroTitle.split(",").length > 1 ? (
                <>
                  {config.heroTitle.split(",")[0]},
                  <br />
                  {config.heroTitle.split(",")[1]}
                </>
              ) : (
                config.heroTitle
              )}
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-md">
              {config.heroDesc}
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-3 text-white font-bold rounded-lg transition-colors" style={{ backgroundColor: config.primaryColor }}>
                Find an Expert
              </button>
              <button className="px-8 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors backdrop-blur">
                How it Works
              </button>
            </div>
          </div>
          <div className="hidden md:block relative">
            {/* Abstract illustration placeholder could go here */}
            <div className="aspect-square bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl opacity-20 blur-3xl absolute inset-0"></div>
            <div className="relative bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div>
                  <div className="h-4 w-32 bg-slate-600 rounded mb-2"></div>
                  <div className="h-3 w-20 bg-slate-700 rounded"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-2 w-full bg-slate-700 rounded"></div>
                <div className="h-2 w-5/6 bg-slate-700 rounded"></div>
                <div className="h-2 w-4/6 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Experts Grid */}
      <main className="py-24 max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Available Consultants
            </h2>
            <p className="text-slate-500">Book a 1-on-1 session today.</p>
          </div>
          <button className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            View All Categories <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {isLoading && products.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-xl">
            <p className="text-slate-400">Loading experts...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500">No active consultants found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((expert) => (
              <article
                key={expert.id}
                className="border border-slate-200 rounded-xl hover:shadow-xl hover:border-blue-100 transition-all bg-white group cursor-pointer"
                onClick={() => addToCart(expert)}
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 bg-slate-100 rounded-full overflow-hidden border-2 border-white shadow-sm">
                      <Image
                        src={
                          expert.image ||
                          `https://via.placeholder.com/100x100?text=${expert.name.charAt(0)}`
                        }
                        alt={expert.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>{" "}
                      Available
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {expert.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 min-h-[40px]">
                    {expert.description ||
                      "Senior Consultant specialized in business strategy and growth."}
                  </p>

                  <div className="flex gap-2 mb-6">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">
                      Strategy
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">
                      Growth
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div>
                      <span className="block text-xs text-slate-400 uppercase tracking-wider font-bold">
                        Rate
                      </span>
                      <div className="text-slate-900 font-bold">
                        ₦{expert.price.toLocaleString()}{" "}
                        <span className="text-xs font-normal text-slate-400">
                          / session
                        </span>
                      </div>
                    </div>
                    <button className="bg-slate-900 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors group-hover:shadow-lg">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 py-12 text-center text-slate-400 text-sm">
        <p>&copy; 2024 {displayName} Consulting.</p>
      </footer>
    </div>
  );
}
