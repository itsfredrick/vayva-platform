import React, { useState } from "react";
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
  ShoppingCart, X, Plus, Minus, Cpu, Eye, Heart, GitCompare, Check, Zap
} from "lucide-react";
import { StorefrontSEO } from "./StorefrontSEO";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { useCartQuery, useProductModalQuery } from "@/hooks/storefront/useStorefrontQuery";

export function GizmoTechHome({
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

  // Merge config: Props override (preview) > DB config > Defaults
  const config = configOverride || store?.templateConfig || {};

  const primaryColor = config.primaryColor || "#00ff41";
  const showMatrix = config.showMatrix ?? true;
  const { products, isLoading } = useStorefrontProducts(storeSlug, {
    limit: 8,
  });

  const rootPath = basePath || "";

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
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);

  // useProductModalQuery hooks into the URL but doesn't return setProductQuery in the current implementation.
  // We can just rely on the side effect of syncing URL -> state.
  useProductModalQuery(selectedProduct, setSelectedProduct, products);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const displayName = store?.name || initialStoreName;

  const toggleCompare = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (compareList.includes(id)) {
      setCompareList(compareList.filter(c => c !== id));
    } else {
      if (compareList.length >= 3) {
        toast.error("Compare limit reached (max 3)");
        return;
      }
      setCompareList([...compareList, id]);
      toast.success("Added to Compare");
    }
  };

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(w => w !== id));
    } else {
      setWishlist([...wishlist, id]);
      toast.success("Saved to Wishlist");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-gray-100 selection:bg-blue-600 selection:text-white">
      <StorefrontSEO store={store} products={products} activeProduct={selectedProduct} />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={total}
        storeSlug={storeSlug || ""}
        onSuccess={clearCart}
      />

      {selectedProduct && (
        <QuickViewModal
          isOpen={!!selectedProduct}
          onClose={() => {
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          storeSlug={storeSlug || ""}
        />
      )}

      <StorefrontCart
        storeSlug={storeSlug || ""}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Matrix Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(0deg, transparent 24%, rgba(0, 255, 65, .3) 25%, rgba(0, 255, 65, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 65, .3) 75%, rgba(0, 255, 65, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 65, .3) 25%, rgba(0, 255, 65, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 65, .3) 75%, rgba(0, 255, 65, .3) 76%, transparent 77%, transparent)",
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Navbar */}
      <nav className="border-b border-white/10 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cpu className="w-6 h-6 animate-pulse" style={{ color: primaryColor }} />
            <span className="text-xl font-bold tracking-widest" style={{ textShadow: `0 0 10px ${primaryColor}` }}>
              {displayName}
            </span>
          </div>
          <div className="flex gap-6 text-xs md:text-sm uppercase tracking-widest">
            {compareList.length > 0 && (
              <button className="flex items-center gap-2 text-[#00ff41] animate-pulse glow-green">
                <GitCompare className="w-4 h-4" /> Compare ({compareList.length})
              </button>
            )}
            <button
              className="hover:bg-[#00ff41] hover:text-black px-2 py-1 transition-colors flex items-center gap-2 border border-[#00ff41]/20"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>SYSTEM.CART({cart.length})</span>
            </button>
          </div>
        </div>
        {/* Matrix Background Effect */}
        {showMatrix && (
          <div className="fixed inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_0%,rgba(0,255,65,0.2)_50%,rgba(0,0,0,0)_100%)] bg-[length:100%_4px] animate-[scan_4s_linear_infinite]" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0) 0%, ${primaryColor}33 50%, rgba(0,0,0,0) 100%)` }}></div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-4 text-[#00ff41] drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]">
            {displayName}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Your premier destination for cutting-edge cybernetic enhancements and advanced hardware.
          </p>
          <Link
            href="#products"
            className="inline-flex items-center justify-center px-8 py-3 border border-[#00ff41] text-base font-medium text-black bg-[#00ff41] hover:bg-[#00ff41]/80 transition-colors uppercase tracking-widest"
          >
            Explore Systems <Zap className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Features Stagger */}
      <section className="border-y border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto py-16 px-6 grid md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <Cpu className="w-12 h-12 text-[#00ff41] mb-4 drop-shadow-[0_0_5px_rgba(0,255,65,0.5)]" />
            <h3 className="text-xl font-bold mb-2">Advanced Processors</h3>
            <p className="text-gray-400 text-sm">Unleash unparalleled computational power.</p>
          </div>
          <div className="flex flex-col items-center">
            <Eye className="w-12 h-12 text-[#00ff41] mb-4 drop-shadow-[0_0_5px_rgba(0,255,65,0.5)]" />
            <h3 className="text-xl font-bold mb-2">Neural Interfaces</h3>
            <p className="text-gray-400 text-sm">Seamless integration with your consciousness.</p>
          </div>
          <div className="flex flex-col items-center">
            <Check className="w-12 h-12 text-[#00ff41] mb-4 drop-shadow-[0_0_5px_rgba(0,255,65,0.5)]" />
            <h3 className="text-xl font-bold mb-2">Guaranteed Reliability</h3>
            <p className="text-gray-400 text-sm">Built to last beyond the singularity.</p>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <main id="products" className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex items-center justify-between mb-8 border-b border-[#00ff41]/30 pb-2">
          <h2 className="text-2xl uppercase tracking-widest">
            Latest Hardware
          </h2>
          <div className="text-xs animate-pulse">STATUS: ONLINE</div>
        </div>

        {isLoading && products.length === 0 ? (
          <div className="py-20 text-center animate-pulse">
            Scanning database...
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center border border-[#00ff41]/30 border-dashed">
            <p className="opacity-70">No hardware found in sector.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`${rootPath}/products/${product.id}`}
                className="group border border-[#00ff41]/30 bg-black hover:bg-[#00ff41]/5 transition-all relative overflow-hidden block cursor-pointer"
              >
                {/* Wishlist Decorator */}
                <button
                  onClick={(e) => toggleWishlist(product.id, e)}
                  className={`absolute top-2 right-2 z-20 p-2 rounded-full border border-[#00ff41]/20 hover:bg-[#00ff41] hover:text-black transition-colors ${wishlist.includes(product.id) ? 'bg-[#00ff41] text-black' : 'text-[#00ff41]'}`}
                >
                  <Heart className="w-3 h-3 fill-current" />
                </button>

                {/* Compare Decorator */}
                <button
                  onClick={(e) => toggleCompare(product.id, e)}
                  className={`absolute top-10 right-2 z-20 p-2 rounded-full border border-[#00ff41]/20 hover:bg-[#00ff41] hover:text-black transition-colors ${compareList.includes(product.id) ? 'bg-[#00ff41] text-black' : 'text-[#00ff41]'}`}
                  title="Compare"
                >
                  <GitCompare className="w-3 h-3" />
                </button>

                {/* Corner Markers */}
                <div className="absolute top-0 left-0 p-1 border-t border-l border-[#00ff41] w-4 h-4 opacity-50"></div>
                <div className="absolute bottom-0 right-0 p-1 border-b border-r border-[#00ff41] w-4 h-4 opacity-50"></div>

                <div className="aspect-square bg-[#050505] relative flex items-center justify-center border-b border-[#00ff41]/20 group/image">
                  <div className="relative w-[80%] h-[80%]">
                    <Image
                      src={
                        product.image ||
                        `https://via.placeholder.com/400x400/000/0f0?text=${encodeURIComponent(product.name)}`
                      }
                      alt={product.name}
                      fill
                      className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>

                  {/* Quick View Button (Hover) */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedProduct(product);
                    }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#00ff41] text-black px-4 py-2 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:translate-y-0 group-hover:opacity-100 translate-y-4 transition-all flex items-center gap-2"
                  >
                    <Eye className="w-3 h-3" /> Quick Scan
                  </button>

                  {/* Specs overlay */}
                  <div className="absolute top-2 left-2 text-[10px] font-mono teaxt-[#00ff41]/50 group-hover:text-[#00ff41] transition-colors">
                    MK-II // {product.id.substring(0, 4)}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-sm mb-1 truncate text-[#00ff41] group-hover:text-white transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center text-xs text-[#00ff41]/70 mb-4">
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {product.category || "Unit"}</span>
                    <span>In Stock</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-lg">
                      ₦{product.price.toLocaleString()}
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="px-3 py-1 bg-[#00ff41]/10 border border-[#00ff41] hover:bg-[#00ff41] hover:text-black text-xs font-bold uppercase transition-colors"
                    >
                      Acquire
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#00ff41]/30 mt-20 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs opacity-50">
          <p>SYSTEM_ID: {storeSlug || "UNKNOWN"}</p>
          <p className="mt-2">
            © {new Date().getFullYear()} {displayName} Industries. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
