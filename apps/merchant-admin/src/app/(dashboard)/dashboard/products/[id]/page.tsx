"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductForm } from "@/components/product-form";
import { Loader2 } from "lucide-react";

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/items/${params.id}`);
                if (!res.ok) {
                    router.push("/dashboard/products"); // Fallback
                    return;
                }
                const data = await res.json();
                setProduct(data);
            } catch (error) {
                console.error("Failed to load product", error);
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchProduct();
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!product) return null;

    return <ProductForm initialData={product} isEdit={true} />;
}
