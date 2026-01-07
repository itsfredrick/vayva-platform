import React from "react";
import { MobileHeader } from "./components/MobileHeader";
import { HeroBanner } from "./components/HeroBanner";
import { SectionHeader } from "./components/SectionHeader";
import { CategoryTileGrid } from "./components/CategoryTileGrid";
import { ProductGrid } from "./components/ProductGrid";
import { PublicStore, PublicProduct } from "@/types/storefront";
import { useStore } from "@/context/StoreContext";

interface AAFashionHomeProps {
  store: PublicStore;
  products: PublicProduct[];
}

export const AAFashionHome = ({ store, products }: AAFashionHomeProps) => {
  const { cart } = useStore();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Derive categories dynamically from products
  const uniqueCategories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean)),
  );

  const categories = uniqueCategories.slice(0, 4).map((catName, index) => {
    const representativeProduct = products.find((p) => p.category === catName);
    return {
      id: `cat-${index}`,
      name: catName as string,
      slug: (catName as string).toLowerCase().replace(/\s+/g, "-"),
      imageUrl:
        representativeProduct?.images?.[0] ||
        "/images/hero-lifestyle.jpg",
    };
  });

  const bestSellers = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-white pb-20 font-sans text-[#111111]">
      <MobileHeader
        storeName={store.name}
        cartItemCount={cartItemCount}
        brandColor={store.brandColor}
      />

      <main>
        {/* Hero */}
        <HeroBanner
          title="NEW ARRIVALS"
          subtitle="Elegant styles for every occasion"
        />

        {/* Categories */}
        <SectionHeader
          title="Top Categories"
          actionHref={`/collections/all?store=${store.slug}`}
        />
        <CategoryTileGrid categories={categories} />

        {/* Best Sellers */}
        <SectionHeader
          title="Best Sellers"
          actionHref={`/collections/all?store=${store.slug}`}
        />
        <ProductGrid
          products={products}
          storeSlug={store.slug}
          brandColor={store.brandColor}
        />

        {/* Footer / Spacing */}
        <div className="mt-12 px-4 py-8 bg-gray-50 text-center text-xs text-gray-400">
          <p>
            © {new Date().getFullYear()} {store.name}
          </p>
          <p className="mt-2">Powered by Vayva</p>
        </div>
      </main>
    </div>
  );
};
