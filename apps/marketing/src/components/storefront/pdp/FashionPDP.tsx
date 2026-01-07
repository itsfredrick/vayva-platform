"use client";

import React, { useState } from "react";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { ProductData } from "@/hooks/storefront/useStorefront";
import { StorefrontCart } from "../StorefrontCart";
import { CheckoutModal } from "../CheckoutModal";
import { ChevronRight, Minus, Plus, ShoppingBag, Star, Ruler, Truck, RotateCcw, Heart, Share2, ShieldCheck, Award, Zap, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Toaster, toast } from "sonner";

export function FashionPDP({
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
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [selectedColor, setSelectedColor] = useState<string>("Black");
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

    const {
        cart,
        addToCart,
        isOpen: isCartOpen,
        setIsOpen: setIsCartOpen,
        clearCart,
        total
    } = useStorefrontCart(storeSlug);

    const images = [
        product.image,
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1529139574466-a302d2052574?q=80&w=1000&auto=format&fit=crop"
    ].filter(Boolean) as string[];

    const sizes = ["S", "M", "L", "XL", "XXL"];
    const colors = [
        { name: "Black", class: "bg-black" },
        { name: "Gray", class: "bg-gray-500" },
        { name: "Navy", class: "bg-blue-900" },
        { name: "Brown", class: "bg-[#5D4037]" }
    ];

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error("Please select a size");
            return;
        }
        addToCart({
            ...product, // Hook handles Sanitization if we updated it, check later
            description: `Size: ${selectedSize}, Color: ${selectedColor}`,
        }, quantity);
        // Toast is handled in hook, drawer opens automatically
    };

    return (
        <div className="bg-white min-h-screen text-[#0F172A] selection:bg-black selection:text-white font-sans">
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                total={total}
                storeSlug={storeSlug}
                onSuccess={clearCart}
            />

            {/* Size Guide Modal */}
            <AnimatePresence>
                {sizeGuideOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSizeGuideOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white w-full max-w-lg p-8 shadow-2xl overflow-hidden"
                        >
                            <button onClick={() => setSizeGuideOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-5 h-5" />
                            </button>

                            <h3 className="text-2xl font-black uppercase tracking-tight mb-6 text-center">Size Guide</h3>
                            <p className="text-sm text-gray-500 text-center mb-8">Measurements are in inches. Fits true to size.</p>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-center">
                                    <thead>
                                        <tr className="border-b border-black">
                                            <th className="py-3 font-bold uppercase">Size</th>
                                            <th className="py-3 font-bold uppercase">Chest</th>
                                            <th className="py-3 font-bold uppercase">Waist</th>
                                            <th className="py-3 font-bold uppercase">Hips</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {[
                                            { s: 'S', c: '34-36', w: '28-30', h: '35-37' },
                                            { s: 'M', c: '38-40', w: '32-34', h: '39-41' },
                                            { s: 'L', c: '42-44', w: '36-38', h: '43-45' },
                                            { s: 'XL', c: '46-48', w: '40-42', h: '47-49' },
                                        ].map((r) => (
                                            <tr key={r.s}>
                                                <td className="py-3 font-bold">{r.s}</td>
                                                <td className="py-3 text-gray-600">{r.c}</td>
                                                <td className="py-3 text-gray-600">{r.w}</td>
                                                <td className="py-3 text-gray-600">{r.h}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Navigation */}
            <nav className="fixed w-full z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
                <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href={basePath} className="text-2xl font-black tracking-tighter uppercase relative group cursor-pointer hover:opacity-70 transition-opacity">
                        {storeName}
                    </Link>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 group"
                        >
                            <span className="text-xs font-bold uppercase hidden md:block group-hover:underline underline-offset-4">Cart</span>
                            <div className="relative">
                                <ShoppingBag className="w-5 h-5" />
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                        {cart.length}
                                    </span>
                                )}
                            </div>
                        </button>
                    </div>
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

            <div className="pt-28 max-w-[1400px] mx-auto px-6 mb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left: Gallery (Sticky) */}
                    <div className="lg:col-span-7 grid grid-cols-2 gap-2 h-fit">
                        {images.map((img, i) => (
                            <div key={i} className={`relative aspect-[3/4] overflow-hidden bg-gray-100 ${i === 0 ? 'col-span-2' : ''}`}>
                                <img src={img} alt={`${product.name} - view ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                            </div>
                        ))}
                    </div>

                    {/* Right: Details */}
                    <div className="lg:col-span-5 lg:pl-8">
                        {/* Breadcrumbs */}
                        <div className="text-xs text-gray-500 mb-4 flex items-center gap-2 uppercase tracking-wider font-medium">
                            <Link href={basePath} className="hover:text-black transition-colors">Home</Link>
                            <ChevronRight className="w-3 h-3" />
                            <span>{product.category || "Shop"}</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-black">{product.name}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none mb-2">{product.name}</h1>
                        <p className="text-gray-500 text-xs uppercase tracking-widest mb-6">Delivery Estimation: 3-5 Business Days</p>

                        <div className="text-2xl font-medium mb-6 flex items-center gap-4">
                            <span>₦{product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                                <span className="text-gray-300 line-through text-xl">₦{product.originalPrice.toLocaleString()}</span>
                            )}
                            {/* Sale Badge */}
                            {product.originalPrice && (
                                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm">
                                    Sale
                                </span>
                            )}
                        </div>

                        <p className="text-gray-600 mb-8 leading-relaxed font-light">
                            {product.description || "Experience premium quality with our meticulously crafted collection. Designed for modern living, this piece combines timeless elegance with contemporary comfort."}
                        </p>

                        {/* Color Selector */}
                        <div className="mb-6">
                            <span className="text-xs font-bold uppercase tracking-widest block mb-3">Select Color</span>
                            <div className="flex gap-3">
                                {colors.map(color => (
                                    <button
                                        key={color.name}
                                        onClick={() => setSelectedColor(color.name)}
                                        className={`w-8 h-8 rounded-full ${color.class} border-2 transition-all ${selectedColor === color.name ? 'border-black scale-110 shadow-md ring-1 ring-offset-2 ring-gray-200' : 'border-transparent hover:scale-110'}`}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Size Selector */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold uppercase tracking-widest">Select Size</span>
                                <button
                                    onClick={() => setSizeGuideOpen(true)}
                                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-black transition-colors underline underline-offset-2"
                                >
                                    <Ruler className="w-3 h-3" /> Size Guide
                                </button>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`h-12 border flex items-center justify-center text-sm font-bold transition-all ${selectedSize === size
                                            ? 'border-black bg-black text-white'
                                            : 'border-gray-200 text-gray-500 hover:border-black'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity & Actions Container */}
                        <div className="flex flex-col gap-4 mb-8 bg-gray-50 p-6 border border-gray-100 rounded-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-widest">Select Quantity</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-green-600 flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></div> In Stock
                                </span>
                            </div>

                            <div className="flex gap-4 h-12">
                                {/* Quantity */}
                                <div className="flex items-center border border-gray-300 bg-white w-32">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="flex-1 text-center font-bold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>

                                {/* Add to Cart */}
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-black text-white font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                                </button>
                            </div>

                            <button className="w-full h-12 border border-black text-black font-bold uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2">
                                <Heart className="w-4 h-4" /> Add to Wishlist
                            </button>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-4 mt-2 pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
                                    <ShieldCheck className="w-4 h-4 text-black" /> Secure Payment
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
                                    <RotateCcw className="w-4 h-4 text-black" /> Free Returns
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
                                    <Truck className="w-4 h-4 text-black" /> Fast Shipping
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
                                    <Award className="w-4 h-4 text-black" /> Auth. Guaranteed
                                </div>
                            </div>
                        </div>

                        {/* Rich Details Tabs */}
                        <div className="mt-12">
                            <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                                {['description', 'product details', 'delivery', 'reviews'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-4 px-6 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                                            } whitespace-nowrap`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="min-h-[200px] text-gray-600 leading-relaxed font-light text-sm">
                                {activeTab === 'description' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                        <p>
                                            Elevate your wardrobe with the {product.name}. meticulously crafted from premium materials, this piece offers a perfect blend of style and comfort for the modern individual. Designed to be versatile, it transitions seamlessly from day to night.
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-bold text-black uppercase text-xs mb-2">Design Features</h4>
                                                <ul className="list-disc pl-4 space-y-1">
                                                    <li>Modern tailored silhouette</li>
                                                    <li>Reinforced stitching for durability</li>
                                                    <li>Signature hardware details</li>
                                                    <li>Hidden interior pockets</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-black uppercase text-xs mb-2">Why We Love It</h4>
                                                <p className="text-sm italic">
                                                    "A staple piece that defines understated luxury. The fabric feels incredible against the skin."
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                {activeTab === 'product details' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                                        <div>
                                            <h4 className="font-bold text-black uppercase text-xs mb-2 border-b pb-1">Composition</h4>
                                            <p>Main: 100% Organic Cotton</p>
                                            <p>Lining: 100% Silk</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-black uppercase text-xs mb-2 border-b pb-1">Care Instructions</h4>
                                            <ul className="space-y-1">
                                                <li>• Dry clean only</li>
                                                <li>• Do not bleach</li>
                                                <li>• Iron on low heat</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-black uppercase text-xs mb-2 border-b pb-1">Origin</h4>
                                            <p>Made in Italy</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-black uppercase text-xs mb-2 border-b pb-1">Product Code</h4>
                                            <p>#VY-{product.id.toUpperCase()}-2024</p>
                                        </div>
                                    </motion.div>
                                )}
                                {activeTab === 'delivery' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full"><Truck className="w-5 h-5 text-black" /></div>
                                            <div>
                                                <h4 className="font-bold text-black text-sm">Standard Shipping</h4>
                                                <p className="text-xs">Delivery in 3-5 business days. Free for orders over ₦100,000.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full"><Zap className="w-5 h-5 text-black" /></div>
                                            <div>
                                                <h4 className="font-bold text-black text-sm">Express Delivery</h4>
                                                <p className="text-xs">Next day delivery available for orders placed before 2pm.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-full"><RotateCcw className="w-5 h-5 text-black" /></div>
                                            <div>
                                                <h4 className="font-bold text-black text-sm">Easy Returns</h4>
                                                <p className="text-xs">Return within 30 days of purchase. No questions asked.</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                {activeTab === 'reviews' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <div className="bg-gray-50 p-6 border border-gray-100 mb-4">
                                            <div className="flex justify-between mb-2">
                                                <div className="font-bold">John Doe</div>
                                                <div className="flex text-yellow-500">
                                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                                </div>
                                            </div>
                                            <p>"Excellent quality and fast shipping. Highly recommended!"</p>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="mt-24 pt-24 border-t border-gray-100">
                        <h3 className="text-3xl font-black uppercase tracking-tight mb-12 text-center">Related Products</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {relatedProducts.slice(0, 4).map(rp => (
                                <Link key={rp.id} href={`${basePath}/products/${rp.id}`} className="group cursor-pointer block">
                                    <div className="aspect-[3/4] bg-gray-100 mb-6 overflow-hidden relative">
                                        <img src={rp.image || ""} alt={rp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        {/* Quick Actions Override */}
                                        <button className="absolute bottom-0 left-0 w-full bg-white text-black py-4 font-bold uppercase text-xs tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            Quick View
                                        </button>
                                    </div>
                                    <h4 className="font-bold text-sm uppercase mb-1">{rp.name}</h4>
                                    <p className="text-gray-500 text-sm">₦{rp.price.toLocaleString()}</p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
