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
    Dumbbell,
    Timer,
    Users,
    Trophy,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { StorefrontSEO } from "./StorefrontSEO";

export function FitPhysique({
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
        <div className="bg-slate-950 min-h-screen font-sans text-slate-101 selection:bg-lime-400 selection:text-slate-900">
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
            <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Dumbbell className="w-8 h-8 text-lime-400 -rotate-45" />
                        <span className="font-black text-2xl tracking-tighter text-white uppercase italic">
                            {displayName}
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wider text-slate-400">
                        <a href="#" className="hover:text-lime-400 transition-colors">
                            Classes
                        </a>
                        <a href="#" className="hover:text-lime-400 transition-colors">
                            Trainers
                        </a>
                        <a href="#" className="hover:text-lime-400 transition-colors">
                            Membership
                        </a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors text-white group"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-lime-500 text-slate-900 text-xs font-bold rounded-full flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                        <button
                            className="md:hidden p-2 text-white"
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
                <div className="fixed inset-0 z-40 bg-slate-950 pt-24 px-6 md:hidden">
                    <div className="flex flex-col gap-6 text-xl font-bold uppercase italic">
                        <a href="#" className="py-4 border-b border-slate-800 text-lime-400">
                            Classes
                        </a>
                        <a href="#" className="py-4 border-b border-slate-800">
                            Trainers
                        </a>
                        <a href="#" className="py-4 border-b border-slate-800">
                            Membership
                        </a>
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
            <header className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-lime-500/10 -skew-x-12 translate-x-1/4 blur-3xl rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-blue-600/10 skew-y-12 -translate-x-1/4 blur-3xl rounded-full"></div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime-500/10 text-lime-400 rounded border border-lime-500/20 text-xs font-bold uppercase tracking-widest mb-6">
                            <span className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></span>
                            Now Open for Members
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase italic leading-[0.9] text-white mb-8">
                            Push <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-green-500">Limits</span>
                            <br />
                            Break <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Barriers</span>
                        </h1>
                        <p className="text-lg text-slate-400 mb-10 max-w-lg leading-relaxed font-medium">
                            Elite training facilities, world-class coaches, and a community that drives you forward. Join the revolution today.
                        </p>
                        <div className="flex gap-4">
                            <button
                                className="px-8 py-4 bg-lime-500 text-slate-950 font-black uppercase tracking-wider hover:bg-lime-400 transition-all transform hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(132,204,22,0.4)] clip-path-slant"
                                onClick={() => {
                                    document.getElementById('classes')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                Join a Class
                            </button>
                            <button className="px-8 py-4 bg-slate-800 text-white font-bold uppercase tracking-wider hover:bg-slate-700 transition-all">
                                View Plans
                            </button>
                        </div>
                    </div>
                    <div className="relative hidden lg:block">
                        <div className="relative z-10 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <Image
                                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
                                alt="Gym Workout"
                                className="w-full h-auto object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                                width={800}
                                height={600}
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                            <div className="absolute bottom-6 left-6">
                                <div className="text-lime-400 font-bold text-xl uppercase italic">HIIT Zone</div>
                                <p className="text-slate-300 text-sm">High Intensity Interval Training</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Bar */}
            <section className="border-y border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-800">
                    <div className="p-8 text-center group hover:bg-slate-800/50 transition-colors">
                        <Trophy className="w-8 h-8 text-lime-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-3xl font-black text-white italic">25+</div>
                        <div className="text-xs font-bold uppercase text-slate-500">Awards Won</div>
                    </div>
                    <div className="p-8 text-center group hover:bg-slate-800/50 transition-colors">
                        <Users className="w-8 h-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-3xl font-black text-white italic">1k+</div>
                        <div className="text-xs font-bold uppercase text-slate-500">Active Members</div>
                    </div>
                    <div className="p-8 text-center group hover:bg-slate-800/50 transition-colors">
                        <Dumbbell className="w-8 h-8 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-3xl font-black text-white italic">50+</div>
                        <div className="text-xs font-bold uppercase text-slate-500">Equipment</div>
                    </div>
                    <div className="p-8 text-center group hover:bg-slate-800/50 transition-colors">
                        <Timer className="w-8 h-8 text-red-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <div className="text-3xl font-black text-white italic">24/7</div>
                        <div className="text-xs font-bold uppercase text-slate-500">Access</div>
                    </div>
                </div>
            </section>

            {/* Classes / Products */}
            <main id="classes" className="py-24 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <span className="text-lime-400 font-bold uppercase tracking-widest mb-2 block">Train Like A Pro</span>
                        <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase">Class Schedule</h2>
                    </div>
                    <button className="text-slate-400 hover:text-white font-bold uppercase flex items-center gap-2 transition-colors">
                        View Full Calendar <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-96 bg-slate-900 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.length > 0 ? (
                            products.map((cls) => (
                                <article
                                    key={cls.id}
                                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-lime-500/50 transition-all hover:-translate-y-2 group cursor-pointer"
                                    onClick={() => addToCart(cls)}
                                >
                                    <div className="h-64 overflow-hidden relative">
                                        <Image
                                            src={cls.image || `https://source.unsplash.com/random/800x600/?crossfit,gym,fitness&sig=${cls.id}`}
                                            alt={cls.name}
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur text-lime-400 px-3 py-1 rounded text-xs font-black uppercase">
                                            60 Min
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-black text-white uppercase italic">{cls.name}</h3>
                                            <div className="text-white font-bold text-lg">₦{cls.price}</div>
                                        </div>
                                        <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                                            {cls.description || "High intensity training to boost endurance and strength."}
                                        </p>
                                        <button className="w-full py-4 bg-slate-800 text-white font-bold uppercase tracking-wider hover:bg-lime-500 hover:text-slate-950 transition-colors rounded-xl flex items-center justify-center gap-2">
                                            Book Spot <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </article>
                            ))
                        ) : (
                            // Empty State
                            [1, 2, 3].map((i) => (
                                <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center h-80">
                                    <Dumbbell className="w-16 h-16 text-slate-800 mb-4" />
                                    <h3 className="text-slate-700 font-bold uppercase italic text-2xl">Class Slot</h3>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>

            {/* Membership CTA */}
            <section className="py-24 px-6 bg-lime-500 text-slate-950">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl md:text-6xl font-black uppercase italic mb-8">Start Your Transformation</h2>
                    <div className="grid md:grid-cols-3 gap-6 text-left max-w-2xl mx-auto mb-12">
                        <div className="flex items-center gap-3 font-bold">
                            <CheckCircle2 className="w-6 h-6 text-slate-950" />
                            Unlimited Access
                        </div>
                        <div className="flex items-center gap-3 font-bold">
                            <CheckCircle2 className="w-6 h-6 text-slate-950" />
                            Personal Plan
                        </div>
                        <div className="flex items-center gap-3 font-bold">
                            <CheckCircle2 className="w-6 h-6 text-slate-950" />
                            Nutrition Guide
                        </div>
                    </div>
                    <button className="px-12 py-5 bg-slate-950 text-white font-black uppercase tracking-wider text-xl hover:bg-slate-800 transition-colors shadow-2xl">
                        Get Started Now
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-500 py-16 px-6 border-t border-slate-800">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <Dumbbell className="w-6 h-6 text-lime-600 -rotate-45" />
                        <span className="font-black text-xl tracking-tighter text-slate-300 uppercase italic">
                            {displayName}
                        </span>
                    </div>
                    <p className="text-sm font-medium">&copy; 2024. All Gains Reserved.</p>
                </div>
            </footer>
        </div>
    );
}
