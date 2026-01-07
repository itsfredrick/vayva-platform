import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ProductData } from "./useStorefront";

export function useStorefrontQuery() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Helper to update query params without reload
    const updateQuery = useCallback((name: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(name, value);
        } else {
            params.delete(name);
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [pathname, router, searchParams]);

    return { searchParams, updateQuery };
}

export function useCartQuery(
    isCartOpen: boolean,
    setIsOpen: (isOpen: boolean) => void
) {
    const { searchParams, updateQuery } = useStorefrontQuery();
    const isCartParamSet = searchParams.get("cart") === "open";

    // Sync URL -> State (Initial Load & Back Button)
    useEffect(() => {
        if (isCartParamSet && !isCartOpen) {
            setIsOpen(true);
        } else if (!isCartParamSet && isCartOpen) {
            setIsOpen(false);
        }
    }, [isCartParamSet, isCartOpen, setIsOpen]);

    // Sync State -> URL (User Interaction)
    useEffect(() => {
        if (isCartOpen && !isCartParamSet) {
            updateQuery("cart", "open");
        } else if (!isCartOpen && isCartParamSet) {
            updateQuery("cart", null);
        }
    }, [isCartOpen, isCartParamSet, updateQuery]);
}

export function useProductModalQuery(
    selectedProduct: ProductData | null,
    setSelectedProduct: (product: ProductData | null) => void,
    products: ProductData[]
) {
    const { searchParams, updateQuery } = useStorefrontQuery();
    const productIdParam = searchParams.get("product");

    // Sync URL -> State
    useEffect(() => {
        if (productIdParam && !selectedProduct) {
            const product = products.find((p) => p.id === productIdParam);
            if (product) {
                setSelectedProduct(product);
            }
        } else if (!productIdParam && selectedProduct) {
            setSelectedProduct(null);
        }
    }, [productIdParam, selectedProduct, products, setSelectedProduct]);

    // Sync State -> URL
    useEffect(() => {
        if (selectedProduct && productIdParam !== selectedProduct.id) {
            updateQuery("product", selectedProduct.id);
        } else if (!selectedProduct && productIdParam) {
            updateQuery("product", null);
        }
    }, [selectedProduct, productIdParam, updateQuery]);
}

export function useCategoryQuery(
    activeCategory: string,
    setActiveCategory: (category: string) => void,
    defaultCategory: string = "All"
) {
    const { searchParams, updateQuery } = useStorefrontQuery();
    const categoryParam = searchParams.get("category");

    // Sync URL -> State
    useEffect(() => {
        if (categoryParam && categoryParam !== activeCategory) {
            setActiveCategory(categoryParam);
        } else if (!categoryParam && activeCategory !== defaultCategory) {
            setActiveCategory(defaultCategory);
        }
    }, [categoryParam, activeCategory, setActiveCategory, defaultCategory]);

    // Sync State -> URL
    useEffect(() => {
        if (activeCategory !== defaultCategory && categoryParam !== activeCategory) {
            updateQuery("category", activeCategory);
        } else if (activeCategory === defaultCategory && categoryParam) {
            updateQuery("category", null);
        }
    }, [activeCategory, categoryParam, updateQuery, defaultCategory]);
}

export function useSearchQuery(
    searchQuery: string,
    setSearchQuery: (query: string) => void
) {
    const { searchParams, updateQuery } = useStorefrontQuery();
    const searchParam = searchParams.get("search");

    // Sync URL -> State
    useEffect(() => {
        if (searchParam && searchParam !== searchQuery) {
            setSearchQuery(searchParam);
        } else if (!searchParam && searchQuery) {
            setSearchQuery("");
        }
    }, [searchParam, searchQuery, setSearchQuery]);

    // Sync State -> URL
    useEffect(() => {
        if (searchQuery && searchParam !== searchQuery) {
            const timeoutId = setTimeout(() => {
                updateQuery("search", searchQuery);
            }, 500); // Debounce
            return () => clearTimeout(timeoutId);
        } else if (!searchQuery && searchParam) {
            updateQuery("search", null);
        }
    }, [searchQuery, searchParam, updateQuery]);
}

export function useQueryState<T extends string | number>(
    key: string,
    value: T,
    setValue: (val: T) => void,
    defaultValue?: T
) {
    const { searchParams, updateQuery } = useStorefrontQuery();
    const param = searchParams.get(key);

    // Sync URL -> State
    useEffect(() => {
        if (param && param !== String(value)) {
            if (typeof value === 'number') {
                setValue(Number(param) as T);
            } else {
                setValue(param as T);
            }
        } else if (!param && defaultValue !== undefined && value !== defaultValue) {
            setValue(defaultValue);
        }
    }, [param, value, setValue, defaultValue]);

    // Sync State -> URL
    useEffect(() => {
        if (value && String(value) !== param && (!defaultValue || value !== defaultValue)) {
            updateQuery(key, String(value));
        } else if ((!value || (defaultValue && value === defaultValue)) && param) {
            updateQuery(key, null);
        }
    }, [value, param, updateQuery, key, defaultValue]);
}
