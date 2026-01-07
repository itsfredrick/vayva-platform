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
    Mail,
    Heart,
    MapPin,
    CalendarDays,
    CheckCircle,
} from "lucide-react";
import { StorefrontSEO } from "./StorefrontSEO";
import { useCartQuery } from "@/hooks/storefront/useStorefrontQuery";

export function RSVPMate({
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
        primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#2c2c2c", // Black/Stone
        heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "You Are Invited To",
        heroDesc: configOverride?.heroDesc || store?.templateConfig?.heroDesc || "Join us for an evening of celebration, great food, and wonderful company. We look forward to sharing this special moment with you.",
        accentColor: configOverride?.accentColor || store?.templateConfig?.accentColor || "#d1bfa7", // Nude/Camel
    };
    const { products, isLoading } = useStorefrontProducts(storeSlug, {
        limit: 1, // Usually just 1 "ticket" type for free events (RSVP)
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

    const displayName = store?.name || initialStoreName;

    return (
        <main className="bg-[#fcf8f5] min-h-screen font-serif text-[#4a4a4a] flex flex-col items-center justify-center">
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

            {/* Invitation Card Layout */}
            <article className="w-full max-w-2xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] md:rounded-xl overflow-hidden my-0 md:my-12 border border-[#f0ebe6]">
                {/* Header Image */}
                <div className="h-64 bg-stone-200 relative">
                    <Image
                        src="https://images.unsplash.com/photo-1519225421980-715cb0202128?q=80&w=1000&auto=format&fit=crop"
                        alt="Event Header"
                        className="object-cover opacity-90"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 800px"
                    />
                    <div className="absolute inset-0 bg-stone-900/10"></div>
                </div>

                <div className="p-8 md:p-16 text-center">
                    <div className="text-xs uppercase tracking-[0.3em] text-[#8c8c8c] mb-6 font-sans border-b border-stone-100 pb-2 inline-block">
                        {config.heroTitle}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-medium text-[#2c2c2c] mb-6 leading-tight">
                        {displayName}
                    </h1>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 py-10 border-y border-[#f0ebe6] mb-10">
                        <div className="text-center">
                            <CalendarDays className="w-6 h-6 mx-auto mb-3" style={{ color: config.accentColor }} />
                            <h2 className="font-bold text-lg mb-1 whitespace-nowrap">Saturday, Dec 14</h2>
                            <div className="text-sm text-[#8c8c8c] font-sans">5:00 PM - 10:00 PM</div>
                        </div>
                        <div className="hidden md:block w-px h-12 bg-[#f0ebe6]"></div>
                        <div className="text-center">
                            <MapPin className="w-6 h-6 mx-auto mb-3" style={{ color: config.accentColor }} />
                            <h2 className="font-bold text-lg mb-1 whitespace-nowrap">The Grand Hall</h2>
                            <div className="text-sm text-[#8c8c8c] font-sans">Victoria Island, Lagos</div>
                        </div>
                    </div>

                    <div className="max-w-md mx-auto mb-12">
                        <p className="text-lg leading-relaxed text-[#5c5c5c]">
                            {config.heroDesc}
                        </p>
                    </div>

                    {/* RSVP Action */}
                    {isLoading ? (
                        <div className="h-12 w-48 bg-stone-100 rounded-full mx-auto animate-pulse"></div>
                    ) : products.length > 0 ? (
                        <button
                            onClick={() => addToCart(products[0])}
                            className="text-white px-10 py-4 rounded-full font-sans text-sm font-bold uppercase tracking-widest transition-transform hover:scale-105 shadow-xl shadow-stone-200"
                            style={{ backgroundColor: config.primaryColor }}
                        >
                            RSVP Now
                        </button>
                    ) : (
                        <div className="inline-block px-6 py-3 border border-stone-200 rounded-full text-stone-400 font-sans text-sm">
                            RSVPs Closed
                        </div>
                    )}

                    <div className="mt-12 text-sm text-[#8c8c8c] font-sans">
                        <p>Kindly respond by December 1st</p>
                    </div>
                </div>
            </article>

            <footer className="py-8 text-center text-[#a0a0a0] text-xs font-sans uppercase tracking-widest">
                Powered by {displayName}
            </footer>
        </main>
    );
}
