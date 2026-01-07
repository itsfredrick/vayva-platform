import React, { useState, useMemo, useEffect } from "react";
import {
  useStorefrontProducts,
  useStorefrontStore,
  type ProductData,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { StorefrontCart } from "./StorefrontCart";
import { QuickViewModal } from "./QuickViewModal";
import { ShoppingBag, Star, Clock, MapPin, X, Plus, Minus, ChefHat, Info, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { StorefrontSEO } from "./StorefrontSEO";

export function GourmetDiningFood({
  storeName: initialStoreName,
  storeSlug,
  basePath,
  config: configOverride,
}: {
  storeName: string;
  storeSlug?: string;
  basePath?: string;
  config?: any;
}) {
  const { store } = useStorefrontStore(storeSlug);

  // Configuration Merging
  const config = {
    primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#d4af37", // Gold
    heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || initialStoreName,
    heroSubtitle: configOverride?.heroSubtitle || store?.templateConfig?.heroSubtitle || "Fine Dining Experience",
    heroDesc: configOverride?.heroDesc || store?.templateConfig?.heroDesc || "A culinary journey through contemporary flavors and traditional techniques. Join us for a moment of pure gastronomy.",
  };

  const displayName = initialStoreName;
  const { products, isLoading } = useStorefrontProducts(storeSlug);
  const [activeSection, setActiveSection] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);

  const menuSections = useMemo(() => {
    if (!products || products.length === 0) return {};
    const sections: Record<string, ProductData[]> = {};
    products.forEach((product) => {
      const category = product.category || "Main Course";
      if (!sections[category]) {
        sections[category] = [];
      }
      sections[category].push(product);
    });
    return sections;
  }, [products]);

  useEffect(() => {
    if (Object.keys(menuSections).length > 0 && !activeSection) {
      setActiveSection(Object.keys(menuSections)[0]);
    }
  }, [menuSections, activeSection]);

  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Reservation request sent! We will confirm shortly.");
  };

  return (
    <div className="bg-[#121212] min-h-screen text-white/90 selection:bg-[#d4af37] selection:text-black">
      <StorefrontSEO store={store} products={products} />
      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10 }}
            className="w-full h-full relative"
          >
            <Image
              src="https://images.unsplash.com/photo-1514362545857-3bc16549766b?q=80&w=2670&auto=format&fit=crop"
              alt="Fine Dining"
              className="object-cover brightness-[0.4]"
              fill
              priority
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-transparent to-black/60"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-sm md:text-base font-sans tracking-[0.3em] uppercase mb-6"
            style={{ color: config.primaryColor }}
          >
            {config.heroSubtitle}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-9xl font-bold mb-8 tracking-tight"
          >
            {config.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="max-w-xl mx-auto text-gray-400 mb-12 font-sans font-light leading-relaxed"
          >
            {config.heroDesc}
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
            className="border border-white/20 px-10 py-4 text-xs font-sans font-bold tracking-[0.2em] uppercase transition-all bg-white/5 backdrop-blur-md"
            style={{ borderColor: `${config.primaryColor}33`, color: config.primaryColor }}
          >
            View Menu
          </motion.button>
        </div>
      </header >

      {/* Info Metrics */}
      <section className="bg-[#161616] border-y border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-center font-sans">
          <div className="flex flex-col items-center group cursor-default">
            <div className="text-[#d4af37] mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-2 text-gray-300">Opening Hours</h3>
            <p className="text-gray-500 text-sm">Mon-Sun: 17:00 - 23:00</p>
          </div>
          <div className="flex flex-col items-center group cursor-default">
            <div className="text-[#d4af37] mb-4 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-2 text-gray-300">Location</h3>
            <p className="text-gray-500 text-sm">Victoria Island, Lagos</p>
          </div>
          <div className="flex flex-col items-center group cursor-default">
            <div className="text-[#d4af37] mb-4 group-hover:scale-110 transition-transform">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-2 text-gray-300">Michelin Guide</h3>
            <p className="text-gray-500 text-sm">2024 Selection</p>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      < section id="menu" className="py-24 max-w-7xl mx-auto px-4 relative" >
        <div className="text-center mb-20">
          <span className="text-[#d4af37] font-sans text-xs tracking-[0.2em] uppercase block mb-4">Our Selection</span>
          <h2 className="text-4xl md:text-5xl font-bold">Seasonal Menu</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 relative">
          {/* Sticky Side Nav */}
          <aside className="hidden lg:block w-48 shrink-0 sticky top-32 self-start">
            <div className="space-y-4 border-l border-white/10 pl-6">
              {Object.keys(menuSections).map((cat) => (
                <button
                  key={cat}
                  onClick={() => document.getElementById(cat)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className={`block text-sm font-sans tracking-widest uppercase text-left transition-colors ${activeSection === cat ? 'text-[#d4af37] font-bold pl-2 border-l-2 border-[#d4af37] -ml-[25px]' : 'text-gray-500 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </aside>

          <div className="flex-1 space-y-32">
            {isLoading && products.length === 0 ? (
              <div className="text-center text-gray-500 py-12">Preparing menu...</div>
            ) : (
              Object.entries(menuSections).map(([category, items]) => (
                <div key={category} id={category} className="scroll-mt-32">
                  <h3 className="text-3xl font-serif text-[#d4af37] mb-12 flex items-center gap-4">
                    {category}
                    <span className="h-px bg-white/10 flex-1"></span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
                    {items.map((dish) => (
                      <article key={dish.id}>
                        <Link
                          href={`${basePath || ""}/products/${dish.id}`}
                          className="group cursor-pointer block"
                        >
                          <div className="flex justify-between items-baseline mb-2">
                            <h4 className="text-xl font-bold text-gray-200 group-hover:text-[#d4af37] transition-colors">{dish.name}</h4>
                            <div className="flex-1 mx-4 border-b border-white/10 border-dotted h-1 opacity-30"></div>
                            <span className="text-lg font-mono text-[#d4af37]">₦{dish.price.toLocaleString()}</span>
                          </div>
                          <p className="text-gray-500 text-sm italic mb-4 line-clamp-2">{dish.description}</p>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedProduct(dish);
                            }}
                            className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#d4af37] hover:text-white transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-2"
                          >
                            <Eye className="w-3 h-3" /> Quick View
                          </button>
                        </Link>
                      </article>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section >

      {/* Reservation / CTA */}
      < section id="reservations" className="py-24 bg-[#161616] mt-24 relative overflow-hidden" >
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#d4af37]/5 skew-x-12 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 text-[#d4af37]">Reservations</h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">Book your table for an unforgettable evening.</p>
          <form onSubmit={handleReservation} className="flex flex-col md:flex-row gap-4 justify-center">
            <input type="date" required className="bg-[#1c1c1c] border border-white/10 text-white px-6 py-4 focus:border-[#d4af37] outline-none min-w-[200px]" />
            <select className="bg-[#1c1c1c] border border-white/10 text-white px-6 py-4 focus:border-[#d4af37] outline-none min-w-[200px]">
              <option>2 Guests</option>
              <option>4 Guests</option>
              <option>6 Guests</option>
              <option>8 Guests</option>
            </select>
            <button type="submit" className="bg-[#d4af37] text-black px-10 py-4 font-bold font-sans tracking-widest uppercase hover:bg-white transition-colors shadow-lg shadow-[#d4af37]/20">
              Find Table
            </button>
          </form>
        </div>
      </section >

      <footer className="py-12 text-center text-gray-600 text-xs font-sans tracking-widest uppercase border-t border-white/5 bg-[#121212]">
        <p>&copy; 2024 {displayName}. All rights reserved.</p>
      </footer>
    </div >
  );
}
