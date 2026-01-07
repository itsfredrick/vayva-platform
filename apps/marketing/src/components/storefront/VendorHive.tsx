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
    Search,
    Store,
    Star,
    MapPin,
    Filter,
    ArrowUpRight,
} from "lucide-react";
import { StorefrontSEO } from "./StorefrontSEO";
import { useCartQuery, useSearchQuery } from "@/hooks/storefront/useStorefrontQuery";

export function VendorHive({
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
        primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#fbbf24", // amber-400
        heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "Support Independent Makers.",
        searchPlaceholder: configOverride?.searchPlaceholder || store?.templateConfig?.searchPlaceholder || "Search products, brands, and shops...",
        showHero: configOverride?.showHero ?? store?.templateConfig?.showHero ?? true,
    };
    const { products, isLoading } = useStorefrontProducts(storeSlug, {
        limit: 8,
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
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useCartQuery(isCartOpen, setIsCartOpen);
    useSearchQuery(searchTerm, setSearchTerm);

    const displayName = store?.name || initialStoreName;

    return (
        <div className="bg-neutral-50 min-h-screen font-sans text-neutral-900">
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
            <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-4">
                    <div className="flex items-center gap-2 md:gap-8">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-neutral-900"
                                style={{ backgroundColor: config.primaryColor }}
                            >
                                <Store className="w-4 h-4 text-neutral-900" />
                            </div>
                            <span className="font-black text-xl tracking-tight hidden md:block">{displayName}</span>
                        </div>

                        <div className="hidden md:flex relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-neutral-400" />
                            </div>
                            <input
                                type="text"
                                className="bg-neutral-100 block w-96 pl-10 pr-3 py-2 rounded-full border-0 text-sm focus:ring-2 focus:bg-white transition-all"
                                style={{ "--tw-ring-color": config.primaryColor } as any}
                                placeholder={config.searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="hidden md:flex items-center gap-1 text-sm font-bold hover:bg-neutral-100 px-3 py-2 rounded-lg transition-colors">
                            OPEN A SHOP <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <div className="h-6 w-px bg-neutral-200 hidden md:block"></div>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="flex items-center gap-2 font-bold hover:text-amber-600 transition-colors"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span>CART ({cart.length})</span>
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2"
                        >
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Categories / Navigation */}
            <div className="bg-white border-b border-neutral-200 py-3 overflow-x-auto">
                <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-neutral-500 min-w-max">
                    <a href="#" className="text-neutral-900 border-b-2 border-amber-400 pb-0.5">Editor's Picks</a>
                    <a href="#" className="hover:text-neutral-900 transition-colors">Fashion</a>
                    <a href="#" className="hover:text-neutral-900 transition-colors">Home & Living</a>
                    <a href="#" className="hover:text-neutral-900 transition-colors">Art & Collectibles</a>
                    <a href="#" className="hover:text-neutral-900 transition-colors">Craft Supplies</a>
                    <a href="#" className="hover:text-neutral-900 transition-colors">Vintage</a>
                </div>
            </div>

            {/* Hero */}
            <header className="bg-[#fcf8f3] border-b border-neutral-200">
                <div className="max-w-7xl mx-auto py-12 px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h1 className="text-5xl md:text-6xl font-black leading-none text-neutral-900">
                            {config.heroTitle.split(" ").slice(0, -1).join(" ")} <span style={{ backgroundColor: config.primaryColor }} className="px-2">{config.heroTitle.split(" ").slice(-1)}</span>
                        </h1>
                        <p className="text-lg text-neutral-600 max-w-md">
                            Discover unique goods from thousands of independent creators and vintage collectors around the world.
                        </p>
                        <button className="px-8 py-3 bg-neutral-900 text-white font-bold rounded-full hover:bg-neutral-800 transition-transform hover:-translate-y-1 shadow-xl shadow-neutral-200">
                            Shop Trending
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4 translate-y-8">
                            <div className="bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <div className="aspect-[4/5] bg-neutral-100 rounded-lg mb-3 overflow-hidden">
                                    <div className="relative w-full h-full">
                                        <Image src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=800&auto=format&fit=crop" className="object-cover" alt="Fashion" fill sizes="(max-width: 768px) 100vw, 50vw" />
                                    </div>
                                </div>
                                <div className="font-bold text-sm">Retro Finds</div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <div className="aspect-[4/5] bg-neutral-100 rounded-lg mb-3 overflow-hidden">
                                    <div className="relative w-full h-full">
                                        <Image src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop" className="object-cover" alt="Decor" fill sizes="(max-width: 768px) 100vw, 50vw" />
                                    </div>
                                </div>
                                <div className="font-bold text-sm">Handmade Jewelry</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Feed */}
            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black">Fresh from the Hive</h2>
                    <button className="flex items-center gap-2 text-sm font-bold bg-neutral-100 px-4 py-2 rounded-full hover:bg-neutral-200">
                        <Filter className="w-4 h-4" /> Filters
                    </button>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-80 bg-neutral-100 rounded-lg animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                        {products.length > 0 ? products.map(product => (
                            <article key={product.id} className="group cursor-pointer">
                                <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100 mb-3">
                                    <Image
                                        src={`https://source.unsplash.com/random/800x800?handmade,${product.id}`}
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(product);
                                        }}
                                        className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-neutral-900 hover:text-white"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                    </button>
                                </div>
                                <h3 className="font-bold text-sm truncate pr-4">{product.name}</h3>
                                <div className="flex items-center justify-between mt-1">
                                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                                        <Store className="w-3 h-3" />
                                        <span>The Crafty Corner</span>
                                    </div>
                                    <div className="font-medium">₦{product.price.toLocaleString()}</div>
                                </div>
                            </article>
                        )) : (
                            <div className="col-span-full py-24 text-center">
                                <p>No products found.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Featured Shops */}
            <section className="bg-neutral-900 text-white py-16 px-6 mb-12">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-black mb-8">Featured Sellers</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-neutral-800 p-6 rounded-xl hover:bg-neutral-700 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-amber-400 rounded-full"></div>
                                    <div>
                                        <div className="font-bold">Urban Vintage</div>
                                        <div className="text-xs text-neutral-400 flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                            4.9 (1.2k sales)
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="aspect-square bg-neutral-600 rounded-md"></div>
                                    <div className="aspect-square bg-neutral-600 rounded-md"></div>
                                    <div className="aspect-square bg-neutral-600 rounded-md"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-neutral-500">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-neutral-900 rounded-full flex items-center justify-center">
                        <Store className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-bold text-neutral-900">{displayName}</span>
                </div>
                <p>&copy; {new Date().getFullYear()} {displayName}</p>
            </footer>
        </div>
    );
}
