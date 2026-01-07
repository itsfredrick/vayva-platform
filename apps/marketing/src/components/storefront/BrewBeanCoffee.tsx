import React, { useState } from "react";
import {
    useStorefrontProducts,
    useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { StorefrontCart } from "./StorefrontCart";
import { Coffee, MapPin, Clock, ShoppingBag } from "lucide-react";
import { StorefrontSEO } from "./StorefrontSEO";
import Image from "next/image";
import { useCartQuery } from "@/hooks/storefront/useStorefrontQuery";

export function BrewBeanCoffee({
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
        primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#6F4E37", // Coffee Brown
        heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "Morning Rituals.",
        heroSubtitle: configOverride?.heroSubtitle || store?.templateConfig?.heroSubtitle || "Roasted Fresh Daily",
        heroDesc: configOverride?.heroDesc || store?.templateConfig?.heroDesc || "Hand-crafted espresso drinks and fresh pastries to start your day right. Order online and skip the line.",
    };
    const { products, isLoading } = useStorefrontProducts(storeSlug, {
        limit: 12,
    });

    const {
        cart,
        addToCart,
        isOpen: isCartOpen,
        setIsOpen: setIsCartOpen,
        clearCart,
    } = useStorefrontCart(storeSlug || "");

    useCartQuery(isCartOpen, setIsCartOpen);

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const displayName = store?.name || initialStoreName;
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#2C241B] font-serif selection:bg-[#6F4E37] selection:text-white">
            <StorefrontSEO store={store} products={products} />
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                total={total}
                storeSlug={storeSlug || ""}
                onSuccess={clearCart}
            />

            <StorefrontCart
                storeSlug={storeSlug || ""}
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onCheckout={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                }}
            />

            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#2C241B]/10">
                <div className="px-6 py-6 flex justify-between items-center max-w-6xl mx-auto">
                    <div className="flex items-center gap-2">
                        <div className="bg-[#2C241B] p-2 rounded-full text-white">
                            <Coffee className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">{displayName}</span>
                    </div>
                    <button
                        onClick={() => setIsCartOpen(true)}
                        aria-label="Open cart"
                        className="relative p-2 hover:bg-[#EBE5D9] rounded-full transition-colors"
                    >
                        <ShoppingBag className="w-6 h-6" aria-hidden="true" />
                        {cart.length > 0 && (
                            <span className="absolute top-0 right-0 w-4 h-4 bg-[#6F4E37] text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                                {cart.length}
                            </span>
                        )}
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <header className="relative min-h-[80vh] flex items-center bg-[#2C241B] text-[#FDFBF7] overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=1000"
                        className="object-cover opacity-30"
                        fill
                        priority
                        alt="Coffee Pour"
                    />
                </div>
                <div className="relative z-10 px-6 py-12 md:py-20 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="font-bold text-sm tracking-widest uppercase mb-4 block" style={{ color: config.primaryColor }}>
                            {config.heroSubtitle}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            {config.heroTitle}
                        </h1>
                        <p className="text-lg text-[#FDFBF7]/80 mb-8 leading-relaxed max-w-md">
                            {config.heroDesc}
                        </p>
                        <button
                            onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                            className="text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                            style={{ backgroundColor: config.primaryColor }}
                        >
                            Order Now
                        </button>
                    </div>
                    <div className="relative aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl rotate-2">
                        <Image
                            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=1000"
                            className="object-cover"
                            fill
                            priority
                            alt="Coffee Pour"
                        />
                    </div>
                </div>
            </header>

            {/* Story / About */}
            <section className="bg-[#EBE5D9] py-24 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-around gap-12 text-center md:text-left">
                    <div className="flex items-center gap-4 justify-center md:justify-start">
                        <Clock className="w-6 h-6 text-[#6F4E37]" />
                        <div>
                            <div className="font-bold text-sm">Open Daily</div>
                            <div className="text-[#2C241B]/80 text-sm">7:00 AM - 7:00 PM</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 justify-center md:justify-start">
                        <MapPin className="w-6 h-6 text-[#6F4E37]" />
                        <div>
                            <div className="font-bold text-sm">Downtown</div>
                            <div className="text-[#2C241B]/80 text-sm">123 Main St, City Center</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Products */}
            <main id="menu" className="py-24 px-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-12 text-center">Current Menu</h2>

                {isLoading ? (
                    <div className="text-center py-20 text-[#2C241B]/70">Brewing menu...</div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-[#EBE5D9] rounded-xl">
                        <p className="text-[#2C241B]/70">Menu is currently being updated.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {products.map((product) => (
                            <div key={product.id} className="group cursor-pointer">
                                <div className="aspect-square bg-white rounded-2xl mb-4 overflow-hidden relative shadow-sm group-hover:shadow-md transition-shadow">
                                    <Image
                                        src={product.image || `https://via.placeholder.com/300?text=${encodeURIComponent(product.name)}`}
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(product);
                                        }}
                                        className="absolute bottom-3 right-3 bg-white w-10 h-10 rounded-full shadow flex items-center justify-center text-[#2C241B] hover:bg-[#6F4E37] hover:text-white transition-colors"
                                    >
                                        <PlusIcon />
                                    </button>
                                </div>
                                <h3 className="font-bold text-lg leading-tight mb-1">{product.name}</h3>
                                <p className="text-[#2C241B]/70 text-sm line-clamp-1 mb-2">{product.description}</p>
                                <div className="font-bold text-[#6F4E37]">₦{product.price.toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <footer className="bg-[#2C241B] text-[#FDFBF7]/60 py-24 px-6 text-center">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Coffee className="w-6 h-6" />
                        <span className="font-bold text-xl">{displayName}</span>
                    </div>
                    <p className="text-sm opacity-60">© 2024 {displayName}. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

function PlusIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
    )
}
