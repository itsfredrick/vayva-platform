import React, { useState } from "react";
import {
    useStorefrontProducts,
    useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { StorefrontCart } from "./StorefrontCart";
import { ShoppingCart, Star, Clock, Flame, ChevronRight, Minus, MapPin } from "lucide-react";
import { StorefrontSEO } from "./StorefrontSEO";
import Image from "next/image";
import { useCartQuery, useCategoryQuery } from "@/hooks/storefront/useStorefrontQuery";

export function SliceLifePizza({
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
        primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#FF4500", // Orange Red
        heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "Slice of Heaven.",
        showBanner: configOverride?.showBanner ?? store?.templateConfig?.showBanner ?? true,
        bannerText: configOverride?.bannerText || store?.templateConfig?.bannerText || "⚡️ Free Delivery on orders over ₦15,000 • Use Code: SLICE20 ⚡️",
    };
    const { products, isLoading } = useStorefrontProducts(storeSlug, {
        limit: 20,
    });

    const {
        cart,
        addToCart,
        isOpen: isCartOpen,
        setIsOpen: setIsCartOpen,
        clearCart,
    } = useStorefrontCart(storeSlug || "");

    useCartQuery(isCartOpen, setIsCartOpen);

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const [activeCategory, setActiveCategory] = useState("All");
    useCategoryQuery(activeCategory, setActiveCategory, "All");

    const displayName = store?.name || initialStoreName;
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="min-h-screen bg-[#FFFDF8] text-[#3D3126] font-sans selection:bg-[#FF4500] selection:text-white">
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
                storeSlug={storeSlug || ""}
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onCheckout={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                }}
            />

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-[#FFFDF8]/90 backdrop-blur-md border-b border-[#3D3126]/5 transition-all duration-300">
                {config.showBanner && (
                    <div className="text-white py-2 text-center text-xs font-bold uppercase tracking-widest px-4" style={{ backgroundColor: config.primaryColor }}>
                        {config.bannerText}
                    </div>
                )}

                {/* Navbar */}
                <header className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="text-white p-2 rounded-lg -rotate-3" style={{ backgroundColor: config.primaryColor }}>
                            <Flame className="w-6 h-6 fill-current" />
                        </div>
                        <span className="text-2xl font-black italic tracking-tighter uppercase">{displayName}</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-6 text-sm font-bold uppercase tracking-wider text-gray-500">
                            <a href="#deals" className="hover:text-[#FF4500] transition-colors">Deals</a>
                            <a href="#menu" className="hover:text-[#FF4500] transition-colors">Menu</a>
                            <a href="#reviews" className="hover:text-[#FF4500] transition-colors">Reviews</a>
                        </div>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full font-bold hover:bg-[#FF4500] transition-colors"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span>{cart.length}</span>
                        </button>
                    </div>
                </header>
            </nav>

            {/* Hero Section */}
            <header className="pt-32 pb-16 px-6 text-center max-w-4xl mx-auto">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="md:order-1 order-2">
                        <div className="inline-block bg-[#FFE5E5] text-[#FF4500] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-6">
                            Hot & Fresh • 30 Min Delivery
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase italic leading-[0.9] tracking-tighter mb-6">
                            {config.heroTitle.split(" ").slice(0, -1).join(" ")} <br />
                            <span style={{ color: config.primaryColor }}>{config.heroTitle.split(" ").slice(-1)}</span>
                        </h1>
                        <p className="text-xl text-gray-500 mb-8 max-w-md font-medium">
                            Hand-tossed dough, secret family sauce, and the freshest toppings.
                            It's not just pizza, it's a lifestyle.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-[#FF4500] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-red-600 hover:shadow-xl transition-all"
                            >
                                Order Delivery
                            </button>
                            <button className="bg-white text-gray-900 border-2 border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:border-gray-900 transition-all">
                                View Deals
                            </button>
                        </div>
                    </div>
                    <div className="md:order-2 order-1 relative">
                        <div className="absolute inset-0 bg-[#FF4500]/5 rounded-full blur-3xl transform scale-90"></div>
                        <Image
                            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1000"
                            className="relative drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                            alt="Pizza Hero"
                            width={600}
                            height={600}
                            priority
                        />
                        <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce-slow">
                            <div className="bg-green-100 p-2 rounded-full text-green-600">
                                <Clock className="w-6 h-6 " />
                            </div>
                            <div>
                                <div className="font-bold text-sm">Fast Delivery</div>
                                <div className="text-xs text-gray-500">Avg. 25 mins</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Menu Sections */}
            <main className="max-w-7xl mx-auto px-6 pb-32 space-y-24">
                {/* Featured Deals */}
                <section id="deals" className="py-20 px-4 max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-10">
                        <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">
                            Super Deals <span className="text-[#FF4500]">🔥</span>
                        </h2>
                        <a href="#" className="hidden md:flex items-center gap-1 font-bold text-[#FF4500] hover:underline">
                            View All <ChevronRight className="w-4 h-4" />
                        </a>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-gray-900 text-white rounded-3xl p-8 md:p-10 relative overflow-hidden group">
                            <div className="relative z-10 max-w-xs">
                                <span className="bg-[#FF4500] px-3 py-1 rounded-md text-xs font-bold uppercase mb-4 inline-block">Family Combo</span>
                                <h3 className="text-3xl font-black italic mb-4">2 Large Pizzas + 2 Drinks</h3>
                                <p className="opacity-80 mb-6">Perfect for movie nights. Choose any toppings.</p>
                                <button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100">
                                    Order Now - ₦12,500
                                </button>
                            </div>
                            <Image
                                src="https://images.unsplash.com/photo-1593560708920-63878b36cd72?auto=format&fit=crop&q=80&w=600"
                                className="absolute right-[-20px] bottom-[-20px] rounded-full border-4 border-white/10 group-hover:scale-110 transition-transform duration-500 object-cover"
                                width={256}
                                height={256}
                                alt="Deal"
                            />
                        </div>
                        <div className="bg-[#FFF0E5] text-gray-900 rounded-3xl p-8 md:p-10 relative overflow-hidden group">
                            <div className="relative z-10 max-w-xs">
                                <span className="bg-[#FF4500] text-white px-3 py-1 rounded-md text-xs font-bold uppercase mb-4 inline-block">Lunch Special</span>
                                <h3 className="text-3xl font-black italic mb-4">Any Medium Pizza</h3>
                                <p className="opacity-80 mb-6">Available Mon-Fri, 11am - 4pm.</p>
                                <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800">
                                    Order Now - ₦4,500
                                </button>
                            </div>
                            <Image
                                src="https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=600"
                                className="absolute right-[-20px] bottom-[-20px] rounded-full border-4 border-white/10 group-hover:scale-110 transition-transform duration-500 object-cover"
                                width={256}
                                height={256}
                                alt="Deal"
                            />
                        </div>
                    </div>
                </section>

                {/* Menu Categories */}
                <nav id="menu" className="py-10 px-4 max-w-7xl mx-auto">
                    <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
                        {['All', 'Classics', 'Meat Lovers', 'Veggie', 'Sides', 'Drinks'].map((cat, i) => (
                            <button
                                key={cat}
                                className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-colors ${cat === activeCategory ? 'bg-[#FF4500] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Product Grid */}
                <section className="pb-20 px-4 max-w-7xl mx-auto">
                    {isLoading ? (
                        <div className="text-center py-20 text-gray-400 font-bold animate-pulse">Loading amazing pizzas...</div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-2xl">
                            <p className="text-gray-500 font-medium">Menu updating...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <div key={product.id} className="group border border-gray-100 rounded-3xl p-4 hover:border-gray-200 hover:shadow-xl transition-all duration-300 bg-white">
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 relative bg-gray-100">
                                        <Image
                                            src={product.image || `https://via.placeholder.com/400?text=${encodeURIComponent(product.name)}`}
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            alt={product.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
                                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                            4.9
                                        </div>
                                    </div>
                                    <div className="px-2 pb-2">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-xl leading-tight">{product.name}</h3>
                                            <div className="font-black text-[#FF4500]">₦{product.price.toLocaleString()}</div>
                                        </div>
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">{product.description}</p>
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="w-full bg-gray-100 text-gray-900 py-3 rounded-xl font-bold hover:bg-[#FF4500] hover:text-white transition-colors flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-[#1a1510] text-[#FFFDF8] py-24 px-6 border-t border-[#3D3126]">
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12 mb-16 border-b border-gray-800 pb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-[#FF4500] text-white p-2 rounded-lg -rotate-3">
                                <Flame className="w-5 h-5 fill-current" />
                            </div>
                            <span className="text-2xl font-black italic tracking-tighter uppercase">{displayName}</span>
                        </div>
                        <p className="text-gray-400 max-w-sm">
                            Making the world a better place, one slice at a time.
                            Obsessed with quality since 2024.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold uppercase tracking-widest mb-6">Locations</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Victoria Island</li>
                            <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Lekki Phase 1</li>
                            <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Ikoyi</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold uppercase tracking-widest mb-6">Support</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-white">Track Order</a></li>
                            <li><a href="#" className="hover:text-white">Allergy Info</a></li>
                            <li><a href="#" className="hover:text-white">Contact Us</a></li>
                        </ul>
                    </div>
                </div>
                <div className="text-center text-gray-600 text-sm">
                    &copy; 2024 {displayName}. Powered by {displayName}.
                </div>
            </footer>
        </div>
    );
}
