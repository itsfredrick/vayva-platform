"use client";

import React, { useState } from "react";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { ProductData } from "@/hooks/storefront/useStorefront";
import { StorefrontCart } from "../StorefrontCart";
import { CheckoutModal } from "../CheckoutModal";
import { ChevronRight, Minus, Plus, ShoppingBag, Star, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function StandardPDP({
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
    const [quantity, setQuantity] = useState(1);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const {
        cart,
        addToCart,
        isOpen: isCartOpen,
        setIsOpen: setIsCartOpen,
        clearCart,
        total
    } = useStorefrontCart(storeSlug);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        toast.success("Added to Cart", {
            description: `${quantity}x ${product.name} added.`
        });
    };

    return (
        <div className="bg-white min-h-screen text-slate-900 font-sans">
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                total={total}
                storeSlug={storeSlug}
                onSuccess={clearCart}
            />

            <nav className="fixed w-full z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href={basePath} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Store
                    </Link>
                    <div className="font-bold text-xl tracking-tight">
                        {storeName}
                    </div>
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full">
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

            <div className="pt-24 pb-24 max-w-[1200px] mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
                    {/* Image */}
                    <div className="bg-slate-50 rounded-2xl overflow-hidden aspect-square relative">
                        <img
                            src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                                {product.category || "General"}
                            </div>
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-slate-900 font-bold text-xs">4.8</span>
                                <span className="text-slate-400 text-xs">(128 reviews)</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 leading-tight">
                            {product.name}
                        </h1>
                        <div className="text-3xl font-bold text-slate-900 mb-8">
                            ₦{product.price.toLocaleString()}
                        </div>

                        <div className="prose prose-slate mb-8 text-slate-500 leading-relaxed">
                            <p>{product.description || "Experience quality and craftsmanship with this premium product. Designed for durability and style."}</p>
                        </div>

                        <div className="flex flex-col gap-4 max-w-md">
                            <div className="flex items-center border border-slate-200 rounded-lg p-1 w-fit">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded"><Minus className="w-4 h-4" /></button>
                                <span className="w-12 text-center font-bold">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded"><Plus className="w-4 h-4" /></button>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2"
                                >
                                    <ShoppingBag className="w-5 h-5" /> Add to Cart
                                </button>
                                <button className="w-14 h-14 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-colors">
                                    <Share2 className="w-5 h-5 text-slate-600" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-bold mb-2">Free Delivery</h4>
                                <p className="text-sm text-slate-500">Orders over ₦50,000 qualify for free express shipping.</p>
                            </div>
                            <div>
                                <h4 className="font-bold mb-2">Return Policy</h4>
                                <p className="text-sm text-slate-500">30-day return window for all items in original condition.</p>
                            </div>
                            <div>
                                <h4 className="font-bold mb-2">Secure Checkout</h4>
                                <p className="text-sm text-slate-500">Encrypted payment processing.</p>
                            </div>
                            <div>
                                <h4 className="font-bold mb-2">Warranty</h4>
                                <p className="text-sm text-slate-500">1 year manufacturer warranty included.</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100">
                            <h4 className="font-bold mb-4 uppercase tracking-widest text-xs text-slate-500">Product Specifications</h4>
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                                <div className="font-medium text-slate-900">SKU</div><div className="text-slate-500">VY-{product.id?.slice(0, 6).toUpperCase()}</div>
                                <div className="font-medium text-slate-900">Availability</div><div className="text-green-600 font-bold">In Stock</div>
                                <div className="font-medium text-slate-900">Shipping</div><div className="text-slate-500">Worldwide</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
