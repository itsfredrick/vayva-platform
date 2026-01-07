import React, { useState } from "react";
import {
    useStorefrontProducts,
    useStorefrontStore,
    type ProductData,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { StorefrontCart } from "./StorefrontCart";
import {
    ShoppingBag,
    Menu,
    X,
    Star,
    Clock,
    MapPin,
    Scissors,
    Calendar,
    Instagram,
    Facebook,
    Twitter,
    ChevronRight,
    ChevronLeft,
    Quote
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import Link from "next/link"; // Add import
import { StorefrontSEO } from "./StorefrontSEO";

export function GlowSalon({
    storeName: initialStoreName,
    storeSlug,
    basePath,
    config: configOverride,
}: {
    storeName: string;
    storeSlug?: string;
    basePath?: string;
    config?: any;
}) {
    const { store } = useStorefrontStore(storeSlug);

    // Configuration Merging
    const config = {
        primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#881337", // rose-900
        heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "Redefine Your Radiance",
        heroSubtitle: configOverride?.heroSubtitle || store?.templateConfig?.heroSubtitle || "Luxury Beauty Experience",
        accentColor: configOverride?.accentColor || store?.templateConfig?.accentColor || "#1c1917", // stone-900
    };
    const { products, isLoading } = useStorefrontProducts(storeSlug, {
        limit: 12,
    });

    const {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        total,
        isOpen: isCartOpen,
        setIsOpen: setIsCartOpen,
        clearCart,
    } = useStorefrontCart(storeSlug || "");
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<ProductData | null>(null);

    const displayName = store?.name || initialStoreName;

    const stylists = [
        { name: "Elena R.", role: "Master Colorist", img: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=200" },
        { name: "Marco D.", role: "Senior Stylist", img: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=200" },
        { name: "Sarah J.", role: "Treatment Specialist", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" },
    ];

    return (
        <div className="bg-stone-50 min-h-screen font-sans text-stone-800 selection:bg-rose-200">
            <StorefrontSEO store={store} products={products} />
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                total={total}
                storeSlug={storeSlug || ""}
                onSuccess={clearCart}
            />

            {/* Service Detail Modal */}
            <AnimatePresence>
                {selectedService && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setSelectedService(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-none"
                        >
                            <button onClick={() => setSelectedService(null)} className="absolute top-4 right-4 z-20 bg-white/80 p-2 rounded-full hover:bg-white text-stone-900 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="w-full md:w-1/2 h-64 md:h-auto bg-stone-200">
                                <Image
                                    src={selectedService.image || `https://source.unsplash.com/random/800x1000/?hair,salon&sig=${selectedService.id}`}
                                    alt={selectedService.name}
                                    className="object-cover"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                            <div className="p-8 md:w-1/2 flex flex-col justify-center">
                                <span className="text-rose-900 font-bold tracking-widest text-xs uppercase mb-2">Service Details</span>
                                <h3 className="font-serif text-3xl text-stone-900 mb-2">{selectedService.name}</h3>
                                <div className="text-2xl font-light text-stone-600 mb-6 font-serif italic">₦{selectedService.price.toLocaleString()}</div>
                                <p className="text-stone-500 mb-8 leading-relaxed text-sm">
                                    {selectedService.description || "Our signature service begins with a personalized consultation, followed by a luxurious wash and scalp massage. Using only premium organic products, we ensure your hair receives the nourishment it deserves."}
                                </p>
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3 text-sm text-stone-600">
                                        <Clock className="w-4 h-4 text-rose-400" /> 60 Minutes Duration
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-stone-600">
                                        <Star className="w-4 h-4 text-rose-400" /> Includes Consultation
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        addToCart(selectedService);
                                        setSelectedService(null);
                                    }}
                                    className="w-full bg-stone-900 text-white py-4 font-bold uppercase tracking-widest hover:bg-rose-900 transition-colors"
                                >
                                    Book This Service
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-rose-100 font-serif italic text-xl" style={{ backgroundColor: config.primaryColor }}>
                            {displayName.charAt(0)}
                        </div>
                        <span className="font-serif text-2xl tracking-widest text-stone-900 uppercase">
                            {displayName}
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-10 text-xs font-semibold tracking-widest uppercase text-stone-500">
                        <a href="#services" className="hover:text-rose-900 transition-colors">Services</a>
                        <a href="#stylists" className="hover:text-rose-900 transition-colors">Top Stylists</a>
                        <a href="#reviews" className="hover:text-rose-900 transition-colors">Reviews</a>
                        <a href="#contact" className="hover:text-rose-900 transition-colors">Contact</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            className="relative p-2 hover:bg-rose-50 rounded-full transition-colors text-stone-600"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {cart.length > 0 && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-600 rounded-full animate-pulse"></span>
                            )}
                        </button>
                        <button
                            className="md:hidden p-2 text-stone-600"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
                    >
                        <div className="flex flex-col gap-6 text-center text-lg font-serif">
                            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-stone-100">Services</a>
                            <a href="#stylists" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-stone-100">Top Stylists</a>
                            <a href="#reviews" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-stone-100">Reviews</a>
                            <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-stone-100">Contact</a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Shared Cart Component */}
            <StorefrontCart
                storeSlug={storeSlug || ""}
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onCheckout={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                }}
            />

            {/* Hero Section */}
            <header className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <motion.div
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 10 }}
                        className="w-full h-full relative"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2574&auto=format&fit=crop"
                            alt="Salon Interior"
                            className="object-cover brightness-[0.7]"
                            fill
                            priority
                        />
                    </motion.div>
                </div>
                <div className="relative z-10 text-center text-white px-4">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="block text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-semibold"
                        style={{ color: `${config.primaryColor}cc` }}
                    >
                        {config.heroSubtitle}
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="font-serif text-5xl md:text-8xl mb-8 leading-tight"
                    >
                        {config.heroTitle.split(" ").slice(0, -1).join(" ")}
                        <br />
                        <span className="italic">{config.heroTitle.split(" ").slice(-1)}</span>
                    </motion.h1>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="px-12 py-5 backdrop-blur-sm text-white text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-xl"
                        style={{ backgroundColor: `${config.primaryColor}e6` }}
                        onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Book Appointment
                    </motion.button>
                </div>
            </header>

            {/* Features Info */}
            <section className="bg-stone-900 text-stone-300 py-12 px-6 border-b border-stone-800">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-stone-800">
                    <div className="p-4 group">
                        <Clock className="w-6 h-6 mx-auto mb-3 text-rose-400 group-hover:rotate-[360deg] transition-transform duration-700" />
                        <h3 className="text-white font-serif text-lg mb-1">Opening Hours</h3>
                        <p className="text-sm">Mon-Sat: 9am - 8pm</p>
                    </div>
                    <div className="p-4 group">
                        <MapPin className="w-6 h-6 mx-auto mb-3 text-rose-400 group-hover:bounce transition-transform" />
                        <h3 className="text-white font-serif text-lg mb-1">Prime Location</h3>
                        <p className="text-sm">123 Fashion Ave, NY</p>
                    </div>
                    <div className="p-4 group">
                        <Star className="w-6 h-6 mx-auto mb-3 text-rose-400 group-hover:scale-125 transition-transform" />
                        <h3 className="text-white font-serif text-lg mb-1">5-Star Rated</h3>
                        <p className="text-sm">200+ Happy Clients</p>
                    </div>
                </div>
            </section>

            {/* Stylists Carousel */}
            <section id="stylists" className="py-24 bg-white">
                <div className="text-center mb-16">
                    <span className="text-rose-900 text-xs font-bold tracking-widest uppercase block mb-3">Expert Team</span>
                    <h2 className="font-serif text-4xl text-stone-900">Meet Our Stylists</h2>
                </div>
                <div className="flex overflow-x-auto snap-x space-x-8 px-8 pb-8 max-w-7xl mx-auto scrollbar-hide">
                    {stylists.map((stylist, idx) => (
                        <div key={idx} className="snap-center shrink-0 w-[280px] group cursor-pointer">
                            <div className="aspect-[3/4] overflow-hidden rounded-xl mb-6 relative">
                                <Image src={stylist.img} alt={stylist.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="(max-width: 768px) 80vw, 300px" />
                                <div className="absolute inset-0 bg-rose-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <div className="text-center">
                                <h3 className="font-serif text-2xl mb-1">{stylist.name}</h3>
                                <p className="text-rose-900 text-xs font-bold uppercase tracking-widest">{stylist.role}</p>
                            </div>
                        </div>
                    ))}
                    {/* Add more mock items for scroll effect */}
                    {[1, 2].map((i) => (
                        <div key={`mock-${i}`} className="snap-center shrink-0 w-[280px] opacity-30 grayscale pointer-events-none">
                            <div className="aspect-[3/4] bg-stone-200 rounded-xl mb-6"></div>
                            <div className="text-center">
                                <div className="h-6 w-32 bg-stone-100 mx-auto mb-2 rounded"></div>
                                <div className="h-4 w-24 bg-stone-100 mx-auto rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Services Menu */}
            <main id="services" className="py-24 px-6 max-w-7xl mx-auto bg-stone-50">
                <div className="text-center mb-16">
                    <span className="text-rose-900 text-xs font-bold tracking-widest uppercase block mb-3">Our Menu</span>
                    <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6">Curated Services</h2>
                    <div className="w-24 h-1 bg-rose-900 mx-auto"></div>
                </div>

                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-900 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-stone-400 font-serif italic">Preparing your experience...</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {products.length > 0 ? (
                            products.map((service) => (
                                <article key={service.id}>
                                    <Link
                                        href={`${basePath || ""}/products/${service.id}`}
                                        className="group cursor-pointer block"
                                    >
                                        <div className="relative overflow-hidden aspect-[4/5] mb-6 bg-stone-200 rounded-lg">
                                            <Image
                                                src={service.image || `https://source.unsplash.com/random/800x1000/?hair,salon,spa&sig=${service.id}`}
                                                alt={service.name}
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <button
                                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedService(service); }}
                                                    className="bg-white text-stone-900 px-8 py-3 uppercase text-xs font-bold tracking-widest hover:bg-stone-900 hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
                                                >
                                                    Details
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <h3 className="font-serif text-2xl text-stone-900 mb-2 group-hover:text-rose-900 transition-colors">
                                                {service.name}
                                            </h3>
                                            <div className="flex justify-center items-center gap-2 mb-3">
                                                <span className="text-stone-500 font-serif italic text-lg">
                                                    ₦{service.price.toLocaleString()}
                                                </span>
                                                <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                                                <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">60 Mins</span>
                                            </div>
                                        </div>
                                    </Link>
                                </article>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-12 text-stone-400">Services loading...</div>
                        )}
                    </div>
                )}
            </main>

            {/* Testimonials */}
            <section id="reviews" className="py-24 bg-rose-900 text-rose-100 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <Quote className="w-96 h-96 absolute -top-12 -left-12 -rotate-12" />
                </div>
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <div className="flex justify-center gap-1 text-rose-300 mb-8">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-6 h-6 fill-current" />)}
                    </div>
                    <blockquote className="font-serif text-3xl md:text-5xl leading-tight mb-12">
                        "The most luxurious experience I've ever had. My hair has never looked closer to perfection."
                    </blockquote>
                    <cite className="not-italic font-bold tracking-widest uppercase text-sm opacity-70">— Jessica M., Loyal Client</cite>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-stone-900 text-stone-400 py-16 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center text-rose-200 font-serif italic text-xl mb-8">
                        G
                    </div>
                    <div className="flex gap-8 mb-8">
                        <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                    </div>
                    <p className="font-serif text-sm opacity-50">&copy; 2024 {displayName}. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
