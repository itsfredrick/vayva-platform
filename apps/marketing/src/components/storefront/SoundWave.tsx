import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import { StorefrontSEO } from "./StorefrontSEO";
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    Music,
    BarChart2,
    Headphones,
    Download,
    FileAudio,
    Check,
    Heart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { useCartQuery, useProductModalQuery } from "@/hooks/storefront/useStorefrontQuery";

export function SoundWave({
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
        primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#9333ea", // purple-600
        heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "Sonic Landscapes For Your Vision.",
        heroSubtitle: configOverride?.heroSubtitle || store?.templateConfig?.heroSubtitle || "Sonic Landscapes",
        heroDesc: configOverride?.heroDesc || store?.templateConfig?.heroDesc || "High-fidelity beats, cinematic soundscapes, and royalty-free samples designed for producers and creators.",
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

    useCartQuery(isCartOpen, setIsCartOpen);

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [likedTracks, setLikedTracks] = useState<string[]>([]);

    // Player State
    const [currentTrack, setCurrentTrack] = useState<ProductData | null>(null);
    useProductModalQuery(currentTrack, setCurrentTrack, products);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    const displayName = store?.name || initialStoreName;

    const togglePlay = (track: ProductData) => {
        if (currentTrack?.id === track.id) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentTrack(track);
            setIsPlaying(true);
            setProgress(0);
        }
    };

    const toggleLike = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (likedTracks.includes(id)) {
            setLikedTracks(likedTracks.filter(t => t !== id));
        } else {
            setLikedTracks([...likedTracks, id]);
            toast.success("Added to Liked Tracks");
        }
    };


    // Simulate progress
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress(p => {
                    if (p >= 100) { setIsPlaying(false); return 0; }
                    return p + 0.5; // Simulate playing
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <div className="bg-[#0f0f13] min-h-screen font-sans text-white selection:bg-purple-500 selection:text-white pb-24">
            <StorefrontSEO store={store} products={products} activeProduct={currentTrack} />
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                total={total}
                storeSlug={storeSlug || ""}
                onSuccess={clearCart}
            />

            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-[#0f0f13]/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`} style={{ background: `linear-gradient(to bottom right, ${config.primaryColor}, #3b82f6)` }}>
                            <Headphones className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">
                            {displayName}
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
                        <a href="#" className="hover:text-white transition-colors">Beats</a>
                        <a href="#" className="hover:text-white transition-colors">Sound Kits</a>
                        <a href="#" className="hover:text-white transition-colors">Loops</a>
                        <a href="#" className="hover:text-white transition-colors">Licensing</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            className="relative p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingBag className="w-6 h-6" />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-[#0f0f13] animate-pulse" style={{ backgroundColor: config.primaryColor }}>
                                    {cart.length}
                                </span>
                            )}
                        </button>
                        <button
                            className="md:hidden p-2 text-gray-400"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Sticky Player */}
            <AnimatePresence>
                {currentTrack && (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="fixed bottom-0 left-0 w-full bg-[#18181b]/95 backdrop-blur-xl border-t border-white/10 z-[60] px-6 py-4"
                    >
                        <div className="max-w-7xl mx-auto flex items-center gap-6">
                            <div className="hidden md:block w-14 h-14 bg-gray-800 rounded-lg overflow-hidden shrink-0 relative">
                                <Image
                                    src={currentTrack.image || ""}
                                    alt={currentTrack.name}
                                    fill
                                    className={`object-cover ${isPlaying ? 'scale-110' : 'scale-100'} transition-transform duration-1000`}
                                    sizes="56px"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-white truncate">{currentTrack.name}</h4>
                                <p className="text-xs text-gray-400">Streaming Preview</p>
                            </div>
                            <div className="flex flex-col items-center gap-1 w-full max-w-md">
                                <div className="flex items-center gap-6">
                                    <SkipBack className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                                    <button
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                                    >
                                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
                                    </button>
                                    <SkipForward className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                                </div>
                                <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden cursor-pointer group">
                                    <div className="h-full relative transition-all duration-100" style={{ width: `${progress}%`, backgroundColor: config.primaryColor }}>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-lg"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:flex items-center gap-4">
                                <Volume2 className="w-5 h-5 text-gray-400" />
                                <div className="w-24 h-1 bg-white/10 rounded-full">
                                    <div className="w-2/3 h-full bg-gray-400 rounded-full"></div>
                                </div>
                                <button
                                    onClick={() => addToCart(currentTrack)}
                                    className="px-6 py-2 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors"
                                    style={{ backgroundColor: config.primaryColor }}
                                >
                                    Buy {currentTrack.price.toLocaleString()}
                                </button>
                            </div>
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

            {/* Main Content */}
            <header className="pt-32 pb-20 px-6 overflow-hidden relative">
                <div className="absolute top-0 center w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] animate-pulse-slow" style={{ backgroundColor: `${config.primaryColor}4d` }}></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">New Drop Available</span>
                    </div>
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white mb-6 leading-tight tracking-tight"
                    >
                        {config.heroTitle.split(" ").slice(0, 2).join(" ")} <br />
                        <span className="text-white/50">{config.heroTitle.split(" ").slice(2).join(" ")}</span>
                    </motion.h1>
                    <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        {config.heroDesc}
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2"
                            onClick={() => {
                                document.getElementById('tracks')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            <Play className="w-4 h-4 fill-current" /> Listen Now
                        </button>
                        <button className="px-8 py-4 bg-white/5 text-white font-bold rounded-full hover:bg-white/10 transition-colors border border-white/10">
                            Browse Packs
                        </button>
                    </div>
                </div>
            </header>

            {/* Featured Track / Player Mock */}
            <div className="max-w-5xl mx-auto px-6 mb-24">
                <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-white/10 rounded-3xl p-8 backdrop-blur-md flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
                    {/* Dynamic Background */}
                    <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none"></div>
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-purple-500/30 blur-[80px] rounded-full pointer-events-none group-hover:bg-purple-500/50 transition-colors duration-1000"></div>

                    <div className="w-32 h-32 bg-black rounded-2xl shrink-0 overflow-hidden shadow-2xl relative">
                        <Image
                            src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400"
                            alt="Featured Track"
                            fill
                            className="object-cover"
                            sizes="128px"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                                <Play className="w-6 h-6 fill-white text-white pl-1" />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full text-center md:text-left z-10">
                        <div className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-2 justify-center md:justify-start">
                            <FileAudio className="w-4 h-4" /> Featured Track
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Midnight Tokyo</h2>
                        <div className="text-sm text-gray-400 mb-6">Synthwave Collection Vol. 2</div>

                        {/* Audio Viz */}
                        <div className="flex items-end gap-1 h-12 justify-center md:justify-start">
                            {[...Array(40)].map((_, i) => (
                                <div
                                    key={i}
                                    className="w-1.5 rounded-full animate-music-bar"
                                    style={{
                                        background: `linear-gradient(to top, ${config.primaryColor}, #60a5fa)`,
                                        // Use deterministic values to prevent hydration mismatch
                                        height: `${30 + (i * 7 % 60)}%`,
                                        animationDelay: `${i * 0.05}s`,
                                        animationDuration: `${0.8 + (i % 5) * 0.1}s`
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                    <div className="z-10 flex flex-col items-center gap-3">
                        <div className="text-3xl font-bold tabular-nums">₦25,000</div>
                        <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" /> Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            {/* Track List */}
            <main id="tracks" className="py-12 px-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <Music className="w-6 h-6 text-purple-500" />
                        Latest Releases
                    </h2>
                    <div className="flex gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                        <span>Sort by:</span>
                        <select className="bg-transparent text-white outline-none cursor-pointer hover:text-purple-400">
                            <option>Newest</option>
                            <option>Popular</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {products.length > 0 ? (
                            products.map((track) => (
                                <article key={track.id}>
                                    <Link
                                        href={`${basePath || ""}/products/${track.id}`}
                                        className={`group bg-[#131316] hover:bg-[#1c1c21] border border-white/5 hover:border-purple-500/50 rounded-xl p-4 flex items-center gap-6 transition-all duration-300 block cursor-pointer ${currentTrack?.id === track.id ? 'border-purple-500 bg-[#1c1c21]' : ''}`}
                                    >
                                        <div
                                            className="w-16 h-16 bg-gray-800 rounded-lg shrink-0 overflow-hidden relative cursor-pointer"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                togglePlay(track);
                                            }}
                                        >
                                            <Image
                                                src={track.image || `https://source.unsplash.com/random/100x100/?abstract,neon&sig=${track.id}`}
                                                alt={track.name}
                                                fill
                                                className={`object-cover transition-transform duration-700 ${currentTrack?.id === track.id && isPlaying ? 'scale-110 blur-[2px]' : ''}`}
                                                sizes="64px"
                                            />
                                            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${currentTrack?.id === track.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                {currentTrack?.id === track.id && isPlaying ? <div className="flex gap-1"><span className="w-1 h-3 bg-white animate-bounce"></span><span className="w-1 h-3 bg-white animate-bounce delay-75"></span><span className="w-1 h-3 bg-white animate-bounce delay-150"></span></div> : <Play className="w-6 h-6 fill-white text-white pl-1" />}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0 grid md:grid-cols-4 gap-6 items-center">
                                            <div className="md:col-span-2">
                                                <h3 className={`font-bold truncate text-lg ${currentTrack?.id === track.id ? 'text-purple-400' : 'text-white group-hover:text-purple-400'} transition-colors`}>{track.name}</h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] uppercase font-bold text-gray-400">WAV</span>
                                                    <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] uppercase font-bold text-gray-400">MP3</span>
                                                    <span className="text-xs text-gray-500">128 BPM</span>
                                                </div>
                                            </div>

                                            <div className="hidden md:flex items-center gap-1 h-8 opacity-30 group-hover:opacity-60 transition-opacity">
                                                {[...Array(15)].map((_, i) => (
                                                    <div key={i} className={`w-1 bg-white rounded-full ${currentTrack?.id === track.id && isPlaying ? 'animate-music-bar' : ''}`} style={{ height: `${30 + (i * 13 % 60)}%`, animationDelay: `${i * 0.05}s` }}></div>
                                                ))}
                                            </div>

                                            <div className="text-right">
                                                <div className="font-bold text-xl text-white">₦{track.price.toLocaleString()}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => toggleLike(track.id, e)}
                                                className={`p-3 rounded-xl transition-colors shrink-0 hover:bg-white/10 ${likedTracks.includes(track.id) ? 'text-purple-500 fill-current' : 'text-gray-500 hover:text-white'}`}
                                            >
                                                <Heart className={`w-5 h-5 ${likedTracks.includes(track.id) ? 'fill-current' : ''}`} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    addToCart(track);
                                                }}
                                                className="bg-white/10 hover:bg-purple-600 text-white p-3 rounded-xl transition-colors shrink-0 hover:shadow-lg hover:shadow-purple-500/20"
                                            >
                                                <ShoppingBag className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </Link>
                                </article>
                            ))
                        ) : (
                            // Empty Demo
                            [1, 2, 3, 4].map((i) => (
                                <div key={i} className="text-center p-8 bg-white/5 rounded-xl border border-dashed border-white/10">
                                    <Music className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                                    <p className="text-gray-500">Track Uploading...</p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>

            {/* Licensing Info */}
            <section className="py-24 px-6 bg-[#0a0a0d] border-t border-white/5">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-center md:text-left">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors group">
                        <div className="w-12 h-12 bg-purple-900/40 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                            <Check className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold mb-4 text-white">Royalty Free</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Every purchase grants you a worldwide, royalty-free license. Use in your videos, podcasts, and commercial projects without worry.
                        </p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors group">
                        <div className="w-12 h-12 bg-blue-900/40 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                            <Download className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold mb-4 text-white">Instant Download</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Get immediate access to high-quality WAV and MP3 files directly to your inbox and dashboard after purchase.
                        </p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors group">
                        <div className="w-12 h-12 bg-green-900/40 rounded-xl flex items-center justify-center text-green-400 mb-6 group-hover:scale-110 transition-transform">
                            <BarChart2 className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold mb-4 text-white">Stem Access</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Need more control? Purchase the track stems to mix and match individual instruments for your project.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 px-6 text-center text-gray-600 text-sm bg-[#08080a]">
                <p>&copy; 2024 {displayName}. Audio Innovation.</p>
                <div className="flex justify-center gap-6 mt-6">
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">License Agreement</a>
                    <a href="#" className="hover:text-white transition-colors">Support</a>
                </div>
            </footer>
        </div>
    );
}
