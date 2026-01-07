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
    Menu,
    X,
    Ticket,
    Calendar,
    MapPin,
    Music,
    Wine,
    Users,
} from "lucide-react";
import { StorefrontSEO } from "./StorefrontSEO";
import { useCartQuery } from "@/hooks/storefront/useStorefrontQuery";

export function CharityGala({
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
        primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#FBBF24", // Amber 400
        heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "A Night to Remember",
        heroSubtitle: configOverride?.heroSubtitle || store?.templateConfig?.heroSubtitle || "Annual Charity Gala",
    };
    const { products, isLoading } = useStorefrontProducts(storeSlug, {
        limit: 4,
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const displayName = store?.name || initialStoreName;

    return (
        <div className="bg-[#1a0b2e] min-h-screen font-serif text-white">
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
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                storeSlug={storeSlug || ""}
                onCheckout={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                }}
            />

            {/* Decorative bg */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500 via-[#1a0b2e] to-[#1a0b2e]"></div>

            {/* Navbar */}
            <nav className="relative z-50 p-6 flex items-center justify-between">
                <div className="text-2xl font-black tracking-widest uppercase bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
                    {displayName}
                </div>
                <div className="flex items-center gap-4">
                    <a href="#tickets" className="hidden md:block px-6 py-2 border text-amber-200 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-amber-500/10 transition-colors" style={{ borderColor: `${config.primaryColor}80` }}>
                        Sponsorships
                    </a>
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="text-[#1a0b2e] px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: config.primaryColor }}
                    >
                        My Tickets {cart.length > 0 && `(${cart.length})`}
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <header className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
                <div className="mb-4 text-sm font-bold tracking-[0.3em] uppercase" style={{ color: config.primaryColor }}>{config.heroSubtitle}</div>
                <h1 className="text-5xl md:text-8xl font-black mb-8 leading-none bg-gradient-to-br from-white via-purple-100 to-purple-400 bg-clip-text text-transparent">
                    {config.heroTitle.split(" ").length > 2 ? (
                        <>
                            {config.heroTitle.split(" ").slice(0, 2).join(" ")} <br />
                            {config.heroTitle.split(" ").slice(2).join(" ")}
                        </>
                    ) : config.heroTitle}
                </h1>
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 text-lg font-sans text-purple-200 mb-12">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-amber-400" />
                        <span>December 14th, 2024</span>
                    </div>
                    <div className="h-1 w-1 bg-amber-400 rounded-full hidden md:block"></div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-amber-400" />
                        <span>The Grand Ballroom</span>
                    </div>
                </div>
                <button
                    onClick={() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-10 py-4 bg-white text-[#1a0b2e] font-bold rounded-full text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                    Reserve Your Table
                </button>
            </header>

            {/* Highlights */}
            <section className="relative z-10 py-12 border-y border-white/5 bg-white/5 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
                    <div>
                        <Music className="w-8 h-8 mx-auto mb-4" style={{ color: config.primaryColor }} />
                        <h3 className="font-bold text-lg mb-2">Live Jazz</h3>
                        <p className="text-sm text-purple-200">Featuring the Metro Orchestra</p>
                    </div>
                    <div>
                        <Wine className="w-8 h-8 mx-auto mb-4" style={{ color: config.primaryColor }} />
                        <h3 className="font-bold text-lg mb-2">Premium Dining</h3>
                        <p className="text-sm text-purple-200">3-Course Gourmet Experience</p>
                    </div>
                    <div>
                        <Users className="w-8 h-8 mx-auto mb-4" style={{ color: config.primaryColor }} />
                        <h3 className="font-bold text-lg mb-2">Elite Networking</h3>
                        <p className="text-sm text-purple-200">Connect with Industry Leaders</p>
                    </div>
                </div>
            </section>

            {/* Tickets */}
            <main id="tickets" className="relative z-10 max-w-5xl mx-auto px-6 py-24">
                <h2 className="text-3xl font-bold text-center mb-16">Select Your Pass</h2>

                {isLoading ? (
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="h-64 bg-white/5 rounded-2xl animate-pulse"></div>
                        <div className="h-64 bg-white/5 rounded-2xl animate-pulse"></div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {products.length > 0 ? products.map(product => (
                            <article key={product.id} className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-8 rounded-2xl hover:border-amber-400/50 transition-colors group">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                                        <p className="text-sm text-purple-200">{product.description}</p>
                                    </div>
                                    <Ticket className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: config.primaryColor }} />
                                </div>
                                <div className="text-4xl font-bold mb-8 font-sans" style={{ color: `${config.primaryColor}cc` }}>
                                    ₦{product.price.toLocaleString()}
                                </div>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-full py-4 border border-white/20 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-[#1a0b2e] transition-colors"
                                >
                                    Purchase Ticket
                                </button>
                            </article>
                        )) : (
                            <div className="col-span-2 text-center py-12 border border-dashed border-white/10 rounded-2xl">
                                <p className="text-purple-300">Tickets released soon.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <footer className="relative z-10 text-center py-12 text-purple-300/40 text-xs uppercase tracking-widest">
                Benefitting {displayName} Foundation
            </footer>
        </div>
    );
}
