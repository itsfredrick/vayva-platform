import React, { useState, useEffect } from "react";
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
    Heart,
    Globe,
    Users,
    HandHeart,
    ArrowRight,
    Repeat,
    Calendar,
    CheckCircle
} from "lucide-react";
import { StorefrontSEO } from "./StorefrontSEO";
import { motion, AnimatePresence } from "framer-motion";
import { useCartQuery, useStorefrontQuery } from "@/hooks/storefront/useStorefrontQuery";

export function GiveFlow({
    storeName: initialStoreName,
    storeSlug,
    config: configOverride,
}: {
    storeName: string;
    storeSlug?: string;
    config?: any;
}) {
    const { store } = useStorefrontStore(storeSlug);
    const { products, isLoading } = useStorefrontProducts(storeSlug, {
        limit: 3,
    });

    // Config Merging logic
    const config = {
        primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#059669",
        heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "Together, We Can Change Lives Forever.",
        heroDesc: configOverride?.heroDesc || store?.templateConfig?.heroDesc || "Your contribution directly provides essential resources, education, and clean water to communities in urgent need.",
        accentColor: configOverride?.accentColor || store?.templateConfig?.accentColor || "#14b8a6",
    };

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

    useCartQuery(isCartOpen, setIsCartOpen);

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Donation State
    const [donationType, setDonationType] = useState<"once" | "monthly">("once");

    // Deep Link Donation Type
    const { searchParams, updateQuery } = useStorefrontQuery();
    const typeParam = searchParams.get("type");

    useEffect(() => {
        if (typeParam === "monthly" || typeParam === "once") {
            setDonationType(typeParam as "monthly" | "once");
        }
    }, [typeParam]);

    const handleSetDonationType = (type: "once" | "monthly") => {
        setDonationType(type);
        updateQuery("type", type === "once" ? null : type);
    };
    const [customAmount, setCustomAmount] = useState("");
    const [raisedAmount, setRaisedAmount] = useState(1250000);
    const goalAmount = 2000000;

    // Simulate live donations
    useEffect(() => {
        const interval = setInterval(() => {
            setRaisedAmount(prev => Math.min(prev + Math.floor(Math.random() * 5000), goalAmount));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const displayName = store?.name || initialStoreName;
    const progress = (raisedAmount / goalAmount) * 100;

    return (
        <div className="bg-emerald-50 min-h-screen font-sans text-emerald-950 selection:bg-emerald-200">
            <StorefrontSEO store={store} products={products} />
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                total={total}
                storeSlug={storeSlug || ""}
                onSuccess={clearCart}
            />

            <StorefrontCart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                storeSlug={storeSlug || ""}
                onCheckout={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                }}
            />

            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-emerald-100 shadow-sm sticky top-0 z-50 transition-all">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: config.primaryColor, boxShadow: `0 10px 15px -3px ${config.primaryColor}33` }}>
                            <Heart className="w-5 h-5 fill-current animate-pulse-slow" />
                        </div>
                        <span className="font-bold text-xl text-emerald-900 tracking-tight">{displayName}</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 font-medium text-emerald-700 text-sm">
                        <a href="#" className="hover:text-emerald-900 transition-colors">Our Mission</a>
                        <a href="#" className="hover:text-emerald-900 transition-colors">Impact</a>
                        <a href="#" className="hover:text-emerald-900 transition-colors">Get Involved</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="hidden md:flex text-white px-6 py-2.5 rounded-full font-bold shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                            style={{ backgroundColor: config.primaryColor, boxShadow: `0 10px 15px -3px ${config.primaryColor}33` }}
                        >
                            Donate Now <Heart className="w-4 h-4 fill-white/20" />
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-emerald-800"
                        >
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-emerald-100 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-4 font-bold text-emerald-800">
                            <a href="#" onClick={() => setIsMenuOpen(false)}>Our Mission</a>
                            <a href="#" onClick={() => setIsMenuOpen(false)}>Impact</a>
                            <a href="#" onClick={() => setIsMenuOpen(false)}>Login</a>
                            <button
                                onClick={() => { setIsCartOpen(true); setIsMenuOpen(false); }}
                                className="text-white px-6 py-4 rounded-xl shadow-lg mt-2"
                                style={{ backgroundColor: config.primaryColor }}
                            >
                                Donate Now
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero */}
            <header className="py-24 px-6 text-center max-w-5xl mx-auto relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl -z-10 animate-pulse-slow delay-1000"></div>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-emerald-100 text-emerald-800 rounded-full text-xs font-bold mb-8 shadow-sm">
                    <Globe className="w-4 h-4" style={{ color: config.primaryColor }} /> Global Relief Initiative 2024
                </div>
                <h1 className="text-5xl md:text-7xl font-black mb-8 text-emerald-950 leading-tight tracking-tight">
                    {config.heroTitle}
                </h1>
                <p className="text-xl text-emerald-800/70 mb-12 max-w-2xl mx-auto leading-relaxed">
                    {config.heroDesc}
                </p>

                {/* Impact Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
                    {[
                        { val: "10K+", label: "Lives Impacted", icon: Users },
                        { val: "50+", label: "Villages Served", icon: Globe },
                        { val: "100%", label: "Transparency", icon: CheckCircle },
                        { val: "$2M", label: "Goal for 2024", icon: Heart }
                    ].map((stat, i) => (
                        <div key={i} className="p-6 bg-white rounded-2xl shadow-sm border border-emerald-50 hover:-translate-y-1 transition-transform">
                            <stat.icon className="w-6 h-6 mx-auto mb-3" style={{ color: `${config.primaryColor}40` }} />
                            <div className="text-3xl font-black mb-1" style={{ color: config.primaryColor }}>{stat.val}</div>
                            <div className="text-xs font-bold uppercase text-emerald-900/40 tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Goal Progress Bar */}
                <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-emerald-100 relative overflow-hidden">
                    <div className="flex justify-between items-end mb-2">
                        <div className="text-left">
                            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Total Raised</div>
                            <div className="text-2xl font-black text-emerald-900 animate-count-up">₦{raisedAmount.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Goal</div>
                            <div className="text-xl font-bold text-emerald-900/50">₦{goalAmount.toLocaleString()}</div>
                        </div>
                    </div>

                    <div className="h-4 bg-emerald-100 rounded-full overflow-hidden relative">
                        <motion.div
                            className="h-full rounded-full relative"
                            style={{ backgroundImage: `linear-gradient(to right, ${config.primaryColor}, ${config.accentColor})` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        >
                            <div className="absolute top-0 left-0 w-full h-full bg-white/30 animate-[shimmer_2s_infinite]"></div>
                        </motion.div>
                    </div>
                    <div className="mt-2 text-right text-xs font-bold text-emerald-500">{Math.round(progress)}% Funded</div>
                </div>
            </header>

            {/* Donation Options */}
            <main className="max-w-6xl mx-auto px-6 pb-24" id="donate">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-emerald-900 mb-6">Choose Your Impact</h2>

                    {/* Recurring Toggle */}
                    <div className="inline-flex bg-emerald-100 p-1 rounded-xl">
                        <button
                            onClick={() => handleSetDonationType('once')}
                            className={`px-8 py-3 rounded-lg font-bold text-sm transition-all ${donationType === 'once' ? 'bg-white text-emerald-900 shadow-sm' : 'text-emerald-700 hover:text-emerald-900'}`}
                        >
                            One-Time
                        </button>
                        <button
                            onClick={() => handleSetDonationType('monthly')}
                            className={`px-8 py-3 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${donationType === 'monthly' ? 'bg-white text-emerald-900 shadow-sm' : 'text-emerald-700 hover:text-emerald-900'}`}
                        >
                            <Repeat className="w-3 h-3" /> Monthly
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => <div key={i} className="h-96 bg-emerald-100/50 rounded-3xl animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        {products.length > 0 ? products.map((product, idx) => (
                            <motion.article
                                key={product.id}
                                whileHover={{ y: -8 }}
                                className={`bg-white rounded-3xl p-8 border transition-all relative overflow-hidden ${idx === 1 ? 'border-emerald-500 shadow-2xl shadow-emerald-200 ring-4 ring-emerald-50 scale-105 z-10' : 'border-emerald-100 shadow-lg hover:shadow-xl'}`}
                            >
                                {idx === 1 && (
                                    <div className="absolute top-0 left-0 w-full bg-emerald-500 text-white text-center text-xs font-bold py-1.5 uppercase tracking-widest">
                                        Most Popular Impact
                                    </div>
                                )}

                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 ${idx === 1 ? 'bg-emerald-100' : 'bg-emerald-50'}`}>
                                    {idx === 0 ? <Globe className="w-8 h-8" /> : idx === 1 ? <Users className="w-8 h-8" /> : <HandHeart className="w-8 h-8" />}
                                </div>

                                <h3 className="font-bold text-xl text-emerald-950 mb-2">{product.name}</h3>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-black text-emerald-600">₦{donationType === 'monthly' ? Math.round(product.price / 10).toLocaleString() : product.price.toLocaleString()}</span>
                                    {donationType === 'monthly' && <span className="text-sm font-bold text-emerald-400">/mo</span>}
                                </div>

                                <div className="bg-emerald-50 rounded-xl p-4 mb-8">
                                    <p className="text-emerald-800 text-sm font-medium leading-relaxed">
                                        Provides <strong className="text-emerald-900">200 meals</strong> for families affected by the crisis in the region.
                                    </p>
                                </div>

                                <button
                                    onClick={() => addToCart(product)}
                                    className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group ${idx === 1 ? 'text-white shadow-lg' : 'bg-white border-2 border-emerald-100 text-emerald-900 hover:border-emerald-200 hover:bg-emerald-50'}`}
                                    style={idx === 1 ? { backgroundColor: config.primaryColor, boxShadow: `0 10px 15px -3px ${config.primaryColor}33` } : {}}
                                >
                                    Donate {donationType === 'monthly' ? 'Monthly' : 'Now'}
                                    <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${idx === 1 ? 'text-white' : 'text-emerald-900'}`} />
                                </button>
                            </motion.article>
                        )) : (
                            // Empty State
                            [1, 2, 3].map((i) => (
                                <div key={i} className="col-span-1 text-center py-12 border-2 border-dashed border-emerald-200 rounded-3xl opacity-50">
                                    <Heart className="w-8 h-8 text-emerald-300 mx-auto mb-4" />
                                    <p className="text-emerald-500 font-bold">Donations Loading...</p>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Trust Badges */}
                <div className="mt-24 pt-12 border-t border-emerald-100 flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Using text for logos to avoid external images for generic placeholders */}
                    <span className="font-serif text-2xl font-bold text-emerald-900">TheGuardian</span>
                    <span className="font-bold text-xl text-emerald-900 flex items-center gap-1"><Globe className="w-5 h-5" /> GlobalGiving</span>
                    <span className="font-sans text-xl font-black text-emerald-900 tracking-tighter">UNICEF</span>
                    <span className="font-mono text-xl font-bold text-emerald-900">CharityWater</span>
                </div>
            </main>

            <footer className="bg-emerald-900 text-emerald-100 py-16 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 relative z-10">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-6 text-white font-bold text-2xl">
                            <Heart className="w-6 h-6 fill-current" style={{ color: config.primaryColor }} /> {displayName}
                        </div>
                        <p className="max-w-sm opacity-70 mb-8 leading-relaxed">
                            We are dedicated to providing transparent, effective aid to those who need it most. 100% of public donations go directly to the field.
                        </p>
                        <div className="flex gap-4">
                            {/* Social Icons Mock */}
                            <div className="w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer"></div>
                            <div className="w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer"></div>
                            <div className="w-10 h-10 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer"></div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">About</h4>
                        <ul className="space-y-4 opacity-70 text-sm">
                            <li><a href="#" className="hover:text-white hover:underline">Our Story</a></li>
                            <li><a href="#" className="hover:text-white hover:underline">Financials</a></li>
                            <li><a href="#" className="hover:text-white hover:underline">Careers</a></li>
                            <li><a href="#" className="hover:text-white hover:underline">Press</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Support</h4>
                        <ul className="space-y-4 opacity-70 text-sm">
                            <li><a href="#" className="hover:text-white hover:underline">Help Center</a></li>
                            <li><a href="#" className="hover:text-white hover:underline">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white hover:underline">Donate Stock</a></li>
                            <li><a href="#" className="hover:text-white hover:underline">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-emerald-800 text-center opacity-40 text-sm">
                    <p>&copy; {new Date().getFullYear()} {displayName}. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
