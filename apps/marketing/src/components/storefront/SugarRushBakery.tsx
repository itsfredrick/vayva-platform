import React, { useState } from "react";
import {
    useStorefrontProducts,
    useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { StorefrontCart } from "./StorefrontCart";
import { ShoppingBag, Heart, Star, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import { StorefrontSEO } from "./StorefrontSEO";

export function SugarRushBakery({
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
        primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#FF9AA2", // Soft Pink
        heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "Eat dessert first.",
        heroSubtitle: configOverride?.heroSubtitle || store?.templateConfig?.heroSubtitle || "Life is short.",
        accentColor: configOverride?.accentColor || store?.templateConfig?.accentColor || "#FF6F91", // Deep Pink
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
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const displayName = store?.name || initialStoreName;

    return (
        <div className="bg-[#FFF5F7] min-h-screen font-sans text-gray-800">
            <StorefrontSEO store={store} products={products} />
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                total={cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}
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

            {/* Decorative Top Border */}
            <div className="h-2 w-full bg-gradient-to-r from-[#FFB7B2] via-[#FFDAC1] to-[#E2F0CB]"></div>

            {/* Header */}
            <header className="px-6 py-6 md:py-10 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full text-white rotate-12" style={{ backgroundColor: config.primaryColor }}>
                        <Heart className="w-6 h-6 fill-current" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-sm" style={{ color: config.accentColor }}>{displayName}</h1>
                </div>
                <p className="text-[#B5B9FF] font-medium tracking-wide">Handmade with love & sprinkles.</p>
            </header>

            {/* Navbar/Fab */}
            <div className="fixed bottom-6 right-6 md:top-6 md:right-6 md:bottom-auto z-50">
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="bg-[#FF9AA2] text-white p-4 rounded-full shadow-lg hover:bg-[#FF6F91] hover:scale-110 transition-all flex items-center justify-center gap-2"
                >
                    <ShoppingBag className="w-6 h-6" />
                    {cart.length > 0 && <span className="font-bold">{cart.length}</span>}
                </button>
            </div>

            {/* Hero */}
            <section className="px-4 py-8 max-w-5xl mx-auto">
                <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl grid md:grid-cols-2 gap-12 items-center relative overflow-hidden">
                    {/* Decorative Blobs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#E2F0CB] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-[#FFB7B2] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

                    <div className="relative z-10">
                        <span className="bg-[#FFDAC1] text-[#D47F46] px-4 py-1 rounded-full text-xs font-bold uppercase mb-4 inline-block">Fresh from Oven</span>
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800 leading-tight">
                            {config.heroSubtitle}<br />
                            <span style={{ color: config.primaryColor }}>{config.heroTitle}</span>
                        </h2>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            Our cakes, cookies, and pastries are baked fresh every morning using locally sourced ingredients and a whole lot of love.
                        </p>
                        <button
                            onClick={() => document.getElementById('treats')?.scrollIntoView({ behavior: 'smooth' })}
                            className="text-white px-8 py-4 rounded-full font-bold shadow-md hover:shadow-lg transition-all"
                            style={{ backgroundColor: config.primaryColor }}
                        >
                            Order Treats
                        </button>
                    </div>
                    <div className="relative z-10 order-first md:order-last">
                        <Image
                            src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800"
                            className="rounded-[2rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 border-8 border-white object-cover"
                            alt="Cake"
                            width={800}
                            height={600}
                            priority
                        />
                    </div>
                </div>
            </section>

            {/* Info Bubbles */}
            <section className="flex flex-wrap justify-center gap-4 md:gap-8 py-8 px-4">
                <div className="bg-white px-6 py-3 rounded-full shadow-sm flex items-center gap-2 text-sm md:text-base">
                    <Clock className="w-5 h-5 text-[#FF9AA2]" />
                    <span className="font-bold text-gray-600">Opens 8:00 AM</span>
                </div>
                <div className="bg-white px-6 py-3 rounded-full shadow-sm flex items-center gap-2 text-sm md:text-base">
                    <MapPin className="w-5 h-5 text-[#FF9AA2]" />
                    <span className="font-bold text-gray-600">Curbside Pickup</span>
                </div>
                <div className="bg-white px-6 py-3 rounded-full shadow-sm flex items-center gap-2 text-sm md:text-base">
                    <Star className="w-5 h-5 text-[#FF9AA2]" />
                    <span className="font-bold text-gray-600">Rated 4.9/5</span>
                </div>
            </section>

            {/* Products */}
            <main id="treats" className="py-16 px-6 max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h3 className="text-3xl font-bold text-[#FF6F91] mb-2">Today's Sweet Selection</h3>
                    <div className="h-1 w-24 bg-[#FF9AA2] mx-auto rounded-full"></div>
                </div>

                {isLoading ? (
                    <div className="text-center py-20 text-[#FF9AA2] font-bold">Mixing batter...</div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-[#FFB7B2]">
                        <p className="text-gray-400">Sold out for today! Check back tomorrow.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <article key={product.id} className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 group cursor-pointer border border-transparent hover:border-[#FFB7B2]/30">
                                <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-[#FFF5F7] relative">
                                    <Image
                                        src={product.image || `https://via.placeholder.com/300?text=${encodeURIComponent(product.name)}`}
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                </div>
                                <h4 className="font-bold text-gray-800 text-lg mb-1 leading-tight">{product.name}</h4>
                                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                                <div className="flex justify-between items-center">
                                    <span className="font-black text-[#FF6F91] text-lg">₦{product.price.toLocaleString()}</span>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="bg-[#E2F0CB] text-[#7A9E58] p-2 rounded-full hover:bg-[#B5EAD7] transition-colors"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-[#FF9AA2] text-white py-12 mt-12">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <Heart className="w-8 h-8 fill-current mx-auto mb-6 animate-pulse" />
                    <h4 className="text-2xl font-bold mb-4">Thanks for stopping by!</h4>
                    <p className="opacity-90 mb-8 max-w-md mx-auto">
                        We hope our treats bring a little extra sweetness to your day.
                        Follow us for daily specials and happy vibes.
                    </p>
                    <div className="text-sm opacity-75 font-bold tracking-widest uppercase">
                        &copy; 2024 {displayName}
                    </div>
                </div>
            </footer>
        </div >
    );
}
