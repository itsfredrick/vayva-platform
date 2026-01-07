"use client";

import { EmptyState, Button, Badge, Icon } from "@vayva/ui";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate } from "@/lib/formatters";
import { Skeleton, TableSkeleton } from "@/components/LoadingSkeletons";

type Customer = {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    ordersCount: number;
    status: "NEW" | "VIP" | "RETURNING";
    lastActive: string | Date;
};

export default function CustomersPage() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    const { data: customers = [], isLoading: loading, isError } = useQuery({
        queryKey: ['customers', debouncedSearch],
        queryFn: async () => {
            const res = await fetch(`/api/customers?query=${debouncedSearch}`);
            const json = await res.json();
            if (!json.success) throw new Error("Failed to fetch");
            return json.data as Customer[];
        },
    });

    useEffect(() => {
        if (isError) toast.error("Failed to load customers");
    }, [isError]);

    if (loading) {
        return (
            <div className="p-8 max-w-7xl mx-auto space-y-6">
                <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-64" />
                </div>
                <TableSkeleton rows={8} columns={6} />
            </div>
        );
    }

    if (!loading && customers.length === 0) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-gray-900">Customers</h1>
                <EmptyState
                    title="No customers found"
                    icon="Users"
                    description="Customers who place orders will appear here automatically."
                    action={<Button variant="outline" onClick={() => setSearch("")}>Clear Search</Button>}
                />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Customers 👥</h1>
                <div className="relative w-64">
                    <input
                        className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black focus:outline-none transition-all"
                        placeholder="Search name, phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        aria-label="Search customers"
                    />
                    <Icon name="Search" size={14} className="absolute left-2.5 top-3 text-gray-400" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">Orders</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Last Active</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {customers.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50 group">
                                <td className="px-6 py-4 font-bold text-gray-900">
                                    {c.firstName || "Unknown"} {c.lastName || ""}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    <div className="flex flex-col text-xs">
                                        <span>{c.email}</span>
                                        <span>{c.phone}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono">{c.ordersCount}</td>
                                <td className="px-6 py-4">
                                    <Badge variant={c.status === 'VIP' ? 'default' : c.status === 'NEW' ? 'info' : 'warning'}>
                                        {c.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {formatDate(c.lastActive)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/dashboard/customers/${c.id}`} className="text-blue-600 hover:underline font-medium text-xs">
                                        View Profile
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
