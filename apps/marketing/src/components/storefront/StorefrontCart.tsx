import React from "react";
import { ShoppingBag, X, Minus, Plus, Truck, ArrowRight } from "lucide-react";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { motion, AnimatePresence } from "framer-motion";

export function StorefrontCart({
    storeSlug,
    isOpen,
    onClose,
    onCheckout,
}: {
    storeSlug: string;
    isOpen: boolean;
    onClose: () => void;
    onCheckout: () => void;
}) {
    const { cart, updateQuantity, removeFromCart, total, addToCart } = useStorefrontCart(storeSlug);

    // Mock Free Shipping Threshold
    const FREE_SHIPPING_THRESHOLD = 50000;
    const progress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
    const remaining = FREE_SHIPPING_THRESHOLD - total;

    // Mock Upsell Item
    const upsellItem = {
        id: "upsell-1",
        name: "Express Delivery Pass",
        price: 2500,
        image: "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?q=80&w=200&auto=format&fit=crop",
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex justify-end">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
                    />

                    {/* Drawer */}
                    {/* Drawer */}
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cart-title"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                            <div>
                                <h2 id="cart-title" className="text-xl font-bold flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                                    Your Cart
                                </h2>
                                <div className="text-xs text-gray-500 mt-1">
                                    {cart.length} {cart.length === 1 ? 'item' : 'items'}
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                aria-label="Close cart"
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Free Shipping Bar */}
                        {cart.length > 0 && (
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                                    <Truck className="w-4 h-4 text-gray-500" aria-hidden="true" />
                                    {remaining > 0 ? (
                                        <span>Spend <span className="text-black font-bold">₦{remaining.toLocaleString()}</span> more for free shipping</span>
                                    ) : (
                                        <span className="text-emerald-600 font-bold">You've unlocked Free Shipping!</span>
                                    )}
                                </div>
                                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Free shipping progress">
                                    <div
                                        className="h-full bg-black transition-all duration-500 ease-out"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                                        <ShoppingBag className="w-8 h-8 opacity-40" aria-hidden="true" />
                                    </div>
                                    <p className="font-medium text-lg text-gray-900">Your cart is empty</p>
                                    <p className="text-sm max-w-[200px] text-center mb-4">Looks like you haven't added anything to your cart yet.</p>
                                    <button
                                        onClick={onClose}
                                        className="bg-black text-white px-8 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <AnimatePresence initial={false}>
                                        {cart.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                className="flex gap-4 group"
                                            >
                                                {/* Image */}
                                                <div className="w-24 h-28 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100 relative">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                                            <ShoppingBag className="w-6 h-6" aria-hidden="true" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 flex flex-col justify-between py-1">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-1">
                                                            <h3 className="font-bold text-base text-gray-900 line-clamp-2 leading-tight">
                                                                {item.name}
                                                            </h3>
                                                            <span className="font-bold text-base ml-2">
                                                                ₦{(item.price * item.quantity).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-500">Unit Price: ₦{item.price.toLocaleString()}</div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center border border-gray-200 rounded-lg p-1">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, -1)}
                                                                aria-label="Decrease quantity"
                                                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-gray-600 transition-colors"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="w-8 text-center text-sm font-semibold tabular-nums">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, 1)}
                                                                aria-label="Increase quantity"
                                                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-gray-600 transition-colors"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            aria-label={`Remove ${item.name} from cart`}
                                                            className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors p-2"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}

                                    </AnimatePresence>

                                    {/* Upsell Mock */}
                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                        <h4 className="font-bold text-sm mb-4">You might also like</h4>
                                        <div className="flex gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <div className="w-12 h-12 rounded-lg bg-white shrink-0 overflow-hidden">
                                                <img src={upsellItem.image} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold text-sm line-clamp-1">{upsellItem.name}</div>
                                                <div className="text-xs text-gray-500">₦{upsellItem.price.toLocaleString()}</div>
                                            </div>
                                            <button
                                                onClick={() => addToCart({ ...upsellItem, quantity: 1, description: "Fast shipping addon" })}
                                                className="text-xs font-bold bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition-colors self-center"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-20">
                                <div className="flex justify-between items-end mb-4">
                                    <span className="text-gray-500 text-sm font-medium">Subtotal</span>
                                    <div className="text-right">
                                        <span className="text-2xl font-black block tracking-tight">
                                            ₦{total.toLocaleString()}
                                        </span>
                                        <span className="text-xs text-gray-400 font-medium">
                                            Excludes delivery & taxes
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={onCheckout}
                                    className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-900 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 group"
                                >
                                    Secure Checkout <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
