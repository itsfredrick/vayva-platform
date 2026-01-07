"use client";

import React, { useState } from "react";
import { useStorefrontProduct, useStorefrontStore } from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { StorefrontCart } from "./StorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { ShoppingBag, Star, Check, ArrowRight, Shield, Zap, TrendingUp, Clock } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { StorefrontSEO } from "./StorefrontSEO";

export function OneProductPro({
    storeName,
    storeSlug,
    basePath,
    config: configOverride,
}: {
    storeName: string;
    storeSlug?: string;
    basePath?: string;
    config?: any;
}) {
    // For One Product store, we typically feature the first product found
    // or a specific featured one.
    const { product, isLoading: isProductLoading } = useStorefrontProduct(storeSlug || "", "1"); // Default to ID 1 for demo
    const { store } = useStorefrontStore(storeSlug);

    // Configuration Merging
    const config = {
        primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#f97316", // orange-500
        heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "ProFocus Elite",
        accentTitle: configOverride?.accentTitle || store?.templateConfig?.accentTitle || "Elite",
        showAnnouncement: configOverride?.showAnnouncement ?? store?.templateConfig?.showAnnouncement ?? true,
    };

    const {
        cart,
        addToCart,
        isOpen: isCartOpen,
        setIsOpen: setIsCartOpen,
        clearCart,
        total
    } = useStorefrontCart(storeSlug || "");

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart(product, quantity);
        setIsCartOpen(true);
        toast.success("Order Started", {
            description: `${quantity}x ${product.name} ready for checkout.`
        });
    };

    if (isProductLoading) {
        return <div className="min-h-screen bg-white flex items-center justify-center">Loading Funnel...</div>;
    }

    // Fallback if no product found (should use mock data)
    const activeProduct = product || {
        id: "1",
        name: "ProFocus Elite",
        description: "The ultimate productivity tool for creators. Silence the noise and amplify your workflow.",
        price: 29900,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
        originalPrice: 45000,
        category: "Electronics",
        rating: 5,
    };

    return (
        <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-orange-500 selection:text-white">
            <StorefrontSEO store={store} products={[activeProduct]} activeProduct={activeProduct} />
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

            {/* Announcement Bar */}
            {config.showAnnouncement && (
                <div className="bg-slate-900 text-white text-xs font-bold text-center py-2 px-4 uppercase tracking-widest">
                    Limited Time Offer: 50% Off First 100 Orders
                </div>
            )}

            {/* Header / Nav */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="font-extrabold text-2xl tracking-tighter italic">
                        {storeName || store?.name || "OneProduct"}
                    </div>
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2"
                    >
                        <ShoppingBag className="w-6 h-6 text-slate-900" />
                        {cart.length > 0 && (
                            <span className="absolute top-0 right-0 w-4 h-4 bg-orange-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">{cart.length}</span>
                        )}
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-12 pb-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="flex text-orange-500">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                        </div>
                        <span className="text-sm font-bold text-slate-500">4.9/5 (1,204 Reviews)</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black leading-[0.9] text-slate-900 mb-6 tracking-tighter">
                        {config.heroTitle} <br />
                        <span style={{ color: config.primaryColor }}>{config.accentTitle}</span>
                    </h1>
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-md">
                        {activeProduct.description}
                    </p>

                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-4xl font-bold text-slate-900">₦{activeProduct.price.toLocaleString()}</span>
                        {activeProduct.originalPrice && (
                            <span className="text-xl text-slate-400 line-through font-bold">₦{activeProduct.originalPrice.toLocaleString()}</span>
                        )}
                        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Save 35%</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleAddToCart}
                            className="text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 shadow-xl transition-all hover:scale-105"
                            style={{ backgroundColor: config.primaryColor, boxShadow: `0 20px 25px -5px ${config.primaryColor}33` }}
                        >
                            Get Yours Now <ArrowRight className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> 30-Day Guarantee</span>
                            <span className="flex items-center gap-1"><Zap className="w-4 h-4" /> Fast Ship</span>
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Sale ends in 12:45:10
                    </p>
                </div>

                <div className="order-1 md:order-2 relative">
                    <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden relative z-10">
                        <Image
                            src={activeProduct.image || ""}
                            alt={activeProduct.name}
                            fill
                            priority
                            className="object-cover hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                    {/* Decorative Blob */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-200/50 rounded-full blur-3xl -z-0"></div>
                </div>
            </section>

            {/* Social Proof / Trusted By */}
            <section className="bg-slate-50 py-12 border-y border-slate-100">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Featured In</p>
                    <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
                        <span className="text-2xl font-black text-slate-800">WIRED</span>
                        <span className="text-2xl font-black text-slate-800">TheVerge</span>
                        <span className="text-2xl font-black text-slate-800">TechCrunch</span>
                        <span className="text-2xl font-black text-slate-800">Forbes</span>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-24 px-6 max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold mb-4">Why Everyone Is Switching</h2>
                    <p className="text-slate-500">Engineered for performance, designed for life. See what makes us different.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: "Ultra Durable", icon: Shield, desc: "Built with military-grade materials to withstand any environment." },
                        { title: "Lightning Fast", icon: Zap, desc: "Optimized for speed, ensuring zero lag in your workflow." },
                        { title: "Growth Focused", icon: TrendingUp, desc: "Tools designed to help you scale your output 10x." },
                    ].map((f, i) => (
                        <div key={i} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-orange-500/30 transition-colors">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                                <f.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                            <p className="text-slate-500 leading-relaxed text-sm">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Sticky Mobile CTA (Visible only on small screens) */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 p-4 z-50">
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold shadow-lg"
                >
                    Buy Now - ₦{activeProduct.price.toLocaleString()}
                </button>
            </div>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 px-6 text-center text-sm">
                <p>&copy; 2024 {storeName || store?.name || "OneProduct"}. All rights reserved.</p>
            </footer>
        </div>
    );
}
