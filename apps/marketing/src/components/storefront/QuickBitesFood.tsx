import React, { useState, useMemo } from "react";
import {
  useStorefrontProducts,
  useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { StorefrontCart } from "./StorefrontCart";
import {
  ShoppingBag,
  ChevronRight,
  Search,
  Star,
  Clock,
  Heart,
  Plus,
  Minus,
  X,
} from "lucide-react";
import Image from "next/image";
import { StorefrontSEO } from "./StorefrontSEO";

export function QuickBitesFood({
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
    primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#f97316", // orange-500
    heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "Get 20% off your first order!",
    heroSubtitle: configOverride?.heroSubtitle || store?.templateConfig?.heroSubtitle || "SAVE20",
    showSidebarItems: configOverride?.showSidebarItems ?? store?.templateConfig?.showSidebarItems ?? true,
  };
  const { products, isLoading } = useStorefrontProducts(storeSlug, {
    limit: 100,
  }); // Fetch more for categorized menu

  // Cart Logic
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

  // Category Logic
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Generate categories from products
  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category || "Popular"));
    return ["All", ...Array.from(unique)];
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, products]);

  const displayName = store?.name || initialStoreName;

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <StorefrontSEO store={store} products={products} />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={total}
        storeSlug={storeSlug || ""}
        onSuccess={clearCart}
      />

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col justify-between p-6 overflow-y-auto hidden md:flex">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 rounded-xl" style={{ backgroundColor: config.primaryColor + '1a', color: config.primaryColor }}>
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-black">
              {displayName}
            </span>
          </div>

          <nav className="space-y-2">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">
              Menu
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat ? "text-white shadow-lg" : "text-gray-500 hover:bg-gray-50"}`}
                style={{
                  backgroundColor: selectedCategory === cat ? config.primaryColor : undefined,
                  boxShadow: selectedCategory === cat ? `0 10px 15px -3px ${config.primaryColor}33` : undefined
                }}
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8 bg-blue-500 rounded-2xl p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Star className="w-12 h-12" />
          </div>
          <div className="relative z-10">
            <div className="font-bold text-lg mb-1">Free Delivery</div>
            <p className="text-xs text-blue-100 mb-3">
              On all orders over ₦5,000
            </p>
            <button className="text-xs bg-white text-blue-500 px-4 py-2 rounded-lg font-bold">
              Details
            </button>
          </div>
        </div>
      </aside>

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

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0">
          <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-xl w-96">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${displayName}...`}
              className="bg-transparent border-none text-sm w-full focus:outline-none"
            />
          </div>

          <button
            className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div
            className="rounded-3xl p-8 mb-10 text-white flex items-center justify-between shadow-xl"
            style={{ backgroundColor: config.primaryColor, boxShadow: `0 20px 25px -5px ${config.primaryColor}33` }}
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {config.heroTitle}
              </h2>
              <p className="opacity-90">
                Use code:{" "}
                <span className="font-mono bg-white/20 px-2 rounded">
                  {config.heroSubtitle}
                </span>
              </p>
            </div>
            <div className="text-4xl">🍔</div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedCategory} Menu
            </h2>
            <div className="flex gap-2">
              <button className="p-2 border rounded-lg hover:bg-gray-50">
                <Clock className="w-4 h-4" />
              </button>
              <button className="p-2 border rounded-lg hover:bg-gray-50">
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center">Loading menu...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
              {filteredProducts.map((p) => (
                <article
                  key={p.id}
                  className="bg-white p-4 rounded-2xl border border-gray-100 hover:shadow-lg transition-all group cursor-pointer"
                  onClick={() => addToCart(p)}
                >
                  <div className="aspect-video bg-gray-50 rounded-xl mb-4 overflow-hidden relative">
                    <Image
                      src={
                        p.image ||
                        `https://via.placeholder.com/300x200?text=${p.name}`
                      }
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-4 h-4 text-orange-500" />
                    </button>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">{p.name}</h3>
                    <span className="font-bold text-orange-500">
                      ₦{p.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {p.description}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
