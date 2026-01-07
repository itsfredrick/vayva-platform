import React, { useState } from "react";
import Image from "next/image";
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
    Phone,
    Mail,
    User,
    Home,
    MapPin,
    ArrowRight,
} from "lucide-react";
import { StorefrontSEO } from "./StorefrontSEO";
import { useCartQuery } from "@/hooks/storefront/useStorefrontQuery";

export function AgentPortfolio({
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
        heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "Helping you find home.",
        heroDesc: configOverride?.heroDesc || store?.templateConfig?.heroDesc || "Top-rated real estate distributor specializing in residential and commercial properties.",
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

            <StorefrontCart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                storeSlug={storeSlug || ""}
                onCheckout={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                }}
            />

            {/* Header / Profile */}
            <header className="bg-white px-6 pt-12 pb-24 relative overflow-hidden">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="w-48 h-48 bg-slate-200 rounded-full overflow-hidden border-4 border-white shadow-xl shrink-0 relative">
                        <Image
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop"
                            className="object-cover"
                            alt="Agent Profile"
                            fill
                            sizes="192px"
                        />
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">{displayName}</h1>
                        <p className="text-xl text-slate-500 mb-8 max-w-lg">
                            {config.heroDesc} {config.heroTitle}
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <a
                                href="#"
                                className="flex items-center gap-2 px-6 py-3 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: config.primaryColor }}
                            >
                                <Phone className="w-4 h-4" /> Contact Me
                            </a>
                            <a href="#" className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors">
                                <Mail className="w-4 h-4" /> Email
                            </a>
                        </div>
                    </div>
                </div>

                <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-100 skew-x-12 translate-x-20 z-0"></div>

                {/* Cart Trigger */}
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="absolute top-6 right-6 md:right-12 z-20 flex items-center gap-2 p-3 bg-white rounded-full shadow-lg hover:scale-105 transition-transform"
                >
                    <ShoppingBag className="w-5 h-5" style={{ color: config.primaryColor }} />
                    {cart.length > 0 && <span className="font-bold text-sm px-2 py-0.5 rounded-full" style={{ backgroundColor: `${config.primaryColor}20`, color: config.primaryColor }}>{cart.length}</span>}
                </button>
            </header>

            {/* Active Listings Grid */}
            <main className="max-w-6xl mx-auto px-6 -mt-12 relative z-20 mb-24">
                <div className="text-white rounded-t-2xl p-6 flex justify-between items-center" style={{ backgroundColor: config.primaryColor }}>
                    <h2 className="text-xl font-bold flex items-center gap-2"><Home className="w-5 h-5 opacity-70" /> Featured Listings</h2>
                    <span className="text-sm opacity-70">Updated today</span>
                </div>
                <div className="bg-white rounded-b-2xl shadow-xl p-8 border border-t-0 border-slate-100">
                    {isLoading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-lg animate-pulse"></div>)}
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                            {products.length > 0 ? products.map(product => (
                                <article key={product.id} className="flex flex-col group">
                                    <div className="relative aspect-video rounded-xl bg-slate-200 overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                                        <Image
                                            src={`https://source.unsplash.com/random/800x600?apartment,${product.id}`}
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
                                            <div className="text-white font-bold text-lg" style={{ color: '#fff' }}>₦{product.price.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg mb-1 leading-tight">{product.name}</h3>
                                    <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                                        <MapPin className="w-4 h-4" /> Lekki Phase 1, Lagos
                                    </div>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="mt-auto py-3 bg-slate-100 text-slate-700 font-bold rounded-lg hover:text-white transition-colors flex items-center justify-center gap-2"
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = config.primaryColor}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                    >
                                        Inquire <ArrowRight className="w-4 h-4" />
                                    </button>
                                </article>
                            )) : (
                                <div className="col-span-full py-12 text-center">
                                    <p className="text-slate-400">No active property listings.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <footer className="text-center py-12 text-slate-400 text-sm">
                <p>© {new Date().getFullYear()} {displayName}. All rights reserved.</p>
            </footer>
        </div>
    );
}
