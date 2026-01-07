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
    Globe,
    Search,
    Users,
    Briefcase,
    Layers,
    CheckCircle,
    ArrowRight,
} from "lucide-react";
import { StorefrontSEO } from "./StorefrontSEO";

export function SupplierNetwork({
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
        limit: 8,
    });

    // Config Merging logic
    const config = {
        primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#4f46e5",
        heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "The World's Leading B2B Supplier Network",
        heroDesc: configOverride?.heroDesc || store?.templateConfig?.heroDesc || "Source high-quality components, negotiate contracts, and manage supply chains on one unified platform.",
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
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const displayName = store?.name || initialStoreName;

    return (
        <div className="bg-slate-900 min-h-screen font-sans text-slate-100">
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

            {/* Navbar */}
            <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: config.primaryColor, boxShadow: `0 10px 15px -3px ${config.primaryColor}33` }}>
                            <Layers className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-wide">{displayName}</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <a href="#" className="hover:text-white transition-colors">Suppliers</a>
                        <a href="#" className="hover:text-white transition-colors">Solutions</a>
                        <a href="#" className="hover:text-white transition-colors">Enterprise</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="hidden md:block px-5 py-2 border border-slate-700 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
                            Login
                        </button>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="px-5 py-2 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                            style={{ backgroundColor: config.primaryColor }}
                        >
                            <ShoppingBag className="w-4 h-4" />
                            <span className="hidden sm:inline">Order {cart.length > 0 && `(${cart.length})`}</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <header className="py-24 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 z-0"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent leading-tight">
                        {config.heroTitle}
                    </h1>
                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                        {config.heroDesc}
                    </p>

                    <div className="max-w-xl mx-auto bg-slate-800/50 backdrop-blur border border-slate-700 p-2 rounded-xl flex items-center gap-2 shadow-2xl">
                        <Search className="w-6 h-6 text-slate-500 ml-4" />
                        <input
                            type="text"
                            placeholder="Search for suppliers, products, or services..."
                            className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder:text-slate-500 h-10"
                        />
                        <button
                            className="px-6 py-2 text-white font-bold rounded-lg transition-colors"
                            style={{ backgroundColor: config.primaryColor }}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </header>

            {/* Network Stats */}
            <section className="bg-slate-800/30 border-y border-slate-800 py-12">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="flex items-center justify-center gap-2 mb-2 text-indigo-400">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div className="text-3xl font-bold mb-1">120+</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Countries</div>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-2 mb-2 text-indigo-400">
                            <Users className="w-5 h-5" />
                        </div>
                        <div className="text-3xl font-bold mb-1">50k+</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Suppliers</div>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-2 mb-2 text-indigo-400">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <div className="text-3xl font-bold mb-1">$2B+</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Volume Transacted</div>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-2 mb-2 text-indigo-400">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div className="text-3xl font-bold mb-1">99.9%</div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Service Uptime</div>
                    </div>
                </div>
            </section>

            {/* Product/Service Grid */}
            <main className="max-w-7xl mx-auto px-6 py-24">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-2xl font-bold">Featured Supplier Offerings</h2>
                    <a href="#" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium">
                        View Marketplace <ArrowRight className="w-4 h-4" />
                    </a>
                </div>

                {isLoading ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-800 rounded-xl animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.length > 0 ? products.map(product => (
                            <article key={product.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800 transition-colors group">
                                <div className="w-12 h-12 bg-slate-700 rounded-lg mb-6 flex items-center justify-center group-hover:bg-indigo-600/20 group-hover:text-indigo-400 transition-colors">
                                    <Layers className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-slate-100">{product.name}</h3>
                                <p className="text-sm text-slate-400 mb-6 h-10 overflow-hidden">{product.description || "Verified supplier offering premium grade components."}</p>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-700/50">
                                    <span className="font-bold font-mono text-indigo-300">₦{product.price.toLocaleString()}</span>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="text-xs font-bold text-white px-4 py-2 rounded-lg transition-colors"
                                        style={{ backgroundColor: '#334155' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = config.primaryColor)}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#334155')}
                                    >
                                        Add to PO
                                    </button>
                                </div>
                            </article>
                        )) : (
                            <div className="col-span-full py-24 text-center border border-dashed border-slate-700 rounded-2xl bg-slate-800/30">
                                <p className="text-slate-500">No active listings available.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <footer className="border-t border-slate-800 bg-slate-900 py-12 px-6 text-center text-slate-500 text-sm">
                <p>Powered by {displayName} Network Solution.</p>
            </footer>
        </div>
    );
}
