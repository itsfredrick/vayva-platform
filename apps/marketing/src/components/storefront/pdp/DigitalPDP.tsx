"use client";

import React, { useState, useEffect } from "react";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { ProductData } from "@/hooks/storefront/useStorefront";
import { StorefrontCart } from "../StorefrontCart";
import { CheckoutModal } from "../CheckoutModal";
import { ChevronRight, Play, Pause, Download, Music, Shield, FileAudio, ShoppingBag, Heart, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

export function DigitalPDP({
    product,
    storeSlug,
    storeName,
    basePath = `/templates/preview/${storeSlug}`,
    relatedProducts = []
}: {
    product: ProductData;
    storeSlug: string;
    storeName: string;
    basePath?: string;
    relatedProducts?: ProductData[];
}) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedFormat, setSelectedFormat] = useState("MP3");
    const [selectedLicense, setSelectedLicense] = useState("Personal");
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    // Audio Viz Data (Hydration Safe)
    const [bars, setBars] = useState<number[]>([]);
    useEffect(() => {
        setBars(Array.from({ length: 20 }, () => Math.random() * 100));
    }, []);


    const {
        cart,
        addToCart,
        isOpen: isCartOpen,
        setIsOpen: setIsCartOpen,
        clearCart,
        total
    } = useStorefrontCart(storeSlug);

    const handleAddToCart = () => {
        const licenseMultiplier = selectedLicense === "Commercial" ? 3 : 1;
        const finalPrice = product.price * licenseMultiplier;

        addToCart({
            ...product,
            price: finalPrice,
            description: `Format: ${selectedFormat}, License: ${selectedLicense}`,
            image: product.image || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop"
        }, 1);
        toast.success("Added to Crate", {
            description: `${product.name} (${selectedFormat}) ready for checkout.`,
            style: { background: "#0a0a0a", border: "1px solid #7c3aed", color: "#fff" }
        });
    };

    const toggleLike = () => {
        setIsLiked(!isLiked);
        toast(isLiked ? "Removed from Library" : "Added to Library", {
            icon: <Heart className={`w-4 h-4 ${!isLiked ? 'fill-purple-500 text-purple-500' : ''}`} />
        });
    };

    const currentPrice = product.price * (selectedLicense === "Commercial" ? 3 : 1);

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-white font-sans selection:bg-purple-500 selection:text-white">
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                total={total}
                storeSlug={storeSlug}
                onSuccess={clearCart}
            />

            {/* Navigation */}
            <nav className="fixed w-full z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
                <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href={basePath} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Link>
                    <Link href={basePath} className="text-2xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        {storeName}
                    </Link>
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2 hover:bg-zinc-800 rounded-full transition-colors flex items-center gap-2 group"
                    >
                        <ShoppingBag className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
                        {cart.length > 0 && (
                            <span className="w-5 h-5 bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                                {cart.length}
                            </span>
                        )}
                    </button>
                </div>
            </nav>

            <StorefrontCart
                storeSlug={storeSlug}
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onCheckout={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                }}
            />

            <div className="pt-32 max-w-[1200px] mx-auto px-6 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                    {/* Album Art / Preview */}
                    <div className="relative group perspective-1000">
                        <div className="relative aspect-square bg-zinc-900 rounded-xl shadow-2xl overflow-hidden border border-white/10 transform transition-transform duration-700 hover:rotate-y-6 hover:scale-105">
                            <img
                                src={product.image || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop"}
                                alt={product.name}
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>

                            {/* Play Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="w-24 h-24 bg-white/5 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center hover:scale-110 transition-transform group-hover:bg-purple-600 group-hover:border-purple-500 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                                >
                                    {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
                                </button>
                            </div>

                            {/* Visualizer */}
                            {isPlaying && (
                                <div className="absolute bottom-0 left-0 w-full h-32 flex items-end justify-center gap-1 p-8 opacity-70">
                                    {bars.map((h, i) => (
                                        <div
                                            key={i}
                                            className="w-2 bg-purple-500 animate-pulse rounded-t-full shadow-[0_0_10px_#a855f7]"
                                            style={{ height: `${h}%`, animationDuration: `${0.5 + (i % 5) * 0.1}s` }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div>
                        <div className="flex items-center gap-2 text-purple-400 text-xs font-bold tracking-widest uppercase mb-4">
                            <Music className="w-4 h-4" />
                            <span>{product.category || "Digital Download"}</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9] text-white/90">{product.name}</h1>

                        <div className="text-3xl font-bold mb-8 flex items-center gap-4">
                            <span className="text-white">₦{currentPrice.toLocaleString()}</span>
                            <span className="text-[10px] font-bold text-zinc-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-md">Instant Delivery</span>
                        </div>

                        {/* description */}
                        <div className="prose prose-invert prose-sm text-zinc-400 mb-8 max-w-md">
                            <p>{product.description || "High-fidelity audio stem pack designed for professional producers. Includes separated tracks for drums, bass, synth, and vocals."}</p>
                        </div>

                        {/* Selectors */}
                        <div className="space-y-6 mb-8 bg-zinc-900/50 p-6 rounded-2xl border border-dashed border-zinc-800">

                            {/* License */}
                            <div>
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 block">Select License</span>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Personal', 'Commercial'].map(lic => (
                                        <button
                                            key={lic}
                                            onClick={() => setSelectedLicense(lic)}
                                            className={`py-3 px-4 rounded-lg border text-sm font-bold flex flex-col items-start gap-1 transition-all ${selectedLicense === lic
                                                ? 'bg-purple-600/10 border-purple-500/50 text-purple-300'
                                                : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                                                }`}
                                        >
                                            <div className="flex justify-between w-full">
                                                <span>{lic} Use</span>
                                                {lic === 'Commercial' && <span className="text-xs opacity-70">3x Price</span>}
                                            </div>
                                            <span className="text-[10px] font-normal opacity-50">
                                                {lic === 'Personal' ? 'Standard streaming & learning.' : 'Monetized content & distribution.'}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Format */}
                            <div>
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 block">Audio Format</span>
                                <div className="flex gap-3">
                                    {['MP3', 'WAV', 'FLAC'].map(fmt => (
                                        <button
                                            key={fmt}
                                            onClick={() => setSelectedFormat(fmt)}
                                            className={`px-4 py-2 rounded border text-xs font-bold transition-all ${selectedFormat === fmt
                                                ? 'bg-white text-black border-white'
                                                : 'bg-transparent border-zinc-600 text-zinc-400 hover:border-zinc-400'
                                                }`}
                                        >
                                            {fmt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-white text-black h-14 rounded-full font-bold uppercase tracking-widest hover:scale-105 hover:bg-purple-400 hover:text-white transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/20"
                            >
                                <ShoppingBag className="w-5 h-5" /> Buy Now
                            </button>
                            <button
                                onClick={toggleLike}
                                className={`w-14 h-14 rounded-full border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 hover:border-white transition-colors ${isLiked ? 'bg-purple-500/20 border-purple-500' : ''}`}
                            >
                                <Heart className={`w-5 h-5 ${isLiked ? 'fill-purple-500 text-purple-500' : 'text-white'}`} />
                            </button>
                        </div>

                        <div className="mt-8 flex items-center gap-6 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Secure Payment</span>
                            <span className="flex items-center gap-2"><FileAudio className="w-4 h-4" /> High Quality Audio</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
