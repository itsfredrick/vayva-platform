"use client";

import React, { useState } from "react";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { ProductData } from "@/hooks/storefront/useStorefront";
import { StorefrontCart } from "../StorefrontCart";
import { CheckoutModal } from "../CheckoutModal";
import { Star, MapPin, Lock, ChevronDown, ChevronRight, ShoppingCart, Heart, Share2, PlayCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function AmazonianPDP({
    product,
    storeSlug,
    storeName,
    basePath = ``,
    relatedProducts = []
}: {
    product: ProductData;
    storeSlug: string;
    storeName: string;
    basePath?: string;
    relatedProducts?: ProductData[];
}) {
    const [quantity, setQuantity] = useState(1);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [activeImage, setActiveImage] = useState(product.image);

    const {
        cart,
        addToCart,
        isOpen: isCartOpen,
        setIsOpen: setIsCartOpen,
        clearCart,
        total
    } = useStorefrontCart(storeSlug);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        toast.success("Added to Cart", {
            description: `${quantity}x ${product.name} added.`,
            icon: <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white"><CheckIcon className="w-3 h-3" /></div>
        });
    };

    const handleBuyNow = () => {
        addToCart(product, quantity);
        setTimeout(() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
        }, 100);
    };

    // Mock Delivery Date (2 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 2);
    const dateString = deliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'long' });

    return (
        <div className="bg-white min-h-screen font-sans text-[#0F1111]">
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                total={total}
                storeSlug={storeSlug}
                onSuccess={clearCart}
            />

            {/* Navbar (Amazon-ish) */}
            <nav className="bg-[#131921] text-white py-3 px-4 sticky top-0 z-50 shadow-md">
                <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-4">
                    <Link href={basePath} className="flex flex-col leading-none hover:outline outline-1 outline-white rounded-sm p-1">
                        <span className="text-xs font-bold text-gray-300">Back to</span>
                        <span className="font-bold text-lg tracking-tight">{storeName}</span>
                    </Link>

                    {/* Search Bar Mock */}
                    <div className="hidden md:flex flex-1 max-w-2xl bg-white rounded-md overflow-hidden h-10 focus-within:ring-2 focus-within:ring-[#F3A847]">
                        <button className="bg-gray-100 px-3 text-xs text-gray-600 border-r border-gray-300 hover:bg-gray-200">All</button>
                        <input type="text" placeholder={`Search ${storeName}`} className="flex-1 px-3 text-black outline-none" />
                        <button className="bg-[#FEBD69] px-4 hover:bg-[#F3A847] text-black">
                            <SearchIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2 flex items-end font-bold hover:outline outline-1 outline-white rounded-sm"
                    >
                        <div className="relative">
                            <ShoppingCart className="w-8 h-8 text-white" />
                            <span className="absolute -top-1 right-0 text-[#F3A847] font-bold text-base leading-none">
                                {cart.length}
                            </span>
                        </div>
                        <span className="hidden md:inline ml-1 text-sm mb-1">Cart</span>
                    </button>
                </div>
            </nav>

            {/* Sub-nav */}
            <div className="bg-[#232f3e] text-white text-sm py-2 px-4 mb-4 hidden md:block">
                <div className="max-w-[1500px] mx-auto flex items-center gap-6">
                    <button className="flex items-center gap-1 font-bold"><MenuIcon className="w-4 h-4" /> All</button>
                    <a href="#" className="hover:underline">Today's Deals</a>
                    <a href="#" className="hover:underline">Customer Service</a>
                    <a href="#" className="hover:underline">Registry</a>
                    <a href="#" className="hover:underline">Gift Cards</a>
                    <a href="#" className="hover:underline">Sell</a>
                </div>
            </div>

            <StorefrontCart
                storeSlug={storeSlug}
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onCheckout={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                }}
            />

            <main className="max-w-[1500px] mx-auto px-4 py-4 mb-24">
                {/* Breadcrumbs */}
                <div className="text-xs text-[#565959] mb-4 flex items-center gap-1">
                    <span className="hover:underline cursor-pointer">{product.category || "Products"}</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="hover:underline cursor-pointer font-bold text-[#C7511F]">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* COL 1: GALLERY (4 cols) */}
                    <div className="lg:col-span-5 flex gap-4 sticky top-24 self-start">
                        {/* Thumbnails */}
                        <div className="hidden md:flex flex-col gap-3">
                            {[product.image, ...Array(4).fill(null)].map((_, i) => (
                                <button
                                    key={i}
                                    onMouseEnter={() => setActiveImage(product.image)} // In real app, different images
                                    className={`w-12 h-12 rounded border overflow-hidden hover:shadow-[0_0_0_2px_#e77600] ${i === 0 ? 'shadow-[0_0_0_1px_#e77600] border-[#e77600]' : 'border-gray-300'}`}
                                >
                                    <img src={product.image || ""} className="w-full h-full object-contain bg-white" />
                                </button>
                            ))}
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 bg-white rounded flex items-center justify-center relative group cursor-crosshair">
                            <img
                                src={activeImage || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"}
                                alt={product.name}
                                className="max-h-[600px] w-auto max-w-full object-contain transition-transform duration-200"
                            />
                            <div className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 cursor-pointer text-gray-500">
                                <Share2 className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    {/* COL 2: CENTER INFO (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col">
                        <h1 className="text-2xl font-medium leading-tight mb-1 text-[#0F1111]">
                            {product.name}
                        </h1>
                        <Link href={basePath} className="text-sm text-[#007185] hover:underline hover:text-[#C7511F] mb-2 font-medium">
                            Visit the {storeName} Store
                        </Link>

                        <div className="flex items-center gap-2 mb-4 text-sm">
                            <div className="flex text-[#F3A847]">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current text-[#F3A847]/40" />
                            </div>
                            <span className="text-[#007185] hover:underline cursor-pointer">4.2</span>
                            <span className="text-[#007185] hover:underline cursor-pointer border-l border-gray-300 pl-2">1,240 ratings</span>
                            <span className="text-[#565959] border-l border-gray-300 pl-2">Search this page</span>
                        </div>

                        <div className="border-t border-b border-gray-200 py-4 mb-4">
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-[28px] leading-none font-medium text-[#C7511F]">-15%</span>
                                <div className="flex items-start text-[#0F1111]">
                                    <span className="text-xs mt-1">₦</span>
                                    <span className="text34px] leading-none font-medium text-[28px]">{product.price.toLocaleString()}</span>
                                    <span className="text-xs mt-1">00</span>
                                </div>
                            </div>
                            {product.originalPrice && (
                                <div className="text-sm text-[#565959]">
                                    List Price: <span className="line-through">₦{product.originalPrice.toLocaleString()}</span>
                                </div>
                            )}
                        </div>

                        {/* Variations Mock */}
                        <div className="mb-6">
                            <span className="text-sm font-bold text-[#555]">Color: </span>
                            <span className="text-sm font-bold text-[#0F1111]">Midnight Black</span>
                            <div className="flex gap-2 mt-2">
                                {['bg-black', 'bg-blue-800', 'bg-zinc-400'].map((bg, i) => (
                                    <button
                                        key={i}
                                        className={`w-10 h-10 rounded-full border-2 ${i === 0 ? 'border-[#C7511F] p-0.5' : 'border-gray-200 hover:border-black'} `}
                                    >
                                        <div className={`w-full h-full rounded-full ${bg} shadow-sm border border-black/10`}></div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-bold text-base mb-2">About this item</h3>
                            <ul className="list-disc pl-5 text-sm space-y-1 text-[#0F1111] leading-relaxed">
                                <li><strong>PREMIUM QUALITY:</strong> Designed with high-grade materials for durability and long-lasting performance in any environment.</li>
                                <li><strong>EFFICIENCY:</strong> Optimized workflow ensures you get more done in less time with zero lag.</li>
                                <li><strong>COMPATIBILITY:</strong> Works seamlessly with all major platforms and ecosystem devices out of the box.</li>
                                <li><strong>WARRANTY:</strong> Includes a comprehensive 1-year manufacturer warranty for peace of mind.</li>
                            </ul>
                        </div>
                    </div>

                    {/* COL 3: BUY BOX (3 cols) */}
                    <div className="lg:col-span-3">
                        <div className="border border-[#D5D9D9] rounded-lg p-5 shadow-sm">
                            <div className="flex items-start text-[#0F1111] mb-2">
                                <span className="text-xs mt-1">₦</span>
                                <span className="text-xl leading-none font-medium font-bold text-[24px]">{product.price.toLocaleString()}</span>
                                <span className="text-xs mt-1">00</span>
                            </div>

                            <div className="text-sm text-[#565959] mb-4">
                                <span className="text-[#007185] hover:underline cursor-pointer">Free Returns</span>
                            </div>

                            <div className="text-sm text-[#0F1111] mb-4">
                                <div>FREE delivery <span className="font-bold text-[#0F1111]">{dateString}</span>.</div>
                                <div className="mt-1 flex items-center gap-1 text-[#565959]">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-xs text-[#007185] hover:underline cursor-pointer">Deliver to User - Lagos 100001</span>
                                </div>
                            </div>

                            <div className="text-lg text-[#007600] font-medium mb-4">
                                In Stock
                            </div>

                            <div className="mb-4">
                                <div className="relative">
                                    <select
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="w-full appearance-none bg-[#F0F2F2] border border-[#D5D9D9] text-[#0F1111] text-sm rounded-lg shadow-[0_2px_5px_rgba(15,17,17,0.15)] py-1.5 pl-3 pr-8 hover:bg-[#E3E6E6] focus:ring focus:ring-[#007185]/50 focus:border-[#007185]"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>Qty: {n}</option>)}
                                    </select>
                                    <ChevronDown className="w-3 h-3 text-[#565959] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-3 mb-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-full py-2 text-sm text-[#0F1111] shadow-sm cursor-pointer"
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    className="w-full bg-[#FFA41C] hover:bg-[#FA8900] border border-[#FF8F00] rounded-full py-2 text-sm text-[#0F1111] shadow-sm cursor-pointer"
                                >
                                    Buy Now
                                </button>
                            </div>

                            <div className="text-xs text-[#565959] space-y-2 mb-4">
                                <div className="grid grid-cols-2">
                                    <span>Ships from</span>
                                    <span className="text-[#0F1111]">{storeName}</span>
                                </div>
                                <div className="grid grid-cols-2">
                                    <span>Sold by</span>
                                    <span className="text-[#007185] hover:underline cursor-pointer">{storeName}</span>
                                </div>
                                <div className="grid grid-cols-2">
                                    <span>Returns</span>
                                    <span className="text-[#007185] hover:underline cursor-pointer">30-day refund/replacement</span>
                                </div>
                                <div className="grid grid-cols-2">
                                    <span>Payment</span>
                                    <span className="text-[#007185] hover:underline cursor-pointer">Secure transaction</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-3">
                                <button className="w-full text-left flex items-start gap-2 text-xs text-[#0F1111] hover:text-[#C7511F] hover:underline">
                                    <div className="mt-0.5"><Lock className="w-3 h-3 text-gray-400" /></div>
                                    <span>Add a protection plan:</span>
                                </button>
                                <div className="mt-1 ml-5">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" className="accent-[#007185]" />
                                        <span className="text-xs text-[#0F1111] hover:text-[#C7511F] hover:underline cursor-pointer mr-1">2-Year Protection</span>
                                        <span className="text-xs text-[#B12704]">₦2,500</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 mt-4 pt-4">
                                <button className="w-full border border-gray-300 rounded shadow-sm bg-white hover:bg-gray-50 text-sm py-1.5">
                                    Add to List
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Long Description / Comparisons */}
                <div className="mt-16 border-t border-gray-200 pt-8 max-w-4xl">
                    <h2 className="text-[#C7511F] font-bold text-xl mb-4">Product Description</h2>
                    <div className="prose prose-sm max-w-none text-[#333]">
                        <p>{product.description || "No detailed description available."}</p>
                        <p>Experience the perfect blend of style and functionality. This product has been rigorously tested to ensure it meets the highest standards of quality. Whether you are using it for professional work or personal enjoyment, it delivers reliable performance every time.</p>

                        <h3>Key Features</h3>
                        <ul>
                            <li>Advanced connectivity options including Bluetooth 5.0 and USB-C.</li>
                            <li>Long-lasting battery life (up to 24 hours on a single charge).</li>
                            <li>Ergonomic design fits comfortably for all-day use.</li>
                            <li>Water-resistant coating protects against spills and splashes.</li>
                        </ul>
                    </div>
                </div>

                {/* Mock Recommended */}
                <div className="mt-16 border-t border-gray-200 pt-8">
                    <h2 className="font-bold text-xl mb-6 text-[#0F1111]">Recommended for you</h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="bg-gray-100 aspect-[3/4] rounded flex items-center justify-center">
                                    <ShoppingCart className="w-8 h-8 text-gray-300" />
                                </div>
                                <div className="text-sm hover:text-[#C7511F] hover:underline cursor-pointer truncate">
                                    Premium Accessory Kit for {product.name}
                                </div>
                                <div className="text-[#B12704] text-xs font-medium">₦15,000</div>
                            </div>
                        ))}
                    </div>
                </div>

            </main>


        </div>
    );
}

// Icons
function CheckIcon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> }
function SearchIcon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> }
function MenuIcon(props: any) { return <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg> }
