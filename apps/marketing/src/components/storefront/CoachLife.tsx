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
    PlayCircle,
    Award,
    BookOpen,
    ArrowRight,
    Star,
    Check,
} from "lucide-react";
import { StorefrontSEO } from "./StorefrontSEO";
import { useCartQuery } from "@/hooks/storefront/useStorefrontQuery";

export function CoachLife({
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
        limit: 6,
    });

    // Config Merging logic
    const config = {
        primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#4f46e5",
        heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "Unlock Your True Potential",
        heroDesc: configOverride?.heroDesc || store?.templateConfig?.heroDesc || "Personalized coaching programs designed to help you crush your goals, build confidence, and live a life you love.",
        accentColor: configOverride?.accentColor || store?.templateConfig?.accentColor || "#eef2ff",
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const displayName = store?.name || initialStoreName;

    // Helper to format title with highlighted span
    const formatHeroTitle = (title: string) => {
        const parts = title.split(' ');
        if (parts.length > 2) {
            const lastTwo = parts.slice(-2).join(' ');
            const remaining = parts.slice(0, -2).join(' ');
            return (
                <>
                    {remaining} <span style={{ color: config.primaryColor }}>{lastTwo}</span>
                </>
            );
        }
        return title;
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
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
            <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <h1 className="text-2xl font-black tracking-tighter" style={{ color: config.primaryColor }}>
                        {displayName}
                    </h1>

                    <div className="hidden md:flex items-center gap-8 font-medium">
                        <a href="#" className="hover:opacity-80 transition-opacity" style={{ color: config.primaryColor }}>Programs</a>
                        <a href="#" className="hover:text-slate-600 transition-colors">About</a>
                        <a href="#" className="hover:text-slate-600 transition-colors">Testimonials</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2 text-slate-600 hover:opacity-80 transition-opacity"
                        >
                            <ShoppingBag className="w-6 h-6" style={{ color: config.primaryColor }} />
                            {cart.length > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-slate-600"
                        >
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Shared Cart */}
            <StorefrontCart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                storeSlug={storeSlug || ""}
                onCheckout={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                }}
            />

            {/* Hero */}
            <header className="bg-white py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div
                        className="inline-block px-4 py-1.5 font-bold rounded-full text-sm mb-8"
                        style={{ backgroundColor: config.accentColor, color: config.primaryColor }}
                    >
                        Typically replies within 2 hours
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-slate-900 leading-none">
                        {formatHeroTitle(config.heroTitle)}
                    </h1>
                    <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                        {config.heroDesc}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg"
                            style={{ backgroundColor: config.primaryColor }}
                        >
                            View Programs
                        </button>
                        <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                            <PlayCircle className="w-5 h-5" /> Watch Intro
                        </button>
                    </div>
                </div>
            </header>

            <section className="bg-slate-900 py-12 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 text-slate-400 font-medium">
                    <div className="flex items-center gap-2">
                        <Check className="w-5 h-5" style={{ color: config.primaryColor }} /> 500+ Clients Coached
                    </div>
                    <div className="flex items-center gap-2">
                        <Check className="w-5 h-5" style={{ color: config.primaryColor }} /> Featured in Forbes
                    </div>
                    <div className="flex items-center gap-2">
                        <Check className="w-5 h-5" style={{ color: config.primaryColor }} /> Certified ICF Coach
                    </div>
                </div>
            </section>

            {/* Programs Grid */}
            <main id="programs" className="py-24 px-6 max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-16 text-center">Available Coaching Programs</h2>

                {isLoading ? (
                    <div className="text-center text-slate-400">Loading programs...</div>
                ) : products.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map(product => (
                            <article key={product.id} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                                <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: config.accentColor, color: config.primaryColor }}>
                                    <Star className="w-6 h-6 fill-current" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{product.name}</h3>
                                <p className="text-slate-500 mb-6 text-sm flex-grow">
                                    {product.description || "Take your skills to the next level with this intensive coaching session."}
                                </p>
                                <div className="mt-auto">
                                    <div className="text-3xl font-bold mb-6">
                                        ₦{product.price.toLocaleString()}
                                    </div>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 group"
                                    >
                                        Book Session <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium">Coaching slots opening soon.</p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white py-12 border-t border-slate-100 text-center">
                <h3 className="text-xl font-black mb-4" style={{ color: config.primaryColor }}>{displayName}</h3>
                <p className="text-slate-400 text-sm">© {new Date().getFullYear()} {displayName}. All rights reserved.</p>
            </footer>

        </div>
    );
}
