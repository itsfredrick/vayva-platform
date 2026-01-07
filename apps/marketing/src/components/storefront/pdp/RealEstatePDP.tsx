"use client";

import React, { useState } from "react";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { ProductData } from "@/hooks/storefront/useStorefront";
import { StorefrontCart } from "../StorefrontCart";
import { CheckoutModal } from "../CheckoutModal";
import { ChevronRight, Calendar, MapPin, BedDouble, Bath, Square, Home, Heart, Share2, Phone, Calculator, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

export function RealEstatePDP({
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
    const [activeTab, setActiveTab] = useState("details");
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Wishlist Logic
    const [isSaved, setIsSaved] = useState(false);
    const toggleSave = () => {
        setIsSaved(!isSaved);
        toast.message(isSaved ? "Removed from Saved Homes" : "Added to Saved Homes", {
            description: isSaved ? "Property removed from your list." : "Property saved for later viewing."
        });
    };

    // Mortgage Calculator State
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [homePrice, setHomePrice] = useState(product.price || 500000);
    const [downPayment, setDownPayment] = useState(product.price * 0.2 || 100000); // 20% default
    const [interestRate, setInterestRate] = useState(6.5);
    const [loanTerm, setLoanTerm] = useState(30);

    const calculatePayment = () => {
        const principal = homePrice - downPayment;
        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm * 12;

        if (monthlyRate === 0) return principal / numberOfPayments;

        const monthlyPayment =
            (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

        return Math.round(monthlyPayment).toLocaleString();
    };


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
        "https://images.unsplash.com/photo-1600596542815-6ad4c728fd78?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1000&auto=format&fit=crop"
    ].filter(Boolean) as string[];

    const handleReserve = () => {
        addToCart({
            ...product,
            price: 50000,
            name: `Reservation Deposit: ${product.name}`,
            description: "Refundable holding deposit",
        }, 1);
        toast.success("Deposit Added", { description: "Proceed to checkout to secure your viewing reservation." });
    };

    return (
        <div className="bg-stone-50 min-h-screen text-stone-900 font-serif selection:bg-stone-200">
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                total={total}
                storeSlug={storeSlug}
                onSuccess={clearCart}
            />

            {/* Mortgage Calculator Modal */}
            <AnimatePresence>
                {isCalculatorOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
                            onClick={() => setIsCalculatorOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-md p-8 rounded-sm shadow-2xl relative z-10 font-sans"
                        >
                            <button onClick={() => setIsCalculatorOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-stone-500" />
                            </button>
                            <h3 className="font-serif text-2xl font-bold mb-6 text-stone-900">Mortgage Estimator</h3>

                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="text-xs font-bold uppercase text-stone-500 mb-1 block tracking-widest">Home Price</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-serif">₦</span>
                                        <input type="number" value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value))} className="w-full pl-8 p-3 bg-stone-50 border border-stone-200 focus:border-stone-900 outline-none transition-colors font-bold text-stone-900" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase text-stone-500 mb-1 block tracking-widest">Down Payment</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-serif">₦</span>
                                            <input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="w-full pl-8 p-3 bg-stone-50 border border-stone-200 focus:border-stone-900 outline-none transition-colors font-bold text-stone-900" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-stone-500 mb-1 block tracking-widest">Rate %</label>
                                        <input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full p-3 bg-stone-50 border border-stone-200 focus:border-stone-900 outline-none transition-colors font-bold text-stone-900" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-stone-900 text-white p-6 text-center">
                                <div className="text-xs font-bold uppercase text-stone-400 mb-2 tracking-widest">Estimated Monthly Payment</div>
                                <div className="text-4xl font-serif">₦{calculatePayment()}</div>
                                <p className="text-stone-500 text-xs mt-2">*Taxes and insurance not included.</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Elegant Header */}
            <nav className="fixed w-full z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href={basePath} className="text-xl tracking-widest uppercase font-medium hover:opacity-70 transition-opacity">
                        {storeName} <span className="text-stone-400">Estates</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex gap-6 text-xs font-bold uppercase tracking-widest text-stone-500">
                            <button className="hover:text-stone-900" onClick={() => setIsCalculatorOpen(true)}>Mortgage Calc</button>
                            <Link href={`${basePath}#contact`} className="hover:text-stone-900">Contact Agent</Link>
                        </div>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="text-stone-600 hover:text-stone-900 flex items-center gap-2"
                        >
                            <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Deposits</span>
                            <div className="relative p-2 bg-stone-100 rounded-full">
                                <Calendar className="w-4 h-4" />
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-stone-900 text-white text-[10px] flex items-center justify-center rounded-full">
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

            <div className="pt-20">
                {/* Hero Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-[60vh] gap-1">
                    <div className="md:col-span-2 lg:col-span-2 h-full bg-stone-200 relative group overflow-hidden">
                        <img src={images[0]} alt="Main" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

                        {/* Overlay Controls */}
                        <div className="absolute bottom-6 left-6 flex gap-4">
                            <button
                                onClick={toggleSave}
                                className={`flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors ${isSaved ? 'text-red-600' : 'text-stone-900'}`}
                            >
                                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} /> {isSaved ? 'Saved' : 'Save Property'}
                            </button>
                            <button
                                onClick={() => setIsCalculatorOpen(true)}
                                className="flex items-center gap-2 bg-stone-900/90 backdrop-blur text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-stone-900 transition-colors"
                            >
                                <Calculator className="w-4 h-4" /> Estimate Payment
                            </button>
                        </div>
                    </div>
                    <div className="hidden md:block h-full bg-stone-200 relative group overflow-hidden">
                        <img src={images[1]} alt="Interior 1" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    </div>
                    <div className="hidden lg:grid grid-rows-2 gap-1 h-full">
                        <div className="bg-stone-200 relative group overflow-hidden h-full">
                            <img src={images[2]} alt="Interior 2" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        </div>
                        <div className="bg-stone-200 relative group overflow-hidden h-full flex items-center justify-center cursor-pointer hover:bg-stone-300 transition-colors">
                            <span className="text-stone-600 uppercase tracking-widest text-sm font-bold border-b border-stone-600 pb-1">View All Photos</span>
                        </div>
                    </div>
                </div>

                <div className="max-w-[1400px] mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Breadcrumb */}
                            <div className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-widest mb-6 border-b border-stone-200 pb-6">
                                <Link href={basePath} className="hover:text-stone-900">Properties</Link>
                                <ChevronRight className="w-3 h-3" />
                                <span>For Sale</span>
                                <ChevronRight className="w-3 h-3" />
                                <span className="text-stone-900">{product.name}</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-medium text-stone-900 mb-2">{product.name}</h1>
                            <div className="flex items-center gap-2 text-stone-500 mb-8">
                                <MapPin className="w-4 h-4" />
                                <span className="font-sans text-sm">Victoria Island, Lagos (Mock Location)</span>
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-stone-200 mb-8 font-sans">
                                <div className="flex items-center gap-3">
                                    <BedDouble className="w-6 h-6 text-stone-400" />
                                    <div>
                                        <div className="text-xs text-stone-500 uppercase font-bold">Bedrooms</div>
                                        <div className="font-medium text-lg">4</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Bath className="w-6 h-6 text-stone-400" />
                                    <div>
                                        <div className="text-xs text-stone-500 uppercase font-bold">Bathrooms</div>
                                        <div className="font-medium text-lg">3.5</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Square className="w-6 h-6 text-stone-400" />
                                    <div>
                                        <div className="text-xs text-stone-500 uppercase font-bold">Sq Ft</div>
                                        <div className="font-medium text-lg">3,200</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Home className="w-6 h-6 text-stone-400" />
                                    <div>
                                        <div className="text-xs text-stone-500 uppercase font-bold">Type</div>
                                        <div className="font-medium text-lg">Villa</div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="prose prose-stone max-w-none font-sans text-stone-600 leading-relaxed mb-12">
                                <h3 className="text-xl font-medium text-stone-900 mb-4 font-serif">About this property</h3>
                                <p>
                                    {product.description || "A masterpiece of modern luxury, this exclusive residence offers unparalleled views and amenities. Designed by world-renowned architects, every detail has been carefully selected to create a living space of extraordinary refinement. Featuring floor-to-ceiling windows, imported marble flooring, and smart home integration typical of a property of this caliber."}
                                </p>
                            </div>
                        </div>

                        {/* Sidebar Agent Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-stone-100 rounded-sm sticky top-24">
                                <div className="text-3xl font-medium text-stone-900 mb-2">₦{product.price.toLocaleString()}</div>
                                <div className="text-stone-500 text-sm font-sans mb-8 flex justify-between">
                                    <span>Guide Price</span>
                                    <button onClick={() => setIsCalculatorOpen(true)} className="text-stone-900 hover:underline flex items-center gap-1 font-bold">
                                        <Calculator className="w-3 h-3" /> Est. Payment
                                    </button>
                                </div>

                                <button
                                    onClick={handleReserve}
                                    className="w-full bg-stone-900 text-white font-sans font-bold uppercase tracking-widest py-4 text-xs hover:bg-stone-800 transition-colors mb-4 flex items-center justify-center gap-2"
                                >
                                    <Calendar className="w-4 h-4" /> Reserve Viewing (Deposit)
                                </button>

                                <button className="w-full border border-stone-200 text-stone-900 font-sans font-bold uppercase tracking-widest py-4 text-xs hover:border-stone-900 transition-colors mb-8 flex items-center justify-center gap-2">
                                    <Phone className="w-4 h-4" /> Request Callback
                                </button>

                                <div className="flex items-center gap-4 pt-8 border-t border-stone-100" id="contact">
                                    <div className="w-12 h-12 bg-stone-200 rounded-full overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="font-sans">
                                        <div className="text-sm font-bold text-stone-900">James Estate</div>
                                        <div className="text-xs text-stone-500">Senior Broker</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
