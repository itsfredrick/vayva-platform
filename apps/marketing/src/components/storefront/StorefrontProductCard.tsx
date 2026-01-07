"use client";

import React, { useState } from "react";
import { ShoppingBag, Eye, Heart, Star } from "lucide-react";
import Link from "next/link";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { QuickViewModal } from "./QuickViewModal";

interface Product {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    originalPrice?: number | null;
    image?: string | null;
    rating?: number;
    [key: string]: any;
}

interface StorefrontProductCardProps {
    product: Product;
    storeSlug: string;
    basePath?: string;
    layout?: "grid" | "list";
}

export function StorefrontProductCard({
    product,
    storeSlug,
    basePath,
    layout = "grid"
}: StorefrontProductCardProps) {
    const { addToCart } = useStorefrontCart(storeSlug);
    const [isHovered, setIsHovered] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    // Calculate badge
    const isNew = Math.random() > 0.7; // Mock logic, ideally from product.createdAt
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <>
            <div
                className="group relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Container */}
                <div className="relative overflow-hidden aspect-[3/4] bg-gray-100 rounded-xl mb-4">
                    {/* Badges */}
                    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                        {isNew && (
                            <span className="bg-white/90 backdrop-blur text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded shadow-sm">
                                New
                            </span>
                        )}
                        {discount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded shadow-sm">
                                -{discount}%
                            </span>
                        )}
                    </div>

                    {/* Main Image */}
                    <Link href={basePath ? `${basePath}/products/${product.id}` : "#"}>
                        <img
                            src={product.image || "https://placehold.co/600x800/png"}
                            alt={product.name}
                            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? "scale-110" : "scale-100"
                                }`}
                        />
                    </Link>

                    {/* Hover Actions Overlay */}
                    <div
                        className={`absolute bottom-4 left-0 right-0 flex justify-center gap-2 transition-all duration-300 transform ${isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                            }`}
                    >
                        <button
                            onClick={() => addToCart(product)}
                            className="bg-white text-black hover:bg-black hover:text-white p-3 rounded-full shadow-lg transition-colors duration-300"
                            title="Add to Cart"
                        >
                            <ShoppingBag className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setIsQuickViewOpen(true)}
                            className="bg-white text-black hover:bg-black hover:text-white p-3 rounded-full shadow-lg transition-colors duration-300"
                            title="Quick View"
                        >
                            <Eye className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setIsWishlisted(!isWishlisted)}
                            className={`bg-white hover:bg-black hover:text-white p-3 rounded-full shadow-lg transition-colors duration-300 ${isWishlisted ? "text-red-500" : "text-black"
                                }`}
                            title="Add to Wishlist"
                        >
                            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                        </button>
                    </div>
                </div>

                {/* Product Details */}
                <div className="text-center">
                    {/* Rating Mock */}
                    <div className="flex justify-center gap-0.5 mb-2 text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-3 h-3 ${star <= (product.rating || 5) ? "fill-current" : "text-gray-300"}`}
                            />
                        ))}
                    </div>

                    <Link
                        href={basePath ? `${basePath}/products/${product.id}` : "#"}
                        className="text-lg font-medium text-gray-900 hover:text-black transition-colors"
                    >
                        {product.name}
                    </Link>

                    <div className="mt-1 flex items-center justify-center gap-3">
                        <span className="font-bold text-gray-900">
                            ₦{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                                ₦{product.originalPrice.toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <QuickViewModal
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
                product={product}
                storeSlug={storeSlug}
            />
        </>
    );
}
