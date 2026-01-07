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
    Play,
    Clock,
    BarChart,
    Users,
    Search,
    Filter,
    Star,
} from "lucide-react";
import { StorefrontSEO } from "./StorefrontSEO";
import { useCartQuery, useSearchQuery } from "@/hooks/storefront/useStorefrontQuery";

export function WorkshopHub({
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
        primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#ea580c",
        heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "Master Product Design in 4 Weeks",
        heroDesc: configOverride?.heroDesc || store?.templateConfig?.heroDesc || "A comprehensive guide to building beautiful, functional user interfaces. Includes 20h of video and live mentorship.",
        accentColor: configOverride?.accentColor || store?.templateConfig?.accentColor || "#9333ea",
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
    const [searchQuery, setSearchQuery] = useState("");

    useCartQuery(isCartOpen, setIsCartOpen);
    useSearchQuery(searchQuery, setSearchQuery);

    const displayName = store?.name || initialStoreName;
    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
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
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <span className="font-extrabold text-xl bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${config.primaryColor}, ${config.accentColor})` }}>
                            {displayName}
                        </span>
                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                            <a href="#" className="hover:text-orange-600">Browse</a>
                            <a href="#" className="hover:text-orange-600">Instructors</a>
                            <a href="#" className="hover:text-orange-600">Enterprise</a>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search workshops..."
                                className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2 text-gray-600 hover:opacity-80 transition-opacity"
                        >
                            <ShoppingBag className="w-5 h-5" style={{ color: config.primaryColor }} />
                            {cart.length > 0 && (
                                <span
                                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center font-bold"
                                    style={{ backgroundColor: config.primaryColor }}
                                >
                                    {cart.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Featured Header */}
            <header className="bg-gray-900 text-white py-16 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-purple-600/20"></div>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="flex-1">
                        <div className="inline-block px-3 py-1 text-xs font-bold rounded mb-6 uppercase tracking-wider" style={{ backgroundColor: `${config.primaryColor}20`, color: config.primaryColor }}>
                            New Workshop Added
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">{config.heroTitle}</h1>
                        <p className="text-xl text-gray-300 mb-8 max-w-xl">
                            {config.heroDesc}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-400 mb-8">
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 4 Weeks</span>
                            <span className="flex items-center gap-1"><BarChart className="w-4 h-4" /> Intermediate</span>
                            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 2.5k Students</span>
                        </div>
                        <button
                            className="px-8 py-3 text-gray-900 font-bold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
                            style={{ backgroundColor: '#fff' }}
                        >
                            Explore Course
                        </button>
                    </div>

                    {/* Preview Card */}
                    <div className="w-full md:w-96 bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                        <div className="h-48 bg-gray-700 flex items-center justify-center relative group cursor-pointer">
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
                                <Play className="w-6 h-6 fill-white text-white ml-1" />
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                                <div>
                                    <div className="font-bold text-sm">Sarah Johnson</div>
                                    <div className="text-xs text-gray-400">Head of Design</div>
                                </div>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full w-2/3 bg-orange-500"></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-2">
                                <span>Progress</span>
                                <span>65%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Search (Mobile) */}
            <div className="md:hidden px-6 py-4 bg-white border-b border-gray-200">
                <input
                    type="text"
                    placeholder="Search workshops..."
                    className="w-full px-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Course List */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">Trending Workshops</h2>
                    <button className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                </div>

                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white h-80 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <article key={product.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow group">
                                <div className="h-48 bg-gray-200 relative">
                                    <Image
                                        src={`https://source.unsplash.com/random/800x600?tech,${product.id}`} // Placeholder magic
                                        className="object-cover"
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">{product.name}</h3>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                                            <Star className="w-3 h-3 fill-current" style={{ color: config.primaryColor }} /> 4.9
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold">₦{product.price.toLocaleString()}</span>
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="w-8 h-8 rounded-full text-white flex items-center justify-center hover:opacity-80 transition-opacity"
                                                style={{ backgroundColor: config.primaryColor }}
                                            >
                                                <ShoppingBag className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>

            <footer className="bg-white border-t border-gray-200 py-12 px-6 mt-12">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <span className="font-extrabold text-xl text-gray-900">{displayName}</span>
                    <div className="text-sm text-gray-500">
                        Powered by {displayName} LMS
                    </div>
                </div>
            </footer>
        </div>
    );
}
