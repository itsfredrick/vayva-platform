"use client";

import React, { useState } from "react";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { ProductData } from "@/hooks/storefront/useStorefront";
import { StorefrontCart } from "../StorefrontCart";
import { CheckoutModal } from "../CheckoutModal";
import { ChevronRight, Minus, Plus, ShoppingBag, Star, ChefHat, Utensils, Flame, Leaf, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function FoodPDP({
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
    const [spiceLevel, setSpiceLevel] = useState("Medium");
    const [extras, setExtras] = useState<string[]>([]);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const {
        cart,
        addToCart,
        isOpen: isCartOpen,
        setIsOpen: setIsCartOpen,
        clearCart,
        total
    } = useStorefrontCart(storeSlug);

    const availableExtras = [
        { name: "Extra Cheese", price: 500 },
        { name: "Extra Sauce", price: 200 },
        { name: "Double Portion", price: product.price * 0.5 }
    ];

    const toggleExtra = (extraName: string) => {
        if (extras.includes(extraName)) {
            setExtras(extras.filter(e => e !== extraName));
        } else {
            setExtras([...extras, extraName]);
        }
    };

    const calculateTotal = () => {
        let price = product.price;
        extras.forEach(e => {
            const extra = availableExtras.find(ae => ae.name === e);
            if (extra) price += extra.price;
        });
        return price;
    };

    const handleAddToCart = () => {
        const finalPrice = calculateTotal();
        addToCart({
            ...product,
            price: finalPrice,
            description: `Spice: ${spiceLevel}, Extras: ${extras.join(", ") || "None"}`,
        }, quantity);
        toast.success("Order Updated", {
            style: { background: "#1c1c1c", color: "#d4af37", border: "1px solid #333" }
        });
    };

    return (
        <div className="bg-[#1c1c1c] min-h-screen text-[#e5e5e5] font-serif selection:bg-[#d4af37] selection:text-black">
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                total={total}
                storeSlug={storeSlug}
                onSuccess={clearCart}
            />

            <nav className="fixed w-full z-40 bg-[#1c1c1c]/90 backdrop-blur-md border-b border-white/5">
                <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href={basePath} className="flex items-center gap-2 group">
                        <div className="p-2 border border-white/10 rounded-full group-hover:border-[#d4af37] transition-colors">
                            <ArrowLeft className="w-4 h-4 text-[#d4af37]" />
                        </div>
                        <span className="font-sans text-xs uppercase tracking-[0.2em] group-hover:text-[#d4af37] transition-colors">Back to Menu</span>
                    </Link>
                    <div className="font-serif text-2xl font-bold text-[#d4af37] tracking-widest uppercase">
                        {storeName}
                    </div>
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="bg-[#d4af37] hover:bg-white hover:text-black text-black px-6 py-2  font-sans font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        <span className="hidden sm:inline">My Order</span>
                        {cart.length > 0 && (
                            <span className="bg-black text-[#d4af37] w-5 h-5 flex items-center justify-center text-[10px] ml-1 font-bold">
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

            <div className="pt-32 pb-24 max-w-[1000px] mx-auto px-6">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid md:grid-cols-2 gap-12 items-start"
                >
                    {/* Hero Image */}
                    <div className="relative aspect-square md:aspect-[4/5]">
                        <div className="absolute inset-0 border border-white/10 transform translate-x-4 translate-y-4"></div>
                        <div className="relative h-full w-full overflow-hidden bg-[#2a2a2a]">
                            <img
                                src={product.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop"}
                                alt={product.name}
                                className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute top-6 left-6 flex flex-col gap-2">
                                <div className="bg-black/80 backdrop-blur px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-widest text-[#d4af37] border border-[#d4af37]/30 w-fit">
                                    Chef's Signature
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <div className="flex justify-between items-start gap-4 mb-6 border-b border-white/10 pb-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-medium text-[#d4af37] mb-4">{product.name}</h1>
                                <p className="text-gray-400 font-sans font-light leading-relaxed text-sm">{product.description || "A delicious culinary masterpiece prepared with locally sourced ingredients and our chef's secret blend of spices."}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 mb-12">
                            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-gray-500">
                                <ChefHat className="w-4 h-4 text-[#d4af37]" />
                                20 min prep
                            </div>
                            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-gray-500">
                                <Utensils className="w-4 h-4 text-[#d4af37]" />
                                Serves 2
                            </div>
                            <div className="flex items-center gap-1 text-[#d4af37]">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="font-sans font-bold ml-1 text-sm">4.9</span>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Spice Level */}
                            <div>
                                <h3 className="font-sans text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Spice Level | Intensity</h3>
                                <div className="flex gap-2">
                                    {['Mild', 'Medium', 'Hot', 'Crazy'].map(level => (
                                        <button
                                            key={level}
                                            onClick={() => setSpiceLevel(level)}
                                            className={`flex-1 py-3 border text-xs font-sans font-bold uppercase tracking-widest transition-all ${spiceLevel === level
                                                ? 'border-[#d4af37] bg-[#d4af37] text-black'
                                                : 'border-white/10 text-gray-400 hover:border-white/30'
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Add-ons */}
                            <div>
                                <h3 className="font-sans text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Enhancements</h3>
                                <div className="space-y-2">
                                    {availableExtras.map(extra => (
                                        <button
                                            key={extra.name}
                                            onClick={() => toggleExtra(extra.name)}
                                            className={`w-full flex justify-between items-center p-4 border transition-all ${extras.includes(extra.name)
                                                ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]'
                                                : 'border-white/10 text-gray-400 hover:border-white/30'
                                                }`}
                                        >
                                            <span className="font-sans text-xs font-bold uppercase tracking-widest">{extra.name}</span>
                                            <span className="font-mono text-xs">+₦{extra.price.toLocaleString()}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity & Buy */}
                            <div className="pt-8 border-t border-white/10">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="text-3xl font-mono text-[#d4af37]">
                                        ₦{(calculateTotal() * quantity).toLocaleString()}
                                    </div>
                                    <div className="flex items-center border border-white/20">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 text-[#d4af37]"><Minus className="w-4 h-4" /></button>
                                        <span className="w-12 text-center font-mono">{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 text-[#d4af37]"><Plus className="w-4 h-4" /></button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-[#d4af37] text-black py-4 font-sans font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors mb-8"
                                >
                                    Add to Order
                                </button>

                                {/* Dietary & Ingredients Accordion */}
                                <div className="space-y-4 pt-4 border-t border-white/10">
                                    <details className="group">
                                        <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-sans font-bold uppercase tracking-widest text-gray-500 hover:text-[#d4af37] transition-colors">
                                            <span>Ingredients</span>
                                            <span className="transition group-open:rotate-180">
                                                <ChevronRight className="w-4 h-4" />
                                            </span>
                                        </summary>
                                        <div className="mt-4 text-sm text-gray-400 font-light leading-relaxed">
                                            Premium Aged Steak, Organic Rosemary, Garlic Infused Butter, Himalayan Pink Salt, Black Pepper.
                                            <br /><br />
                                            <span className="text-[#d4af37] font-bold">Allergens:</span> Dairy, Garlic.
                                        </div>
                                    </details>

                                    <details className="group">
                                        <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-sans font-bold uppercase tracking-widest text-gray-500 hover:text-[#d4af37] transition-colors">
                                            <span>Nutritional Info</span>
                                            <span className="transition group-open:rotate-180">
                                                <ChevronRight className="w-4 h-4" />
                                            </span>
                                        </summary>
                                        <div className="mt-4 text-sm text-gray-400">
                                            <div className="grid grid-cols-2 gap-2 max-w-[200px]">
                                                <div>Calories</div><div className="text-right text-white">850 kcal</div>
                                                <div>Protein</div><div className="text-right text-white">62g</div>
                                                <div>Carbs</div><div className="text-right text-white">12g</div>
                                                <div>Fat</div><div className="text-right text-white">45g</div>
                                            </div>
                                        </div>
                                    </details>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
