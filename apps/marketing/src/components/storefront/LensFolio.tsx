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
    Aperture,
    Download,
    Image as ImageIcon,
    Layers,
    ArrowRight,
    Camera,
    Heart,
    Share2,
} from "lucide-react";
import { StorefrontSEO } from "./StorefrontSEO";
import { useCartQuery } from "@/hooks/storefront/useStorefrontQuery";

export function LensFolio({
    storeName: initialStoreName,
    storeSlug,
}: {
    storeName: string;
    storeSlug?: string;
}) {
    const { store } = useStorefrontStore(storeSlug);
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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const displayName = store?.name || initialStoreName;

    return (
        <div className="bg-zinc-950 min-h-screen font-sans text-zinc-300 selection:bg-orange-500 selection:text-white">
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
            <nav className="fixed w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900">
                <div className="max-w-[1800px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-600 rounded flex items-center justify-center text-white">
                            <Aperture className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-xl tracking-wide text-white font-mono uppercase">
                            {displayName}
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-10 text-xs font-bold uppercase tracking-widest text-zinc-500">
                        <a href="#" className="hover:text-orange-500 transition-colors">Presets</a>
                        <a href="#" className="hover:text-orange-500 transition-colors">Mockups</a>
                        <a href="#" className="hover:text-orange-500 transition-colors">Textures</a>
                        <a href="#" className="hover:text-orange-500 transition-colors">LUTs</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            className="relative p-2 hover:bg-zinc-900 rounded-lg transition-colors text-zinc-400 hover:text-white group"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                        <button
                            className="md:hidden p-2 text-zinc-400"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-zinc-950 pt-24 px-6 md:hidden animate-in fade-in slide-in-from-top-10">
                    <div className="flex flex-col gap-6 text-xl font-mono uppercase tracking-widest text-zinc-500">
                        <a href="#" className="py-2 border-b border-zinc-900 hover:text-white">Presets</a>
                        <a href="#" className="py-2 border-b border-zinc-900 hover:text-white">Mockups</a>
                        <a href="#" className="py-2 border-b border-zinc-900 hover:text-white">Textures</a>
                        <a href="#" className="py-2 border-b border-zinc-900 hover:text-white">LUTs</a>
                    </div>
                </div>
            )}

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

            {/* Hero Section */}
            <header className="pt-32 pb-24 px-6 max-w-[1800px] mx-auto">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7">
                        <div className="inline-block px-3 py-1 bg-zinc-900 text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em] rounded mb-8 border border-zinc-800">
                            Digital Assets for Creators
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 tracking-tight leading-none">
                            Elevate Your <br />
                            <span className="text-orange-600">Visual Vision.</span>
                        </h1>
                        <p className="text-xl text-zinc-500 mb-12 max-w-xl font-light leading-relaxed">
                            A curated collection of professional Lightroom presets, Photoshop actions, and high-res textures. Download instantly. Use forever.
                        </p>
                        <div className="flex gap-4">
                            <button
                                className="px-8 py-4 bg-white text-zinc-950 font-bold uppercase tracking-widest text-xs hover:bg-orange-500 hover:text-white transition-colors"
                                onClick={() => {
                                    document.getElementById('assets')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                Browse Assets
                            </button>
                            <button className="px-8 py-4 bg-transparent border border-zinc-800 text-white font-bold uppercase tracking-widest text-xs hover:border-white transition-colors">
                                View Portfolio
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative">
                        <div className="aspect-[4/5] bg-zinc-900 rounded-lg overflow-hidden relative group">
                            <Image
                                src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop"
                                alt="Photography Portfolio"
                                fill
                                priority
                                className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700 grayscale group-hover:grayscale-0"
                                sizes="(max-width: 1024px) 100vw, 40vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white">
                                <div className="font-mono text-xs text-orange-500 mb-2 uppercase">Featured Pack</div>
                                <div className="text-2xl font-bold">Cinematic Urban Tones</div>
                            </div>
                        </div>
                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-center text-xs uppercase tracking-widest animate-pulse hidden md:flex">
                            New <br /> Arrival
                        </div>
                    </div>
                </div>
            </header>

            {/* Categories / Stats */}
            <section className="border-y border-zinc-900 bg-zinc-950/50">
                <div className="max-w-[1800px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-zinc-900">
                    <div className="p-8 text-center hover:bg-zinc-900/50 transition-colors cursor-pointer group">
                        <ImageIcon className="w-8 h-8 mx-auto mb-4 text-zinc-600 group-hover:text-white transition-colors" />
                        <div className="font-mono text-sm uppercase tracking-widest text-zinc-500 group-hover:text-orange-500">Presets</div>
                    </div>
                    <div className="p-8 text-center hover:bg-zinc-900/50 transition-colors cursor-pointer group">
                        <Layers className="w-8 h-8 mx-auto mb-4 text-zinc-600 group-hover:text-white transition-colors" />
                        <div className="font-mono text-sm uppercase tracking-widest text-zinc-500 group-hover:text-orange-500">Mockups</div>
                    </div>
                    <div className="p-8 text-center hover:bg-zinc-900/50 transition-colors cursor-pointer group">
                        <Camera className="w-8 h-8 mx-auto mb-4 text-zinc-600 group-hover:text-white transition-colors" />
                        <div className="font-mono text-sm uppercase tracking-widest text-zinc-500 group-hover:text-orange-500">Actions</div>
                    </div>
                    <div className="p-8 text-center hover:bg-zinc-900/50 transition-colors cursor-pointer group">
                        <Download className="w-8 h-8 mx-auto mb-4 text-zinc-600 group-hover:text-white transition-colors" />
                        <div className="font-mono text-sm uppercase tracking-widest text-zinc-500 group-hover:text-orange-500">Freebies</div>
                    </div>
                </div>
            </section>

            {/* Product Grid (Masonry Style Attempt) */}
            <main id="assets" className="py-24 px-6 max-w-[1800px] mx-auto">
                <div className="flex justify-between items-end mb-16">
                    <h2 className="text-3xl font-bold text-white uppercase tracking-tight">Latest Drops</h2>
                    <button className="text-zinc-500 hover:text-white font-mono text-xs uppercase tracking-widest flex items-center gap-2 transition-colors">
                        View All <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="grid md:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-[3/4] bg-zinc-900 rounded animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.length > 0 ? (
                            products.map((asset) => (
                                <article
                                    key={asset.id}
                                    className="group cursor-pointer bg-zinc-900/50 border border-zinc-900 hover:border-zinc-700 transition-all duration-300"
                                    onClick={() => addToCart(asset)}
                                >
                                    <div className="aspect-square overflow-hidden relative">
                                        <Image
                                            src={asset.image || `https://source.unsplash.com/random/800x800/?texture,abstract&sig=${asset.id}`}
                                            alt={asset.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        />
                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="bg-white text-black p-2 rounded-full hover:bg-orange-500 hover:text-white transition-colors">
                                                <ShoppingBag className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-bold text-white group-hover:text-orange-500 transition-colors">{asset.name}</h3>
                                            <div className="font-mono text-sm text-zinc-400">₦{asset.price}</div>
                                        </div>
                                        <p className="text-zinc-600 text-xs line-clamp-2 mb-4 h-8">{asset.description || "High resolution digital asset for professional use."}</p>
                                        <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 uppercase tracking-widest border-t border-zinc-900 pt-4 mt-auto">
                                            <span className="flex items-center gap-1"><Download className="w-3 h-3" /> Digital</span>
                                            <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> Pack</span>
                                        </div>
                                    </div>
                                </article>
                            ))
                        ) : (
                            // Empty State
                            [1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-zinc-900/30 border border-zinc-900 p-8 flex flex-col items-center justify-center text-center aspect-square">
                                    <ImageIcon className="w-8 h-8 text-zinc-800 mb-4" />
                                    <p className="text-zinc-700 font-mono text-xs uppercase">Coming Soon</p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>

            {/* Newsletter / Footer */}
            <footer className="border-t border-zinc-900 bg-zinc-950 py-24 px-6 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-6">Stay Creative.</h2>
                    <p className="text-zinc-500 mb-10">Join 10,000+ creators receiving free assets and tips weekly.</p>
                    <div className="flex gap-2 max-w-md mx-auto mb-16">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-zinc-900 border border-zinc-800 text-white px-4 py-3 w-full focus:outline-none focus:border-orange-500 text-sm font-mono"
                        />
                        <button className="bg-orange-600 text-white px-6 py-3 font-bold text-sm hover:bg-orange-500 transition-colors">
                            Subscribe
                        </button>
                    </div>

                    <div className="flex justify-center gap-8 mb-8 text-zinc-600">
                        <Share2 className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                        <Heart className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                        <Camera className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                    </div>
                    <p className="font-mono text-xs text-zinc-700 uppercase tracking-widest">&copy; 2024 {displayName}. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
