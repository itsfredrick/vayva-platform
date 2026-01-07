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
    Package,
    Truck,
    ShieldCheck,
    Building,
    ArrowRight,
} from "lucide-react";
import { StorefrontSEO } from "./StorefrontSEO";
import { useCartQuery } from "@/hooks/storefront/useStorefrontQuery";

export function BulkTrade({
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
        primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#1d4ed8",
        heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "Reliable Sourcing for Global Trade.",
        heroDesc: configOverride?.heroDesc || store?.templateConfig?.heroDesc || "Connect with verified suppliers. Streamline procurement. Scale your business with our wholesale network.",
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

    useCartQuery(isCartOpen, setIsCartOpen);

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

            {/* Top Bar */}
            <div className="bg-blue-900 text-slate-300 py-2 px-6 text-xs font-medium flex justify-between items-center">
                <div className="flex gap-4">
                    <span>MOQ Applies</span>
                    <span>Intl. Logistics</span>
                </div>
                <div className="flex gap-4">
                    <a href="#" className="hover:text-white">Partner Login</a>
                    <a href="#" className="hover:text-white">Request Quote</a>
                </div>
            </div>

            {/* Navbar */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded flex items-center justify-center text-white" style={{ backgroundColor: config.primaryColor }}>
                            <Building className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-xl text-slate-900 tracking-tight">{displayName}</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
                        <a href="#" className="hover:text-blue-700">Catalog</a>
                        <a href="#" className="hover:text-blue-700">Industries</a>
                        <a href="#" className="hover:text-blue-700">Services</a>
                        <a href="#" className="hover:text-blue-700">About</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 text-sm font-bold text-slate-700"
                        >
                            Bulk Order
                        </button>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2 text-slate-600 hover:opacity-80 transition-opacity"
                        >
                            <ShoppingBag className="w-6 h-6" style={{ color: config.primaryColor }} />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center font-bold" style={{ backgroundColor: config.primaryColor }}>
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

            {/* Hero */}
            <header className="bg-white py-16 px-6 border-b border-slate-200">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                            Reliable Sourcing for <br /> <span style={{ color: config.primaryColor }}>Global Trade.</span>
                        </h1>
                        <p className="text-xl text-slate-500 mb-8 max-w-lg">
                            Connect with verified suppliers. Streamline procurement. Scale your business with our wholesale network.
                        </p>
                        <div className="flex gap-4">
                            <button className="px-8 py-3 text-white font-bold rounded-lg hover:opacity-90 transition-colors" style={{ backgroundColor: config.primaryColor }}>
                                View Catalog
                            </button>
                            <button className="px-8 py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:border-slate-300 transition-colors">
                                Contact Sales
                            </button>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 bg-slate-100 rounded-2xl p-8 grid grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <Package className="w-8 h-8 text-blue-600 mb-4" />
                            <h3 className="font-bold text-lg mb-1">Bulk Pricing</h3>
                            <p className="text-sm text-slate-500">Tiered discounts for high volume orders.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <Truck className="w-8 h-8 text-blue-600 mb-4" />
                            <h3 className="font-bold text-lg mb-1">Logistics</h3>
                            <p className="text-sm text-slate-500">Integrated shipping & customs clearance.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm col-span-2">
                            <ShieldCheck className="w-8 h-8 text-blue-600 mb-4" />
                            <h3 className="font-bold text-lg mb-1">Trade Assurance</h3>
                            <p className="text-sm text-slate-500">Payment protection and quality guarantees on every order.</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Product List */}
            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex justify-between items-end mb-10 border-b border-slate-200 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Featured Commodities</h2>
                        <p className="text-slate-500">Top rated products available for immediate shipment.</p>
                    </div>
                    <a href="#" className="text-blue-700 font-bold flex items-center gap-1 hover:underline">
                        View All <ArrowRight className="w-4 h-4" />
                    </a>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-slate-200 rounded animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {products.length > 0 ? products.map(product => (
                            <article key={product.id} className="bg-white border border-slate-200 p-4 rounded-lg hover:shadow-lg transition-shadow group">
                                <div className="bg-slate-100 aspect-square rounded mb-4 overflow-hidden relative">
                                    <Image
                                        src={product.image || `https://source.unsplash.com/random/400x400?industrial,${product.id}`}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                    {/* Placeholder Badge */}
                                    <div className="absolute top-2 left-2 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                                        IN STOCK
                                    </div>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">{product.name}</h3>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Min. Order: 50 Units</p>
                                        <div className="font-bold text-lg">₦{product.price.toLocaleString()}</div>
                                    </div>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="w-8 h-8 rounded flex items-center justify-center text-slate-600 hover:text-white transition-colors"
                                        style={{ backgroundColor: '#f1f5f9' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = config.primaryColor)}
                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                    </button>
                                </div>
                            </article>
                        )) : (
                            <div className="col-span-4 text-center py-20 bg-white border border-dashed border-slate-300 rounded-xl">
                                <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">No wholesale items listed yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-800 flex items-center justify-center rounded text-white font-bold">
                            <Building className="w-4 h-4" />
                        </div>
                        <span className="text-lg font-bold text-white">{displayName}</span>
                    </div>
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} {displayName} Wholesale. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
