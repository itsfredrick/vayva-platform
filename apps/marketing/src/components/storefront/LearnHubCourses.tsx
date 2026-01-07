import React, { useState } from "react";
import Image from "next/image";
import {
  useStorefrontProducts,
  useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { StorefrontCart } from "./StorefrontCart";
import { ShoppingBag, X, Star, Globe, CheckCircle } from "lucide-react";
import { StorefrontSEO } from "./StorefrontSEO";
import { useCartQuery } from "@/hooks/storefront/useStorefrontQuery";

export function LearnHubCourses({
  storeName: initialStoreName,
  storeSlug,
  config: configOverride,
}: {
  storeName: string;
  storeSlug?: string;
  config?: any;
}) {
  const { store } = useStorefrontStore(storeSlug);
  const { products, isLoading } = useStorefrontProducts(storeSlug, {
    limit: 12,
  });

  // Config Merging logic
  const config = {
    primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#2563eb",
    heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "Learn without limits",
    heroDesc: configOverride?.heroDesc || store?.templateConfig?.heroDesc || "Build skills with courses, certificates, and degrees online from world-class universities and companies.",
  };

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
    <div className="bg-[#f8f9fa] min-h-screen font-sans text-[#333]">
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
      <nav className="sticky top-0 z-50 shadow-lg" style={{ backgroundColor: config.primaryColor, color: '#fff' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight flex items-center gap-2">
            <Globe className="w-6 h-6" />
            {displayName}
          </div>

          <div className="flex items-center gap-6 text-sm font-medium">
            <a href="#" className="opacity-90 hover:opacity-100">
              Degrees
            </a>
            <a href="#" className="opacity-90 hover:opacity-100">
              Certificates
            </a>
            <a href="#" className="opacity-90 hover:opacity-100">
              For Business
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-sm font-bold opacity-90 hover:opacity-100">
              Log In
            </button>
            <button
              className="px-4 py-2 rounded font-bold text-sm transition-colors flex items-center gap-2"
              style={{ backgroundColor: '#fff', color: config.primaryColor }}
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-4 h-4" />
              {cart.length > 0 && <span>({cart.length})</span>}
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

      {/* Hero */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-20 flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#1f1f1f] tracking-tight">
              {config.heroTitle}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              {config.heroDesc}
            </p>
            <div className="flex gap-4">
              <button
                className="text-white px-8 py-4 font-bold rounded text-lg shadow-xl hover:opacity-90 transition-colors"
                style={{ backgroundColor: config.primaryColor }}
              >
                Start Learning Free
              </button>
              <button
                className="border px-8 py-4 font-bold rounded text-lg hover:bg-blue-50 transition-colors"
                style={{ borderColor: config.primaryColor, color: config.primaryColor }}
              >
                Career Guide
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="bg-gray-100 border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex justify-around text-center">
          <div>
            <div className="text-3xl font-bold mb-1" style={{ color: config.primaryColor }}>82%</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Report Career Benefits
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1" style={{ color: config.primaryColor }}>100+</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Global Partners
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1" style={{ color: config.primaryColor }}>24/7</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Online Support
            </div>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-8 text-[#1f1f1f]">
          Most Popular Certificates
        </h2>

        {isLoading && products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Loading courses...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 border border-gray-200 rounded-lg">
            <p className="text-gray-400">No courses found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {products.map((course) => (
              <article
                key={course.id}
                className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all h-full flex flex-col group cursor-pointer"
                onClick={() => addToCart(course)}
              >
                <div className="h-40 bg-gray-200 relative">
                  <Image
                    src={
                      course.image ||
                      `https://via.placeholder.com/300x200?text=${encodeURIComponent(course.name)}`
                    }
                    alt={course.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute top-2 left-2 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded shadow-sm">
                    Professional Cert
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-gray-100 rounded-full"></div>
                    <span className="text-xs font-bold text-gray-500">IBM</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {course.name}
                  </h3>

                  <div className="flex items-center gap-1 text-sm font-bold text-yellow-500 mb-4">
                    4.7 <Star className="w-4 h-4 fill-current" />
                    <span className="text-gray-400 font-normal ml-1 text-xs">
                      (45k reviews)
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mb-6 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="font-bold text-lg" style={{ color: config.primaryColor }}>
                      ₦{course.price.toLocaleString()}
                    </div>
                    <button className="text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: config.primaryColor }}>
                      Enroll Now →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-20 py-12 text-center text-gray-500 text-sm">
        &copy; 2024 {displayName} Inc. All rights reserved.
      </footer>
    </div>
  );
}
