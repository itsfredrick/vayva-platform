import React, { useState } from "react";
import Image from "next/image";
import {
    useStorefrontProducts,
    useStorefrontStore,
    type ProductData,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { StorefrontCart } from "./StorefrontCart";
import { QuickViewModal } from "./QuickViewModal";
import {
    ShoppingBag,
    Menu,
    X,
    Home,
    Map,
    Key,
    Info,
    ArrowRight,
    Bed,
    Bath,
    Maximize,
    Search,
    Calculator,
    Calendar,
    MapPin,
    Video,
    Heart,
    Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import { StorefrontSEO } from "./StorefrontSEO";
import { useCartQuery, useProductModalQuery, useSearchQuery } from "@/hooks/storefront/useStorefrontQuery";

export function EstatePrime({
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
    const { products, isLoading } = useStorefrontProducts(storeSlug, {
        limit: 9,
    });

    // Config Merging logic
    const config = {
        primaryColor: configOverride?.primaryColor || store?.templateConfig?.primaryColor || "#0f172a",
        heroTitle: configOverride?.heroTitle || store?.templateConfig?.heroTitle || "Find Your Sanctuary.",
        heroDesc: configOverride?.heroDesc || store?.templateConfig?.heroDesc || "Explore our hand-picked selection of premium properties available for immediate viewing.",
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
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useCartQuery(isCartOpen, setIsCartOpen);
    useSearchQuery(searchQuery, setSearchQuery);

    // Quick View & Wishlist
    const [selectedProperty, setSelectedProperty] = useState<ProductData | null>(null);
    useProductModalQuery(selectedProperty, setSelectedProperty, products);
    const [savedProperties, setSavedProperties] = useState<string[]>([]);

    // Mortgage Calculator State
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [homePrice, setHomePrice] = useState(500000); // Default 500k
    const [downPayment, setDownPayment] = useState(100000); // 20%
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

    const toggleSave = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (savedProperties.includes(id)) {
            setSavedProperties(savedProperties.filter(p => p !== id));
        } else {
            setSavedProperties([...savedProperties, id]);
            toast.success("Property Saved");
        }
    };

    const displayName = store?.name || initialStoreName;

    return (
        <div className="bg-white min-h-screen font-serif text-slate-800 selection:bg-slate-200">
            <StorefrontSEO store={store} products={products} />
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                total={total}
                storeSlug={storeSlug || ""}
                onSuccess={clearCart}
            />

            {/* Quick View Modal (Reused) */}
            {selectedProperty && (
                <QuickViewModal
                    isOpen={!!selectedProperty}
                    onClose={() => setSelectedProperty(null)}
                    product={selectedProperty}
                    storeSlug={storeSlug || ""}
                />
            )}


            {/* RE-themed Cart */}
            <StorefrontCart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                storeSlug={storeSlug || ""}
                onCheckout={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                }}
            />

            {/* Mortgage Calculator Modal */}
            <AnimatePresence>
                {isCalculatorOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setIsCalculatorOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl relative z-10 font-sans"
                        >
                            <button onClick={() => setIsCalculatorOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                            <h3 className="font-serif text-2xl font-bold mb-6">Mortgage Estimator</h3>

                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Home Price</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₦</span>
                                        <input type="number" value={homePrice} onChange={(e) => setHomePrice(Number(e.target.value))} className="w-full pl-8 p-3 bg-slate-50 rounded-lg font-bold" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Down Payment</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₦</span>
                                            <input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="w-full pl-8 p-3 bg-slate-50 rounded-lg font-bold" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Interest Rate %</label>
                                        <input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full p-3 bg-slate-50 rounded-lg font-bold" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900 text-white p-6 rounded-xl text-center">
                                <div className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-widest">Estimated Monthly Payment</div>
                                <div className="text-4xl font-bold">₦{calculatePayment()}</div>
                                <p className="text-slate-500 text-xs mt-2">*Taxes and insurance not included.</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all">
                <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                    <div className="text-3xl font-black tracking-tight flex items-center gap-2 font-serif" style={{ color: config.primaryColor }}>
                        <Home className="w-8 h-8" />
                        {displayName}
                    </div>

                    <div className="hidden lg:flex items-center gap-10 font-sans text-sm font-bold tracking-widest uppercase text-slate-900">
                        <a href="#" className="hover:text-slate-500 transition-colors">Buy</a>
                        <a href="#" className="hover:text-slate-500 transition-colors">Rent</a>
                        <a href="#" className="hover:text-slate-500 transition-colors">Sell</a>
                        <button onClick={() => setIsCalculatorOpen(true)} className="hover:text-slate-500 transition-colors flex items-center gap-2">
                            Calculator
                        </button>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="hidden md:flex items-center gap-2 font-sans font-bold text-sm text-white px-6 py-3 rounded-none hover:opacity-90 transition-opacity uppercase tracking-wider"
                            style={{ backgroundColor: config.primaryColor }}
                        >
                            Book Viewing {cart.length > 0 && `(${cart.length})`}
                        </button>
                        <button
                            className="lg:hidden p-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40 bg-white pt-28 px-6 lg:hidden">
                    <div className="flex flex-col gap-6 font-sans font-bold text-2xl uppercase tracking-widest text-slate-900">
                        <a href="#" className="border-b border-slate-100 pb-2">Buy</a>
                        <a href="#" className="border-b border-slate-100 pb-2">Rent</a>
                        <a href="#" className="border-b border-slate-100 pb-2">Sell</a>
                        <button onClick={() => { setIsCalculatorOpen(true); setIsMenuOpen(false); }} className="text-left border-b border-slate-100 pb-2">Calculator</button>
                    </div>
                </div>
            )}


            {/* Hero */}
            <header className="h-[90vh] relative flex items-center justify-center pt-24">
                <div className="absolute inset-0 z-0">
                    <motion.div
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 10, ease: "easeOut" }}
                        className="absolute inset-0 z-0"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1600596542815-e0138d9ac048?q=80&w=1600&auto=format&fit=crop"
                            className="object-cover brightness-75"
                            alt="Luxury Home"
                            fill
                            priority
                            sizes="100vw"
                        />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                <div className="relative z-10 w-full max-w-5xl px-6 text-center">
                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-8xl font-bold text-white mb-8 shadow-black drop-shadow-2xl font-serif tracking-tight"
                    >
                        {config.heroTitle}
                    </motion.h1>

                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white p-4 md:p-6 shadow-2xl flex flex-col md:flex-row gap-4 max-w-4xl mx-auto rounded-sm"
                    >
                        <div className="flex-1 relative group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by city, neighborhood, or address"
                                className="w-full pl-14 pr-4 py-4 bg-slate-50 border-none font-sans outline-none focus:ring-0 text-lg placeholder:text-slate-400 text-slate-900 transition-colors focus:bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="border-l border-slate-100 hidden md:block"></div>
                            <select className="px-6 py-4 bg-slate-50 border-none font-sans text-lg appearance-none outline-none cursor-pointer hover:bg-slate-100 transition-colors">
                                <option>For Sale</option>
                                <option>For Rent</option>
                            </select>
                            <button
                                className="px-10 py-4 text-white font-sans font-bold tracking-widest uppercase hover:opacity-90 transition-opacity whitespace-nowrap"
                                style={{ backgroundColor: config.primaryColor }}
                            >
                                <span className="hidden md:inline">Search Properties</span>
                                <span className="md:hidden">Search</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Map Preview Section */}
            <section className="bg-slate-50 border-b border-slate-200 overflow-hidden relative h-[400px] flex items-center justify-center group cursor-pointer">
                <div className="absolute inset-0 bg-[url('https://docs.mapbox.com/mapbox-gl-js/assets/streets-v11.png')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90"></div>

                {/* Fake Pins */}
                <div className="absolute top-1/3 left-1/4 animate-bounce delay-75"><MapPin className="w-12 h-12 text-slate-900 fill-white" /></div>
                <div className="absolute top-1/2 right-1/3 animate-bounce delay-150"><MapPin className="w-12 h-12 text-slate-900 fill-white" /></div>
                <div className="absolute bottom-1/3 left-1/2 animate-bounce"><MapPin className="w-12 h-12 text-slate-900 fill-white" /></div>

                <div className="relative z-10 text-center">
                    <h3 className="font-bold text-3xl mb-4 font-serif">Explore Neighborhoods</h3>
                    <button className="px-8 py-3 bg-white border border-slate-200 shadow-xl rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform">
                        View Map
                    </button>
                </div>
            </section>

            {/* Listings */}
            <main className="py-24 px-6 max-w-7xl mx-auto bg-white">
                <div className="flex justify-between items-end mb-16 border-b border-slate-100 pb-6">
                    <div>
                        <h2 className="text-4xl font-bold mb-4 font-serif">Featured Properties</h2>
                        <p className="text-slate-500 font-sans max-w-md">
                            {config.heroDesc}
                        </p>
                    </div>
                    <a href="#" className="font-sans font-bold uppercase tracking-widest text-sm border-b-2 border-slate-900 pb-1 hover:text-slate-600 hover:border-slate-600 transition-colors hidden md:block">
                        View All Listings
                    </a>
                </div>

                {isLoading ? (
                    <div className="grid md:grid-cols-3 gap-10">
                        {[1, 2, 3].map(i => <div key={i} className="h-[500px] bg-slate-100 animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {products.length > 0 ? products.map((property, idx) => (
                            <article key={property.id}>
                                <Link
                                    href={`${basePath || ""}/products/${property.id}`}
                                    className="group cursor-pointer block"
                                >
                                    <div className="aspect-[3/4] overflow-hidden mb-6 relative">
                                        <Image
                                            src={`https://source.unsplash.com/random/800x1000?house,modern,${property.id}`}
                                            className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                            alt={property.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute top-4 left-4 bg-white px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider shadow-md">
                                            {idx === 0 ? 'Virtual Tour' : idx === 1 ? 'Open House' : 'New Listing'}
                                        </div>

                                        {/* Action Overlays */}
                                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                                            <button
                                                onClick={(e) => toggleSave(property.id, e)}
                                                className={`p-2 rounded-full bg-white shadow-md hover:bg-slate-50 transition-colors ${savedProperties.includes(property.id) ? 'text-red-500 fill-current' : 'text-slate-400'}`}
                                            >
                                                <Heart className={`w-5 h-5 ${savedProperties.includes(property.id) ? 'fill-current' : ''}`} />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setSelectedProperty(property);
                                                }}
                                                className="p-2 rounded-full bg-white shadow-md hover:bg-slate-50 transition-colors text-slate-900"
                                                title="Quick View"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="absolute bottom-4 right-4 text-white font-bold text-shadow-lg flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            View Details <ArrowRight className="w-4 h-4" />
                                        </div>
                                        {idx === 0 && (
                                            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
                                                <Video className="w-3 h-3" /> 3D Tour
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 font-serif group-hover:text-slate-600 transition-colors">{property.name}</h3>
                                    <p className="text-slate-500 mb-4 line-clamp-1 font-sans text-sm">{property.description || "Luxury amenities, prime location."}</p>
                                    <div className="flex items-center gap-6 text-sm font-sans font-medium text-slate-500 mb-6">
                                        <span className="flex items-center gap-2"><Bed className="w-4 h-4" /> 4 Beds</span>
                                        <span className="flex items-center gap-2"><Bath className="w-4 h-4" /> 3 Baths</span>
                                        <span className="flex items-center gap-2"><Maximize className="w-4 h-4" /> 2,500 sqft</span>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                                        <div className="text-2xl font-bold font-serif">₦{property.price.toLocaleString()}</div>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                addToCart(property);
                                            }}
                                            className="font-sans font-bold text-xs uppercase tracking-widest border border-slate-200 px-4 py-2 hover:text-white transition-colors"
                                            style={{ backgroundColor: '#fff', color: config.primaryColor }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = config.primaryColor, e.currentTarget.style.color = '#fff')}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff', e.currentTarget.style.color = config.primaryColor)}
                                        >
                                            Schedule Tour
                                        </button>
                                    </div>
                                </Link>
                            </article>
                        )) : (
                            <div className="col-span-full py-24 text-center border border-slate-200">
                                <p className="font-sans text-slate-500">No properties available at the moment.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Sticky Mobile Action */}
            <div className="fixed bottom-0 w-full bg-white border-t border-slate-200 p-4 md:hidden z-40 flex gap-4">
                <button className="flex-1 py-3 bg-slate-900 text-white font-bold uppercase tracking-wider text-xs" onClick={() => setIsCartOpen(true)}>Book Viewing</button>
                <button className="flex-1 py-3 bg-slate-100 text-slate-900 font-bold uppercase tracking-wider text-xs" onClick={() => setIsCalculatorOpen(true)}>Calculator</button>
            </div>

            <footer className="bg-slate-900 text-white py-24 px-6 font-sans border-t border-slate-800">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-sm leading-loose text-slate-400">
                    <div className="col-span-2">
                        <div className="text-2xl font-serif font-black mb-6 flex items-center gap-2" style={{ color: '#fff' }}>
                            <Home className="w-6 h-6" style={{ color: config.primaryColor }} /> {displayName}
                        </div>
                        <p className="max-w-xs">
                            Redefining luxury real estate with a commitment to exceptional service and curating the finest properties globally.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-widest">Connect</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-widest">Company</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
}
