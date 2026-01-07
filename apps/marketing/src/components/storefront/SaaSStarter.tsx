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
    Code,
    Zap,
    Layout,
    Globe,
    CheckCircle,
    ArrowRight,
    Terminal,
    ChevronDown,
    Plus,
} from "lucide-react";
import { StorefrontSEO } from "./StorefrontSEO";
import { motion, AnimatePresence } from "framer-motion";
import { useCartQuery, useStorefrontQuery } from "@/hooks/storefront/useStorefrontQuery";
import { useEffect } from "react";

export function SaaSStarter({
    storeName: initialStoreName,
    storeSlug,
    config: configOverride,
}: {
    storeName: string;
    storeSlug?: string;
    config?: any;
}) {
    const { store } = useStorefrontStore(storeSlug);

    // Configuration Merging
    const config = {
        primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#4f46e5", // Indigo 600
        heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "Ship products at warp speed.",
        heroDesc: configOverride?.heroDesc || store?.templateConfig?.heroDesc || "The ultimate boilerplate for developers. Includes authentication, payments, database, and email - all pre-configured so you can focus on building.",
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

    useCartQuery(isCartOpen, setIsCartOpen);

    // Premium State
    const { searchParams, updateQuery } = useStorefrontQuery();
    const billingParam = searchParams.get("billing");
    const [billingCycle, setBillingCycle] = useState<"monthly" | "lifetime">(
        (billingParam === "monthly" || billingParam === "lifetime") ? billingParam : "lifetime"
    );

    // Sync Billing URL -> State
    useEffect(() => {
        if (billingParam && (billingParam === "monthly" || billingParam === "lifetime") && billingParam !== billingCycle) {
            setBillingCycle(billingParam);
        }
    }, [billingParam, billingCycle]);

    // Sync Billing State -> URL
    useEffect(() => {
        if (billingCycle !== "lifetime") {
            updateQuery("billing", billingCycle);
        } else if (billingParam) {
            updateQuery("billing", null);
        }
    }, [billingCycle, billingParam, updateQuery]);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const displayName = store?.name || initialStoreName;

    const faqs = [
        { q: "Can I use this for client projects?", a: "Yes! The Enterprise bundle allows unlimited client projects." },
        { q: "What tech stack is this built on?", a: "We use Next.js 14, Tailwind CSS, Prisma, and Supabase." },
        { q: "Is there a refund policy?", a: "Due to the digital nature of the product, we offer a 14-day dispute window if the code is broken." },
        { q: "Do you offer support?", a: "Yes, you get access to our private Discord for lifetime support from the community." },
    ];

    const logos = ["Stripe", "Next.js", "Vercel", "Supabase", "Tailwind", "Prisma", "React", "TypeScript"];

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-800 selection:bg-indigo-100">
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
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: config.primaryColor, boxShadow: `0 10px 15px -3px ${config.primaryColor}4d` }}>
                            <Code className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">
                            {displayName}
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
                        <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#docs" className="hover:text-indigo-600 transition-colors">Documentation</a>
                        <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
                        <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <a href="#" className="hidden md:block text-sm font-semibold text-slate-500 hover:text-indigo-600">Login</a>
                        <button
                            className="relative px-5 py-2.5 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingBag className="w-4 h-4" />
                            <span>Get Access</span>
                            {cart.length > 0 && (
                                <span className="ml-1 text-white px-1.5 rounded-full text-xs animate-bounce" style={{ backgroundColor: config.primaryColor }}>
                                    {cart.length}
                                </span>
                            )}
                        </button>
                        <button
                            className="md:hidden p-2 text-slate-600"
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
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden overflow-hidden"
                    >
                        <div className="flex flex-col gap-6 text-lg font-semibold text-slate-600">
                            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-slate-100">Features</a>
                            <a href="#docs" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-slate-100">Documentation</a>
                            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-slate-100">Pricing</a>
                            <button
                                className="w-full py-4 bg-indigo-600 text-white rounded-lg font-bold shadow-lg"
                                onClick={() => { setIsCartOpen(true); setIsMobileMenuOpen(false); }}
                            >
                                Get Started
                            </button>
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
            <header className="pt-32 pb-12 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="md:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-8 border"
                            style={{ backgroundColor: `${config.primaryColor}1a`, color: config.primaryColor, borderColor: `${config.primaryColor}33` }}
                        >
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: config.primaryColor }}></span>
                            v2.4.0 Now Released
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="text-5xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight tracking-tight"
                        >
                            {config.heroTitle.split(" ").length > 2 ? (
                                <>
                                    {config.heroTitle.split(" ").slice(0, 2).join(" ")} <br />
                                    <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${config.primaryColor}, #8b5cf6)` }}>
                                        {config.heroTitle.split(" ").slice(2).join(" ")}
                                    </span>
                                </>
                            ) : config.heroTitle}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                            className="text-lg text-slate-600 mb-10 leading-relaxed max-w-lg"
                        >
                            {config.heroDesc}
                        </motion.p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xl"
                                style={{ backgroundColor: config.primaryColor, boxShadow: `0 20px 25px -5px ${config.primaryColor}33` }}
                                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                <Terminal className="w-5 h-5" />
                                Get Source Code
                            </motion.button>
                            <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 hover:border-indigo-200">
                                Read Documentation
                            </button>
                        </div>
                    </div>

                    <div className="md:w-1/2 relative group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-[2rem] blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-1000"></div>
                        <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 transform group-hover:rotate-1 transition-all duration-500">
                            {/* Fake Code Window */}
                            <div className="bg-slate-950 px-4 py-3 flex items-center gap-2 border-b border-slate-800">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div className="ml-4 text-xs font-mono text-slate-500">config.ts — Typescript</div>
                            </div>
                            <div className="p-6 font-mono text-sm overflow-hidden min-h-[300px]">
                                <div className="text-slate-400 space-y-1">
                                    <div><span className="text-purple-400">export</span> <span className="text-blue-400">const</span> <span className="text-yellow-400">shipFast</span> = <span className="text-yellow-400">async</span> () ={">"} <span className="text-yellow-400">{"{"}</span></div>
                                    <div className="pl-4"><span className="text-slate-500">// Initialize SaaS</span></div>
                                    <div className="pl-4"><span className="text-blue-400">const</span> app = <span className="text-blue-400">await</span> SaaS.<span className="text-yellow-400">create</span>(<span className="text-green-400">"New Project"</span>);</div>
                                    <div className="pl-4 mb-2"></div>
                                    <div className="pl-4"><span className="text-slate-500">// Add features instantly</span></div>
                                    <div className="pl-4">app.<span className="text-yellow-400">addAuth</span>(<span className="text-green-400">"Google"</span>);</div>
                                    <div className="pl-4">app.<span className="text-yellow-400">addPayments</span>(<span className="text-green-400">"Stripe"</span>);</div>
                                    <div className="pl-4">app.<span className="text-yellow-400">deploy</span>();</div>
                                    <div className="pl-4 mb-2"></div>
                                    <div className="pl-4"><span className="text-purple-400">return</span> <span className="text-green-400">"Shipped to production! 🚀"</span>;</div>
                                    <div className="text-yellow-400">{"}"}</div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-slate-800 text-green-400 text-xs font-mono animate-pulse">
                                    {">"} Build successful (420ms)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Logo Marquee */}
            <div className="py-12 border-y border-slate-100 bg-white overflow-hidden">
                <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">Trusted by developers at</p>
                <div className="relative flex overflow-x-hidden group">
                    <div className="py-2 animate-marquee whitespace-nowrap flex gap-16 items-center">
                        {[...logos, ...logos, ...logos].map((logo, i) => (
                            <span key={i} className="text-2xl font-bold text-slate-300 font-mono mx-4 select-none group-hover:text-slate-800 transition-colors uppercase">{logo}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to launch.</h2>
                        <p className="text-slate-500">Stop reinventing the wheel. We've included the core features every SaaS needs.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { icon: Zap, color: 'indigo', title: 'Blazing Fast', text: 'Built on the edge with Next.js 14 and Server Components.' },
                            { icon: Layout, color: 'blue', title: 'Responsive UI', text: 'Beautifully designed components that look great on any device.' },
                            { icon: Globe, color: 'green', title: 'Global Payments', text: 'Integrated with Stripe and Paddle. Handle subscriptions easily.' },
                            { icon: Code, color: 'purple', title: 'Type Safe', text: 'End-to-end type safety with TypeScript and Prisma.' },
                            { icon: CheckCircle, color: 'teal', title: 'Auth Ready', text: 'Secure authentication via Supabase or NextAuth pre-configured.' },
                            { icon: Terminal, color: 'orange', title: 'Developer EX', text: 'Prettier, ESLint, and Husky setup for clean code commits.' },
                        ].map((feature, i) => (
                            <div key={i} className="group p-6 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all bg-slate-50 hover:bg-white">
                                <div className={`w-12 h-12 bg-${feature.color}-50 rounded-xl flex items-center justify-center text-${feature.color}-600 mb-4 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{feature.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <main id="pricing" className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
                    <p className="text-slate-500 mb-8">Choose the perfect plan for your project.</p>

                    {/* Toggle */}
                    <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg relative">
                        <div className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-md shadow-sm transition-all duration-300" style={{ transform: billingCycle === 'monthly' ? 'translateX(0)' : 'translateX(100%)' }}></div>
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            aria-pressed={billingCycle === 'monthly'}
                            className={`relative z-10 px-6 py-2 text-sm font-bold rounded-md transition-colors ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('lifetime')}
                            aria-pressed={billingCycle === 'lifetime'}
                            className={`relative z-10 px-6 py-2 text-sm font-bold rounded-md transition-colors ${billingCycle === 'lifetime' ? 'text-slate-900' : 'text-slate-500'}`}
                        >
                            Lifetime
                            <span className="absolute -top-3 -right-6 bg-green-500 text-white text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">Save 20%</span>
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => <div key={i} className="h-96 bg-white rounded-2xl shadow-sm border border-slate-100 animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                        {products.length > 0 ? (
                            products.map((plan, idx) => (
                                <motion.article
                                    key={plan.id}
                                    layout
                                    className={`relative bg-white rounded-2xl p-8 border ${idx === 1 ? 'border-indigo-600 shadow-2xl scale-105 z-10' : 'border-slate-200'} flex flex-col`}
                                >
                                    {idx === 1 && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-indigo-200">
                                            Most Popular
                                        </div>
                                    )}
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                                        <p className="text-sm text-slate-500 h-10">{plan.description || "The perfect starting point."}</p>
                                    </div>
                                    <div className="mb-8">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-bold text-slate-900">
                                                ₦{billingCycle === 'lifetime' ? plan.price.toLocaleString() : Math.round(plan.price * 0.1).toLocaleString()}
                                            </span>
                                            <span className="text-slate-400 font-medium text-sm">
                                                / {billingCycle === 'lifetime' ? 'once' : 'mo'}
                                            </span>
                                        </div>
                                    </div>
                                    <ul className="space-y-4 mb-8 flex-1">
                                        {[1, 2, 3, 4].map((i) => (
                                            <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                                <CheckCircle className={`w-5 h-5 ${idx === 1 ? 'text-indigo-500' : 'text-green-500'} shrink-0`} aria-hidden="true" />
                                                <span>Feature included in this plan</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => addToCart(plan)}
                                        className={`w-full py-4 rounded-xl font-bold transition-all ${idx === 1 ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200 hover:-translate-y-1' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                                    >
                                        Buy Now
                                    </button>
                                </motion.article>
                            ))
                        ) : (
                            // Empty State
                            [1, 2, 3].map((i) => (
                                <div key={i} className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                                    <Code className="w-8 h-8 text-slate-400 mx-auto mb-4" aria-hidden="true" />
                                    <p className="text-slate-500 font-bold">Plan Details Coming Soon</p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>

            {/* FAQ */}
            <section id="faq" className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    aria-expanded={openFaq === i}
                                    aria-controls={`faq-answer-${i}`}
                                    className="w-full flex justify-between items-center p-6 text-left hover:bg-slate-50 transition-colors"
                                >
                                    <span className="font-bold text-slate-800">{faq.q}</span>
                                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }}>
                                        <ChevronDown className="w-5 h-5 text-slate-400" aria-hidden="true" />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            id={`faq-answer-${i}`}
                                            initial={{ height: 0 }}
                                            animate={{ height: "auto" }}
                                            exit={{ height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-16 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-sm">
                    <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white">
                                <Code className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xl text-white">{displayName}</span>
                        </div>
                        <p className="max-w-sm mb-6">
                            Helping developers ship faster since 2024. Built with love and caffeine by the {displayName} team.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-6">Product</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Changelog</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-6">Legal</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">License</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-slate-800 text-center text-xs">
                    <p>&copy; 2024 {displayName} Inc. All rights reserved.</p>
                </div>
            </footer>
        </div >
    );
}
