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
    Calendar,
    MapPin,
    Users,
    Mic,
    Clock,
    ArrowRight,
    Ticket,
    ChevronDown,
    ChevronUp,
    Linkedin,
    Twitter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { StorefrontSEO } from "./StorefrontSEO";
import { useCartQuery, useQueryState, useStorefrontQuery } from "@/hooks/storefront/useStorefrontQuery";

export function ConferencePro({
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
        primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#2563eb", // Blue 600
        heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "The Future of Tech & Design.",
        heroSubtitle: configOverride?.heroSubtitle || store?.templateConfig?.heroSubtitle || "Oct 24-26, 2024",
        heroDesc: configOverride?.heroDesc || store?.templateConfig?.heroDesc || "Join 2,000+ innovators for 3 days of inspiring talks, workshops, and networking in Lagos.",
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
    const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
    const [activeDay, setActiveDay] = useState(1);

    useCartQuery(isCartOpen, setIsCartOpen);
    useQueryState("day", activeDay, setActiveDay, 1);

    const { searchParams, updateQuery } = useStorefrontQuery();
    const speakerId = searchParams.get("speaker");

    // Sync Speaker URL -> State
    useEffect(() => {
        if (speakerId && (!selectedSpeaker || String(selectedSpeaker.id) !== speakerId)) {
            const speaker = speakers.find(s => String(s.id) === speakerId);
            if (speaker) setSelectedSpeaker(speaker);
        } else if (!speakerId && selectedSpeaker) {
            setSelectedSpeaker(null);
        }
    }, [speakerId, selectedSpeaker]); // Remove 'speakers' from deps to avoid loop if it were recreated, but here it's constant-ish (defined below)

    // Sync Speaker State -> URL
    useEffect(() => {
        if (selectedSpeaker && String(selectedSpeaker.id) !== speakerId) {
            updateQuery("speaker", String(selectedSpeaker.id));
        } else if (!selectedSpeaker && speakerId) {
            updateQuery("speaker", null);
        }
    }, [selectedSpeaker, speakerId, updateQuery]);

    const displayName = store?.name || initialStoreName;

    // Countdown Logic
    const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 2, minutes: 14, seconds: 50 });
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    interface Speaker {
        id: number;
        name: string;
        role: string;
        company: string;
        img: string;
        bio: string;
    }

    const speakers: Speaker[] = [
        { id: 1, name: "Dr. Sarah O.", role: "AI Research Lead", company: "FutureTech", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400", bio: "Leading research on large language models and their impact on emerging markets." },
        { id: 2, name: "Michael C.", role: "Product Design", company: "Creativ", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400", bio: "Award-winning designer focusing on accessible and inclusive user interfaces." },
        { id: 3, name: "Amara K.", role: "Founder & CEO", company: "InnovateAfrica", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400", bio: "Building the next generation of logistics infrastructure for the continent." },
        { id: 4, name: "David L.", role: "CTO", company: "CloudScale", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400", bio: "Expert in scalable cloud architectures and serverless computing." },
    ];

    const agenda = {
        1: [
            { time: "09:00 AM", title: "Opening Keynote: The AI Revolution", speaker: "Dr. Sarah O.", type: "Keynote" },
            { time: "11:00 AM", title: "Design Systems at Scale", speaker: "Michael C.", type: "Workshop" },
            { time: "02:00 PM", title: "Fireside Chat: Future of Logistics", speaker: "Amara K.", type: "Panel" },
        ],
        2: [
            { time: "10:00 AM", title: "Cloud Native Architectures", speaker: "David L.", type: "Keynote" },
            { time: "01:00 PM", title: "Building for the Next Billion Users", speaker: "Panel Discussion", type: "Panel" },
        ],
        3: [
            { time: "09:00 AM", title: "Investment Trends in 2025", speaker: "Angel Network", type: "Panel" },
            { time: "04:00 PM", title: "Closing Ceremony & Networking", speaker: "All Speakers", type: "Social" },
        ]
    };

    return (
        <div className="bg-white min-h-screen font-sans text-slate-900 selection:bg-blue-100">
            <StorefrontSEO store={store} products={products} />
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                total={total}
                storeSlug={storeSlug || ""}
                onSuccess={clearCart}
            />

            {/* Speaker Modal */}
            <AnimatePresence>
                {selectedSpeaker && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setSelectedSpeaker(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-8 max-w-lg w-full relative z-10 shadow-2xl"
                        >
                            <button onClick={() => setSelectedSpeaker(null)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                            <div className="flex gap-6 mb-6">
                                <div className="relative w-24 h-24 flex-shrink-0">
                                    <Image
                                        src={selectedSpeaker.img}
                                        alt={selectedSpeaker.name}
                                        fill
                                        className="rounded-full object-cover shadow-lg border-2 border-white ring-2 ring-blue-100"
                                        sizes="96px"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">{selectedSpeaker.name}</h3>
                                    <p className="text-blue-600 font-medium mb-1">{selectedSpeaker.role}</p>
                                    <p className="text-slate-500 text-sm">@{selectedSpeaker.company}</p>
                                    <div className="flex gap-3 mt-3">
                                        <Linkedin className="w-4 h-4 text-slate-400 hover:text-blue-700 cursor-pointer" />
                                        <Twitter className="w-4 h-4 text-slate-400 hover:text-blue-400 cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-3">About</h4>
                            <p className="text-slate-600 leading-relaxed mb-8">{selectedSpeaker.bio}</p>
                            <button className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-lg transition-colors">
                                View Sessions
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 transition-all">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg" style={{ backgroundColor: config.primaryColor, boxShadow: `0 10px 15px -3px ${config.primaryColor}33` }}>
                            {displayName.charAt(0)}
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">
                            {displayName}
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <a href="#speakers" className="hover:text-blue-600 transition-colors">Speakers</a>
                        <a href="#schedule" className="hover:text-blue-600 transition-colors">Schedule</a>
                        <a href="#tickets" className="hover:text-blue-600 transition-colors">Tickets</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            className="relative px-6 py-2.5 text-white font-bold rounded-full transition-colors flex items-center gap-2 shadow-lg hover:scale-105"
                            style={{ backgroundColor: config.primaryColor, boxShadow: `0 10px 15px -3px ${config.primaryColor}33` }}
                            onClick={() => setIsCartOpen(true)}
                        >
                            <Ticket className="w-4 h-4" />
                            <span>Get Tickets</span>
                            {cart.length > 0 && (
                                <span className="ml-1 bg-white px-1.5 py-0.5 rounded-full text-xs box-content min-w-[12px] text-center" style={{ color: config.primaryColor }}>
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
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
                    >
                        <div className="flex flex-col gap-6 text-lg font-medium text-slate-700">
                            <a href="#speakers" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-slate-100">Speakers</a>
                            <a href="#schedule" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-slate-100">Schedule</a>
                            <a href="#tickets" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-slate-100">Tickets</a>
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
            <header className="pt-32 pb-24 px-6 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="md:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6"
                            style={{ backgroundColor: `${config.primaryColor}1a`, color: config.primaryColor }}
                        >
                            <Calendar className="w-4 h-4" />
                            {config.heroSubtitle}
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl lg:text-7xl font-bold text-slate-900 mb-8 leading-tight tracking-tight"
                        >
                            {config.heroTitle.split(" ").length > 2 ? (
                                <>
                                    {config.heroTitle.split(" ").slice(0, 3).join(" ")} <br />
                                    <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${config.primaryColor}, #6366f1)` }}>
                                        {config.heroTitle.split(" ").slice(3).join(" ")}
                                    </span>
                                </>
                            ) : config.heroTitle}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed"
                        >
                            {config.heroDesc}
                        </motion.p>

                        {/* Countdown */}
                        <div className="flex gap-4 mb-10">
                            {Object.entries(timeLeft).map(([unit, value]) => (
                                <div key={unit} className="text-center">
                                    <div className="w-16 h-16 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-2xl font-bold text-slate-900 mb-1">
                                        {value.toString().padStart(2, '0')}
                                    </div>
                                    <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{unit}</div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                className="px-8 py-4 text-white font-bold rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 hover:-translate-y-1"
                                style={{ backgroundColor: config.primaryColor, boxShadow: `0 20px 25px -5px ${config.primaryColor}33` }}
                                onClick={() => document.getElementById('tickets')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Book Your Seat <ArrowRight className="w-4 h-4" />
                            </button>
                            <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                                View Agenda
                            </button>
                        </div>
                    </div>

                    <div className="md:w-1/2 grid grid-cols-2 gap-4">
                        <div className="space-y-4 md:translate-y-12">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                className="aspect-[3/4] relative rounded-2xl overflow-hidden shadow-2xl bg-slate-200 w-full"
                            >
                                <Image
                                    src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=800&auto=format&fit=crop"
                                    alt="Conference Event 1"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                                className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl bg-slate-200 w-full"
                            >
                                <Image
                                    src="https://images.unsplash.com/photo-1591115765373-5207764f72e4?q=80&w=800&auto=format&fit=crop"
                                    alt="Conference Event 2"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                />
                            </motion.div>
                        </div>
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                                className="aspect-square relative rounded-2xl overflow-hidden shadow-2xl bg-slate-200 w-full"
                            >
                                <Image
                                    src="https://images.unsplash.com/photo-1560523160-754a9e25c68f?q=80&w=800&auto=format&fit=crop"
                                    alt="Conference Event 3"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                                className="aspect-[3/4] relative rounded-2xl overflow-hidden shadow-2xl bg-slate-200 w-full"
                            >
                                <Image
                                    src="https://images.unsplash.com/photo-1475721027760-f66d7cb2e322?q=80&w=800&auto=format&fit=crop"
                                    alt="Conference Event 4"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Speakers Carousel (Clickable) */}
            <section id="speakers" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">World Class Speakers</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Learn from the industry leaders redefining what is possible.</p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-8">
                        {speakers.map((speaker, idx) => (
                            <div
                                key={speaker.id}
                                className="group cursor-pointer"
                                onClick={() => setSelectedSpeaker(speaker)}
                            >
                                <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-6 relative bg-slate-100">
                                    <Image
                                        src={speaker.img}
                                        alt={speaker.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105 saturate-0 group-hover:saturate-100"
                                        sizes="(max-width: 768px) 100vw, 25vw"
                                    />
                                    <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                        <span className="text-white text-xs font-bold uppercase tracking-widest bg-black/20 backdrop-blur-md px-3 py-1 rounded-full">View Bio</span>
                                    </div>
                                </div>
                                <h3 className="font-bold text-xl mb-1 group-hover:text-blue-600 transition-colors">{speaker.name}</h3>
                                <p className="text-sm text-slate-500">{speaker.role} @ {speaker.company}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Agenda Section */}
            <section id="schedule" className="py-24 bg-slate-50 border-y border-slate-200">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-8">Event Schedule</h2>
                        <div className="flex justify-center gap-4">
                            {[1, 2, 3].map(day => (
                                <button
                                    key={day}
                                    onClick={() => setActiveDay(day)}
                                    className={`px-8 py-3 rounded-full font-bold text-sm transition-all ${activeDay === day ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
                                >
                                    Day 0{day}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeDay}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {agenda[activeDay as keyof typeof agenda].map((item, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors flex flex-col md:flex-row items-start md:items-center gap-6 mb-4">
                                        <div className="min-w-[100px] font-mono text-blue-600 font-bold">{item.time}</div>
                                        <div className="flex-1">
                                            <div className="text-xs font-bold uppercase text-slate-400 mb-1 tracking-wider">{item.type}</div>
                                            <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                                            <p className="text-sm text-slate-500">with {item.speaker}</p>
                                        </div>
                                        <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-blue-600 transition-colors">
                                            <ChevronDown className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* Ticket Pricing */}
            <main id="tickets" className="py-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-4xl font-bold text-slate-900 mb-6">Choose Your Experience</h2>
                    <p className="text-lg text-slate-500">
                        Whether you're here for the talks or the full networking experience, we have a pass for you.
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-96 bg-slate-100 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        {products.length > 0 ? (
                            products.map((ticket, idx) => (
                                <article
                                    key={ticket.id}
                                    className={`bg-white rounded-2xl p-8 border ${idx === 1 ? 'border-2 border-blue-600 shadow-2xl relative scale-105 z-10' : 'border-slate-200 shadow-xl hover:shadow-2xl transition-all'}`}
                                >
                                    {idx === 1 && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-blue-200">
                                            Most Popular
                                        </div>
                                    )}
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{ticket.name}</h3>
                                    <p className="text-sm text-slate-500 mb-6 h-10 line-clamp-2">{ticket.description || "Access to all keynotes and expo hall."}</p>
                                    <div className="text-4xl font-bold text-slate-900 mb-8">
                                        ₦{ticket.price.toLocaleString()}
                                    </div>
                                    <ul className="space-y-4 mb-8">
                                        {[1, 2, 3, 4].map(i => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                                <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                                                    <Users className="w-3 h-3" />
                                                </div>
                                                Feature included with ticket
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => addToCart(ticket)}
                                        className={`w-full py-4 rounded-xl font-bold transition-all ${idx === 1 ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                                    >
                                        Select Pass
                                    </button>
                                </article>
                            ))
                        ) : (
                            [1, 2, 3].map((i) => (
                                <div key={i} className="p-10 border-2 border-dashed border-slate-200 rounded-2xl text-center">
                                    <Ticket className="w-8 h-8 text-slate-300 mx-auto mb-4" />
                                    <p className="font-bold text-slate-400">Tickets Coming Soon</p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-16 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center text-white font-bold">C</div>
                        <span className="text-white font-bold text-lg">{displayName}</span>
                    </div>

                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Code of Conduct</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Get Support</a>
                    </div>
                    <p>&copy; 2024 {displayName}.</p>
                </div>
            </footer>
        </div>
    );
}
