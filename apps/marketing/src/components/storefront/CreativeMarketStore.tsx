import React, { useState } from "react";
import Image from "next/image";
import {
  useStorefrontProducts,
  useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { StorefrontCart } from "./StorefrontCart";
import { ShoppingCart, X, Heart, Eye, Star, User, ChevronRight, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StorefrontSEO } from "./StorefrontSEO";
import { useCartQuery, useCategoryQuery } from "@/hooks/storefront/useStorefrontQuery";

export function CreativeMarketStore({
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
    primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#22c55e", // green-500
    heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "World-class design assets",
    searchPlaceholder: configOverride?.searchPlaceholder || store?.templateConfig?.searchPlaceholder || "Search over 4 million fonts, graphics, and more...",
    accentColor: configOverride?.accentColor || store?.templateConfig?.accentColor || "#1e293b", // slate-800
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
  const [selectedCategory, setSelectedCategory] = useState("All");

  useCategoryQuery(selectedCategory, setSelectedCategory);

  const displayName = store?.name || initialStoreName;

  const sellers = [
    { name: "Nordic Assets", rating: 4.9, sales: "12k", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?bg=255&w=100&fit=crop&q=80" },
    { name: "TypeFoundry", rating: 5.0, sales: "8.5k", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?bg=255&w=100&fit=crop&q=80" },
    { name: "MockupKing", rating: 4.8, sales: "21k", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?bg=255&w=100&fit=crop&q=80" }
  ];

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans text-slate-800">
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
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-serif text-2xl font-black italic tracking-tight text-slate-900">
            {displayName}
          </div>

          <div className="hidden md:flex gap-8 text-sm font-bold text-gray-500">
            {['Graphics', 'Fonts', 'Templates', 'Add-ons', 'Photos'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`hover:text-slate-900 transition-colors ${selectedCategory === cat ? 'font-bold' : ''}`}
                style={{ color: selectedCategory === cat ? config.primaryColor : undefined }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 relative text-gray-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>
            <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl">
              Sign In
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
      <header className="bg-[#f3f5f4] py-24 border-b border-gray-200 text-center px-6 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-10 right-10 w-24 h-24 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-black text-slate-900 mb-6 tracking-tight">
            {config.heroTitle}
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 font-medium">
            Bring your creative projects to life with ready-to-use design assets from independent creators around the world.
          </p>

          <div className="max-w-2xl mx-auto bg-white p-2 rounded-xl shadow-lg flex items-center border border-gray-200 ring-4 ring-gray-100/50">
            <input
              type="text"
              placeholder={config.searchPlaceholder}
              className="flex-1 px-4 py-3 outline-none text-slate-700 font-medium placeholder:text-slate-400 bg-transparent"
            />
            <button
              className="text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-md"
              style={{ backgroundColor: config.primaryColor }}
            >
              Search
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-8 hidden lg:block">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" /> Top Sellers
            </h3>
            <div className="space-y-4">
              {sellers.map((seller, i) => (
                <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                  <Image
                    src={seller.img}
                    alt={seller.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-slate-900 group-hover:text-green-600 transition-colors">{seller.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" /> {seller.rating} • {seller.sales} Sales
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-xs font-bold text-slate-500 hover:text-green-600 border border-slate-200 rounded-lg hover:border-green-200 transition-colors">
              View All Creators
            </button>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
            <h3 className="font-bold text-xl mb-2">Get 3 Free Goods</h3>
            <p className="text-sm text-indigo-100 mb-4">Sign up for our weekly newsletter and get free assets every Monday.</p>
            <button className="w-full py-2 bg-white text-indigo-600 font-bold rounded-lg text-sm hover:bg-indigo-50 transition-colors">
              Join the List
            </button>
          </div>
        </aside>

        {/* Products */}
        <main className="lg:col-span-9">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Trending Now</h2>
            <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
              <span className="text-slate-900 underline decoration-2 decoration-green-500 underline-offset-4">Popular</span>
              <span className="hover:text-slate-900 cursor-pointer">Newest</span>
              <span className="hover:text-slate-900 cursor-pointer">Handpicked</span>
            </div>
          </div>

          {isLoading && products.length === 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 border border-gray-200 rounded-lg">
              <p className="text-gray-400">No assets found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
                  onClick={() => addToCart(product)}
                >
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden rounded-t-xl">
                    <Image
                      src={
                        product.image ||
                        `https://source.unsplash.com/random/400x300?graphic,design&sig=${product.id}`
                      }
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white p-2 rounded-full text-slate-400 hover:text-red-500 shadow-md hover:scale-110 transition-transform">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-end">
                      <span className="text-white text-xs font-bold bg-black/50 backdrop-blur px-2 py-1 rounded">25 files</span>
                      <span className="text-white text-xs font-bold bg-green-500 px-2 py-1 rounded flex items-center gap-1"><Download className="w-3 h-3" /> Instant</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-green-600 transition-colors text-lg">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs text-slate-500 font-medium">by <span className="text-slate-900 font-bold hover:underline">{sellers[Math.floor(Math.random() * sellers.length)].name}</span></span>
                      <span className="text-xs text-slate-300">•</span>
                      <div className="flex text-yellow-400">
                        <Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" />
                      </div>
                      <span className="text-xs text-slate-400">(42)</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400 line-through font-medium">₦{(product.price * 1.5).toLocaleString()}</span>
                        <span className="font-bold text-xl text-slate-900">₦{product.price.toLocaleString()}</span>
                      </div>
                      <button
                        className="bg-gray-100 hover:bg-green-600 hover:text-white p-3 rounded-lg font-bold transition-all shadow-sm hover:shadow-md active:scale-95"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Cross-Sell / More from Shop Mock */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-slate-900">More from Top Sellers</h3>
              <a href="#" className="text-sm font-bold text-green-600 hover:underline flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="group cursor-pointer">
                  <div className="bg-gray-100 rounded-lg aspect-square mb-2 overflow-hidden relative">
                    <Image
                      src={`https://source.unsplash.com/random/200x200?texture,pattern&sig=${i}`}
                      alt={`Texture Pack Vol. ${i}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="font-bold text-sm text-slate-800 truncate group-hover:text-green-600">Texture Pack Vol. {i}</div>
                  <div className="text-xs text-slate-500">₦5,000</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <footer className="bg-slate-900 mt-20 py-16 text-slate-400 text-sm">
        <div className="max-w-[1400px] mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div>
            <div className="font-serif text-2xl font-black italic tracking-tight text-white mb-6">
              {displayName}
            </div>
            <p className="mb-4">Empowering creators to bring their ideas to life.</p>
            <p>&copy; 2024 {displayName} Market.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Shop</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Graphics</a></li>
              <li><a href="#" className="hover:text-white">Fonts</a></li>
              <li><a href="#" className="hover:text-white">Templates</a></li>
              <li><a href="#" className="hover:text-white">Add-ons</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">License Agreement</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Social</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Instagram</a></li>
              <li><a href="#" className="hover:text-white">Pinterest</a></li>
              <li><a href="#" className="hover:text-white">Twitter</a></li>
              <li><a href="#" className="hover:text-white">Facebook</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
