"use client";

import { EmptyState, Button, Icon, Badge } from "@vayva/ui";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/LoadingSkeletons";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // In real app, append ?search=${search} to API
                const res = await fetch("/api/products/items");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setProducts(data);
                }
            } catch (e) {
                console.error("Failed to load products", e);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Client-side filter for now
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.status.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-6">
                    <Skeleton className="h-12 w-full" />
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-8">
                            <Skeleton className="h-12 w-12 rounded-lg" />
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-6 w-20 rounded-full ml-auto" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-900 font-heading">Products 🛍️</h1>
                <EmptyState
                    title="Add your first product"
                    icon="Package"
                    description="You haven't added any products yet. Start selling by adding your inventory."
                    action={
                        <Link href="/dashboard/products/new">
                            <Button className="px-8 font-bold h-11 rounded-xl">Add Product</Button>
                        </Link>
                    }
                />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 font-heading">Products 🛍️</h1>
                    <p className="text-gray-500 mt-1 font-medium">Manage your inventory and catalog.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-full md:w-64">
                        <input
                            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-black focus:outline-none transition-all shadow-sm"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Icon name="Search" size={16} className="absolute left-3 top-3 text-gray-400" />
                    </div>
                    <Link href="/dashboard/products/new">
                        <Button className="font-bold h-10 px-6 rounded-xl shadow-lg shadow-black/5">Add Product</Button>
                    </Link>
                </div>
            </div>

            <div className="glass-card rounded-3xl shadow-sm border-none overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/50 text-gray-400 font-bold uppercase tracking-widest text-[10px] border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-5">Product</th>
                                <th className="px-6 py-5">Price</th>
                                <th className="px-6 py-5">Inventory</th>
                                <th className="px-6 py-5">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white/50 backdrop-blur-sm">
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No products match search "{search}"
                                    </td>
                                </tr>
                            )}
                            {filteredProducts.map((p) => (
                                <tr key={p.id} className="hover:bg-white/80 transition-all cursor-pointer group" onClick={() => router.push(`/dashboard/products/${p.id}`)}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                                {p.image ? (
                                                    <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-gray-300">
                                                        <Icon name="Image" size={18} />
                                                    </div>
                                                )}
                                            </div>
                                            <span className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono font-medium text-gray-700">
                                        {p.currency} {p.price.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {p.inventory.enabled ? (
                                            <span className={`text-xs font-bold ${p.inventory.quantity > 0 ? 'text-gray-600' : 'text-red-500'}`}>
                                                {p.inventory.quantity} in stock
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Unlimited</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={p.status === 'ACTIVE' ? 'success' : 'default'} className="uppercase text-[10px] tracking-wider">
                                            {p.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile FAB */}
            <div className="fixed bottom-24 right-6 md:hidden z-40">
                <Link href="/dashboard/products/new">
                    <Button size="icon" className="h-14 w-14 rounded-full shadow-xl bg-black text-white hover:bg-gray-800 border-2 border-white">
                        <Icon name="Plus" size={24} />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
