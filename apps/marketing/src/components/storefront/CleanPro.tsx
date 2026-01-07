import React, { useState } from "react";
import {
    useStorefrontProducts,
    useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { StorefrontCart } from "./StorefrontCart";
import {
    ShoppingBag,
    Menu,
    X,
    Sparkles,
    ShieldCheck,
    Zap,
    Phone,
    ArrowRight,
    Check,
} from "lucide-react";
import Image from "next/image";
import { StorefrontSEO } from "./StorefrontSEO";

export function CleanPro({
    storeName: initialStoreName,
    storeSlug,
}: {
    storeName: string;
    storeSlug?: string;
}) {
    const { store } = useStorefrontStore(storeSlug);
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

    const displayName = store?.name || initialStoreName;

    return (
        <div className="bg-sky-50 min-h-screen font-sans text-slate-700">
            <StorefrontSEO store={store} products={products} />
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                total={total}
                storeSlug={storeSlug || ""}
                onSuccess={clearCart}
            />

            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white shadow-sm border-b border-sky-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-sky-600 rounded-lg flex items-center justify-center text-white">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight text-slate-900">
                            {displayName}
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
                        <a href="#" className="hover:text-sky-600 transition-colors">Residential</a>
                        <a href="#" className="hover:text-sky-600 transition-colors">Commercial</a>
                        <a href="#" className="hover:text-sky-600 transition-colors">Reviews</a>
                        <a href="#" className="hover:text-sky-600 transition-colors">About Us</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 text-sky-700 font-bold bg-sky-50 px-4 py-2 rounded-full text-sm">
                            <Phone className="w-4 h-4" />
                            <span>555-0123</span>
                        </div>
                        <button
                            className="relative p-2 hover:bg-sky-50 rounded-full transition-colors text-slate-600"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingBag className="w-6 h-6" />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-sky-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                        <button
                            className="md:hidden p-2 text-slate-600"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden">
                    <div className="flex flex-col gap-6 text-lg font-semibold">
                        <a href="#" className="py-2 border-b border-gray-100">Residential</a>
                        <a href="#" className="py-2 border-b border-gray-100">Commercial</a>
                        <a href="#" className="py-2 border-b border-gray-100">Reviews</a>
                        <a href="#" className="py-2 border-b border-gray-100">About Us</a>
                    </div>
                </div>
            )}

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
            <header className="pt-32 pb-20 px-6 bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-sky-50 to-white"></div>
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div>
                        <div className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-6">
                            Rated #1 Cleaning Service
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                            Sparkling Clean,
                            <br />
                            <span className="text-sky-600">Every Single Time.</span>
                        </h1>
                        <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                            Professional, reliable, and thorough cleaning services for your home and office. Book in 60 seconds.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                className="px-8 py-4 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors shadow-lg shadow-sky-200"
                                onClick={() => {
                                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                Book a Clean
                            </button>
                            <button className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                                Get a Quote
                            </button>
                        </div>

                        <div className="mt-10 flex items-center gap-6 text-sm font-medium text-slate-500">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-sky-500" /> Insured
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-sky-500" /> Fast
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-sky-500" /> Satisfaction Guarantee
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-4 bg-sky-100 rounded-3xl transform rotate-3 z-0"></div>
                        <Image
                            src="https://images.unsplash.com/photo-1581578731117-1045293d2f2b?q=80&w=2670&auto=format&fit=crop"
                            alt="Cleaning Service"
                            className="relative z-10 rounded-2xl shadow-xl w-full h-auto object-cover"
                            width={800}
                            height={600}
                            priority
                        />
                    </div>
                </div>
            </header>

            {/* Services Grid */}
            <main id="services" className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Cleaning Packages</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">Choose the perfect plan for your space. No hidden fees.</p>
                </div>

                {isLoading ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-64 bg-white rounded-2xl shadow animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                        {products.length > 0 ? (
                            products.map((service) => (
                                <article
                                    key={service.id}
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden group cursor-pointer"
                                    onClick={() => addToCart(service)}
                                >
                                    <div className="h-48 overflow-hidden relative">
                                        <Image
                                            src={service.image || `https://source.unsplash.com/random/800x600/?cleaning,home&sig=${service.id}`}
                                            alt={service.name}
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-bold text-slate-900">{service.name}</h3>
                                            <div className="text-sky-600 font-bold bg-sky-50 px-2 py-1 rounded text-sm">
                                                ₦{service.price}
                                            </div>
                                        </div>
                                        <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-3">
                                            {service.description || "Comprehensive cleaning service covering all rooms, dusting, vacuuming, and sanitizing."}
                                        </p>
                                        <button className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-sky-600 hover:border-sky-600 hover:text-white transition-all flex items-center justify-center gap-2">
                                            Add to Booking
                                        </button>
                                    </div>
                                </article>
                            ))
                        ) : (
                            // Empty State
                            [1, 2, 3].map((i) => (
                                <div key={i} className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center h-64 text-slate-400">
                                    <Sparkles className="w-8 h-8 mb-2" />
                                    <span className="font-bold">Service Available Soon</span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>

            {/* Trust Section */}
            <section className="bg-slate-900 text-white py-24 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-12">Why Choose {displayName}?</h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="p-6 bg-slate-800 rounded-2xl">
                            <ShieldCheck className="w-12 h-12 text-green-400 mx-auto mb-6" />
                            <h3 className="text-xl font-bold mb-4">Vetted Professionals</h3>
                            <p className="text-slate-400">Every cleaner undergoes strict background checks and training.</p>
                        </div>
                        <div className="p-6 bg-slate-800 rounded-2xl">
                            <Sparkles className="w-12 h-12 text-sky-400 mx-auto mb-6" />
                            <h3 className="text-xl font-bold mb-4">Eco-Friendly</h3>
                            <p className="text-slate-400">We use safe, non-toxic products that are tough on dirt.</p>
                        </div>
                        <div className="p-6 bg-slate-800 rounded-2xl">
                            <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-6" />
                            <h3 className="text-xl font-bold mb-4">Instant Booking</h3>
                            <p className="text-slate-400">Schedule your clean in minutes with our easy online system.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 py-12 px-6 text-center">
                <p className="text-slate-400 text-sm">&copy; 2024 {displayName}. Cleaning made simple.</p>
            </footer>
        </div>
    );
}
