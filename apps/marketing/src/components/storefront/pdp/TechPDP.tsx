"use client";

import React, { useState } from "react";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { ProductData } from "@/hooks/storefront/useStorefront";
import { StorefrontCart } from "../StorefrontCart";
import { CheckoutModal } from "../CheckoutModal";
import { ChevronRight, Minus, Plus, ShoppingCart, Star, Smartphone, Battery, Cpu, ShieldCheck, Zap, GitCompare, Share2, CornerDownRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function TechPDP({
    product,
    storeSlug,
    storeName,
    basePath = ``,
    relatedProducts = []
}: {
    product: ProductData;
    storeSlug: string;
    storeName: string;
    basePath?: string;
    relatedProducts?: ProductData[];
}) {
    const [selectedColor, setSelectedColor] = useState<string>("Neon Green");
    const [selectedStorage, setSelectedStorage] = useState<string>("256GB");
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("specs");
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const {
        cart,
        addToCart,
        isOpen: isCartOpen,
        setIsOpen: setIsCartOpen,
        clearCart,
        total
    } = useStorefrontCart(storeSlug);

    // Provide default fallback images if missing
    const images = [
        product.image,
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1550029402-226113b786cf?q=80&w=1000&auto=format&fit=crop"
    ].filter(Boolean) as string[];

    const colors = [
        { name: "Neon Green", code: "#00ff41" },
        { name: "Cyber Black", code: "#1a1a1a" },
        { name: "Matrix Silver", code: "#e0e0e0" }
    ];

    const storageOptions = [
        { size: "128GB", price: 0 },
        { size: "256GB", price: 15000 },
        { size: "512GB", price: 40000 }
    ];

    const handleAddToCart = () => {
        const storagePrice = storageOptions.find(s => s.size === selectedStorage)?.price || 0;
        const finalPrice = product.price + storagePrice;

        addToCart({
            ...product,
            price: finalPrice,
            description: `Finish: ${selectedColor} // Cap: ${selectedStorage}`,
        }, quantity);
        toast.success("UNIT ACQUIRED", {
            description: "Item synced to cargo hold.",
            style: { background: "#000", border: "1px solid #00ff41", color: "#00ff41" }
        });
    };

    const currentPrice = product.price + (storageOptions.find(s => s.size === selectedStorage)?.price || 0);

    return (
        <div className="bg-[#050505] min-h-screen text-[#00ff41] font-mono selection:bg-[#003300] selection:text-[#00ff41]">
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                total={total}
                storeSlug={storeSlug}
                onSuccess={clearCart}
            />

            {/* Matrix Background */}
            <div
                className="fixed inset-0 pointer-events-none opacity-5"
                style={{
                    backgroundImage:
                        "linear-gradient(0deg, transparent 24%, rgba(0, 255, 65, .3) 25%, rgba(0, 255, 65, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 65, .3) 75%, rgba(0, 255, 65, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 65, .3) 25%, rgba(0, 255, 65, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 65, .3) 75%, rgba(0, 255, 65, .3) 76%, transparent 77%, transparent)",
                    backgroundSize: "50px 50px",
                }}
            ></div>

            {/* Header / HUD */}
            <header className="border-b border-[#00ff41]/30 sticky top-0 bg-[#050505]/95 backdrop-blur z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href={basePath || '/'} className="flex items-center gap-3 group">
                        <Cpu className="w-6 h-6 animate-pulse group-hover:rotate-90 transition-transform" />
                        <span className="text-xl font-bold tracking-widest group-hover:shadow-[0_0_10px_#00ff41] transition-shadow">
                            {storeName}
                        </span>
                    </Link>
                    <div className="flex items-center gap-6 text-xs uppercase tracking-widest">
                        <div className="hidden md:flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse"></div>
                            <span>System Online</span>
                        </div>
                        <button
                            className="hover:bg-[#00ff41] hover:text-black px-4 py-2 transition-all flex items-center gap-2 border border-[#00ff41]/50 clip-path-slant"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span>CARGO({cart.length})</span>
                        </button>
                    </div>
                </div>
            </header>

            <StorefrontCart
                storeSlug={storeSlug}
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onCheckout={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                }}
            />

            <div className="relative pt-20 max-w-7xl mx-auto px-6 mb-24">

                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs text-[#00ff41]/60 mb-8 uppercase tracking-widest">
                    <Link href={basePath || '/'} className="hover:text-[#00ff41]">Homebase</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span>Inventory</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-[#00ff41] animate-pulse">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

                    {/* Left: Visuals */}
                    <div className="space-y-6">
                        <div className="aspect-square bg-[#0a0a0a] border border-[#00ff41]/30 relative flex items-center justify-center group overflow-hidden">
                            {/* HUD Corners */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00ff41]"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00ff41]"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00ff41]"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00ff41]"></div>

                            <img
                                src={images[0]}
                                alt={product.name}
                                className="w-[80%] h-[80%] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-700 drop-shadow-[0_0_15px_rgba(0,255,65,0.2)]"
                            />

                            <div className="absolute bottom-4 left-4 font-mono text-xs text-[#00ff41]">
                                SCALE: 100%<br />
                                RENDER: CYCLES
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {images.map((img, i) => (
                                <div key={i} className="aspect-square border border-[#00ff41]/20 bg-black/50 hover:bg-[#00ff41]/10 transition-colors flex items-center justify-center cursor-pointer p-2">
                                    <img src={img} className="w-full h-full object-contain filter " />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Data & Controls */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 border border-[#00ff41] text-[10px] font-bold uppercase bg-[#00ff41]/10">
                                {product.category || "Hardware"}
                            </span>
                            {product.rating && (
                                <div className="flex items-center gap-1 text-[#00ff41] text-xs">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>{product.rating}</span>
                                </div>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-tighter shadow-[#00ff41] drop-shadow-sm">
                            {product.name}
                        </h1>

                        <div className="text-3xl font-bold mb-8 border-l-4 border-[#00ff41] pl-4">
                            ₦{currentPrice.toLocaleString()}
                            <span className="text-sm font-normal block text-[#00ff41]/60 mt-1">CREDITS REQUIRED</span>
                        </div>

                        {/* Specs Configurator */}
                        <div className="space-y-8 mb-10 border-t border-b border-[#00ff41]/20 py-8">
                            {/* Color Selection */}
                            <div>
                                <div className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <CornerDownRight className="w-3 h-3" /> Select Finish
                                </div>
                                <div className="flex gap-4">
                                    {colors.map(c => (
                                        <button
                                            key={c.name}
                                            onClick={() => setSelectedColor(c.name)}
                                            className={`p-1 border border-transparent transition-all ${selectedColor === c.name ? 'border-[#00ff41] bg-[#00ff41]/10' : 'opacity-50 hover:opacity-100'}`}
                                        >
                                            <div className={`flex items-center gap-2 px-3 py-2 border border-[#00ff41]/30 bg-black`}>
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.code }}></div>
                                                <span className="text-xs uppercase">{c.name}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Storage Selection */}
                            <div>
                                <div className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <CornerDownRight className="w-3 h-3" /> Capacity
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {storageOptions.map(opt => (
                                        <button
                                            key={opt.size}
                                            onClick={() => setSelectedStorage(opt.size)}
                                            className={`py-3 border text-xs font-bold uppercase transition-all relative overflow-hidden group ${selectedStorage === opt.size
                                                ? 'border-[#00ff41] bg-[#00ff41] text-black'
                                                : 'border-[#00ff41]/30 text-[#00ff41] hover:border-[#00ff41]'
                                                }`}
                                        >
                                            {opt.size}
                                            {opt.price > 0 && <span className="block text-[9px] opacity-70">+₦{opt.price.toLocaleString()}</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-4 mb-8">
                            <div className="flex items-center border border-[#00ff41] h-14 bg-black w-32">
                                <button className="w-10 h-full flex items-center justify-center hover:bg-[#00ff41] hover:text-black transition-colors" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus className="w-4 h-4" /></button>
                                <span className="flex-1 text-center font-bold">{quantity}</span>
                                <button className="w-10 h-full flex items-center justify-center hover:bg-[#00ff41] hover:text-black transition-colors" onClick={() => setQuantity(quantity + 1)}><Plus className="w-4 h-4" /></button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-[#00ff41] text-black font-bold h-14 uppercase tracking-widest hover:bg-[#00cc33] hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] transition-all flex items-center justify-center gap-2 clip-path-slant"
                            >
                                <Zap className="w-5 h-5 fill-black" /> Initialize Purchase
                            </button>
                        </div>

                        <div className="flex justify-between items-center text-xs text-[#00ff41]/50 mb-12">
                            <button className="flex items-center gap-2 hover:text-[#00ff41]"><GitCompare className="w-4 h-4" /> COMPARE SPECS</button>
                            <button className="flex items-center gap-2 hover:text-[#00ff41]"><Share2 className="w-4 h-4" /> SHARE DATA</button>
                        </div>

                        <div className="border border-[#00ff41]/30 bg-[#0a0a0a]">
                            <div className="flex border-b border-[#00ff41]/30">
                                {['specs', 'in the box', 'warranty', 'delivery'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#00ff41] text-black' : 'hover:bg-[#00ff41]/10'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="p-6 min-h-[250px]">
                                {activeTab === 'specs' && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left">
                                            <tbody className="divide-y divide-[#00ff41]/10">
                                                {[
                                                    { label: 'Processor', value: 'Neural Engine X12 (12-Core)' },
                                                    { label: 'Graphics', value: 'Quantum Ray-Tracing Core' },
                                                    { label: 'Memory', value: '32GB Unified Holographic RAM' },
                                                    { label: 'Storage', value: '1TB Solid State Crystal' },
                                                    { label: 'Connectivity', value: 'Wi-Fi 7E / Sub-Space Link' },
                                                    { label: 'Battery', value: '48hr Isotope Cell (Replaceable)' },
                                                    { label: 'OS', value: 'CyberOS v4.2' },
                                                    { label: 'Weight', value: '1.2 kg' },
                                                ].map((spec, i) => (
                                                    <tr key={i} className="hover:bg-[#00ff41]/5 transition-colors">
                                                        <td className="py-2 pr-4 font-bold text-[#00ff41]/70 uppercase w-1/3">{spec.label}</td>
                                                        <td className="py-2 font-mono text-[#00ff41]">{spec.value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {activeTab === 'in the box' && (
                                    <div className="space-y-4">
                                        <p className="text-xs uppercase text-[#00ff41]/70 mb-4">Package Contents Verified:</p>
                                        <ul className="space-y-3">
                                            <li className="flex items-center gap-3 bg-[#00ff41]/5 p-2 border border-[#00ff41]/10">
                                                <div className="w-8 h-8 flex items-center justify-center border border-[#00ff41]/30"><Smartphone className="w-4 h-4" /></div>
                                                <span className="font-bold">Neural Device Unit</span>
                                            </li>
                                            <li className="flex items-center gap-3 bg-[#00ff41]/5 p-2 border border-[#00ff41]/10">
                                                <div className="w-8 h-8 flex items-center justify-center border border-[#00ff41]/30"><Zap className="w-4 h-4" /></div>
                                                <span className="font-bold">Hyper-Charger (120W)</span>
                                            </li>
                                            <li className="flex items-center gap-3 bg-[#00ff41]/5 p-2 border border-[#00ff41]/10">
                                                <div className="w-8 h-8 flex items-center justify-center border border-[#00ff41]/30"><ShieldCheck className="w-4 h-4" /></div>
                                                <span className="font-bold">Warranty Module Card</span>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                                {activeTab === 'warranty' && (
                                    <div className="flex items-start gap-4">
                                        <ShieldCheck className="w-8 h-8 opacity-80 flex-shrink-0" />
                                        <div>
                                            <div className="font-bold mb-2 uppercase">Global Protection Protocol</div>
                                            <p className="text-xs opacity-70 leading-relaxed mb-4">
                                                All hardware is covered by a 12-cycle warranty against defects in materials and workmanship.
                                            </p>
                                            <ul className="list-disc pl-4 space-y-1 text-xs text-[#00ff41]/80">
                                                <li>Hardware failure coverage</li>
                                                <li>24/7 Holographic Support</li>
                                                <li>Global repair network access</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'delivery' && (
                                    <div className="space-y-4">
                                        <div className="border border-[#00ff41]/30 p-4">
                                            <div className="text-[10px] uppercase text-[#00ff41]/50 mb-1">Estimated Arrival</div>
                                            <div className="text-xl font-bold">SOL-DATE: 2049.12.05</div>
                                            <div className="text-xs text-[#00ff41]/70 mt-1">Via Drone Drop Link</div>
                                        </div>
                                        <p className="text-xs italic opacity-60">
                                            * Secure signature required upon delivery. ID verification mandatory.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
