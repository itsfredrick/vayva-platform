"use client";

import React, { useState } from "react";
import { ProductData } from "@/hooks/storefront/useStorefront";
import { ChevronRight, Calendar, Clock, CheckCircle, Star, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function ServicePDP({
    product,
    storeSlug,
    storeName,
    basePath = "",
    relatedProducts = []
}: {
    product: ProductData;
    storeSlug: string;
    storeName: string;
    basePath?: string;
    relatedProducts?: ProductData[];
}) {
    const [selectedDate, setSelectedDate] = useState<number | null>(null);

    // Mock Calendar
    const dates = Array.from({ length: 7 }, (_, i) => i + 1);

    return (
        <div className="bg-rose-50/30 min-h-screen text-stone-800 font-sans">
            <nav className="border-b border-rose-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href={basePath} className="font-serif text-2xl text-rose-900 font-bold">{storeName}</Link>
                    <button className="text-rose-900 text-sm font-bold uppercase tracking-widest hover:underline">My Bookings</button>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <Link href={basePath} className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-stone-400 mb-6 hover:text-stone-600">
                    <ChevronRight className="w-4 h-4 rotate-180" /> Back to Services
                </Link>

                <div className="bg-white rounded-3xl shadow-xl shadow-rose-900/5 overflow-hidden border border-rose-100">
                    <div className="grid md:grid-cols-2">
                        <div className="h-64 md:h-auto bg-stone-200">
                            <img src={product.image || ""} className="w-full h-full object-cover" alt={product.name} />
                        </div>
                        <div className="p-8 md:p-12">
                            <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                                {product.category || "Treatment"}
                            </span>
                            <h1 className="font-serif text-3xl md:text-4xl text-rose-950 mb-4 font-bold">{product.name}</h1>

                            <div className="flex items-center gap-6 text-sm text-stone-500 mb-8 border-b border-rose-50 pb-8">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-rose-400" />
                                    <span>60 Minutes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-rose-400" />
                                    <span>Specific Specialist</span> // Should be dynamic
                                </div>
                            </div>

                            <div className="mb-8">
                                <p className="text-stone-600 leading-relaxed mb-4">
                                    {product.description || "Relax and rejuvenate with our signature treatment. Designed to restore balance and enhance your natural beauty."}
                                </p>
                                <ul className="space-y-2">
                                    {['Premium Products', 'Consultation Included', 'Private Suite'].map(item => (
                                        <li key={item} className="flex items-center gap-2 text-sm text-stone-600">
                                            <CheckCircle className="w-4 h-4 text-rose-300" /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex items-center justify-between mb-8 p-4 bg-rose-50 rounded-xl border border-rose-100">
                                <div>
                                    <span className="block text-xs uppercase text-rose-400 font-bold tracking-wider">Total Price</span>
                                    <span className="text-2xl font-bold text-rose-900">₦{product.price.toLocaleString()}</span>
                                </div>
                                <div className="text-right">
                                    <div className="flex text-yellow-500 justify-end">
                                        <Star className="w-3 h-3 fill-current" />
                                        <Star className="w-3 h-3 fill-current" />
                                        <Star className="w-3 h-3 fill-current" />
                                        <Star className="w-3 h-3 fill-current" />
                                        <Star className="w-3 h-3 fill-current" />
                                    </div>
                                    <span className="text-xs text-stone-400">Top Rated Service</span>
                                </div>
                            </div>

                            <h3 className="text-sm font-bold uppercase text-stone-900 mb-4">Select Date</h3>
                            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                                {dates.map(date => (
                                    <button
                                        key={date}
                                        onClick={() => setSelectedDate(date)}
                                        className={`w-14 h-16 rounded-xl flex flex-col items-center justify-center shrink-0 border transition-all ${selectedDate === date
                                                ? 'bg-rose-900 border-rose-900 text-white shadow-lg'
                                                : 'bg-white border-stone-200 text-stone-400 hover:border-rose-300'
                                            }`}
                                    >
                                        <span className="text-xs font-bold">Mon</span>
                                        <span className="text-lg font-bold">{10 + date}</span>
                                    </button>
                                ))}
                            </div>

                            <button className="w-full bg-rose-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                                Book Appointment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
