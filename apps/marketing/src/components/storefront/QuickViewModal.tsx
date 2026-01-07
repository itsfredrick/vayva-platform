"use client";

import React, { useState } from "react";
import { X, ShoppingBag, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";

interface Product {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    originalPrice?: number | null;
    image?: string | null;
    images?: string[];
    [key: string]: any;
}

interface QuickViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    storeSlug: string;
}

export function QuickViewModal({ isOpen, onClose, product, storeSlug }: QuickViewModalProps) {
    const { addToCart } = useStorefrontCart(storeSlug);
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);

    if (!product) return null;

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setIsAdded(true);
        setTimeout(() => {
            setIsAdded(false);
            onClose();
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl z-[80] grid md:grid-cols-2 overflow-hidden"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full z-10 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Image Section */}
                        <div className="bg-gray-100 relative h-[400px] md:h-auto">
                            <img
                                src={product.image || "https://placehold.co/600x600/png"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Details Section */}
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            <div className="mb-6">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
                                <div className="flex items-center gap-4 text-xl">
                                    <span className="font-bold text-gray-900">
                                        ₦{product.price.toLocaleString()}
                                    </span>
                                    {product.originalPrice && (
                                        <span className="text-gray-400 line-through text-lg">
                                            ₦{product.originalPrice.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <p className="text-gray-600 mb-8 leading-relaxed">
                                {product.description || "Experience premium quality with our meticulously crafted collection. Designed for modern living."}
                            </p>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-3 hover:bg-gray-50 transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-bold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-4 py-3 hover:bg-gray-50 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className={`flex-1 py-3 px-6 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${isAdded
                                        ? "bg-green-600 text-white"
                                        : "bg-black text-white hover:bg-gray-800"
                                        }`}
                                >
                                    {isAdded ? (
                                        <>
                                            <Check className="w-5 h-5" /> Added
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingBag className="w-5 h-5" /> Add to Cart
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="text-sm text-gray-500 border-t pt-6 space-y-2">
                                <div className="flex justify-between">
                                    <span>Category:</span>
                                    <span className="font-medium text-gray-900">Fashion</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Availability:</span>
                                    <span className="font-medium text-green-600">In Stock</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
