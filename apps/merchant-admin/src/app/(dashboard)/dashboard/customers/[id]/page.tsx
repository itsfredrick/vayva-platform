"use client";

import { useEffect, useState } from "react";
import { Icon, Button, Badge } from "@vayva/ui"; // Assume ScrollArea exists or fallback to div
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CustomerProfile({ params }: { params: { id: string } }) {
    const [customer, setCustomer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'messages'>('overview');
    const router = useRouter();

    useEffect(() => {
        fetchCustomer();
    }, []);

    const fetchCustomer = async () => {
        try {
            const res = await fetch(`/api/customers/${params.id}`);
            if (!res.ok) throw new Error("Customer not found");
            const data = await res.json();
            setCustomer(data.data);
        } catch (error) {
            toast.error("Failed to load customer profile");
            router.push('/dashboard/customers');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Profile...</div>;
    if (!customer) return null;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <div className="flex items-start justify-between">
                <div className="flex gap-4">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-2xl font-bold text-blue-600 border border-blue-200">
                        {customer.firstName?.[0]}{customer.lastName?.[0]}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{customer.firstName} {customer.lastName}</h1>
                        <div className="flex gap-4 text-sm text-gray-500 mt-1">
                            {customer.email && <span className="flex items-center gap-1"><Icon name="Mail" size={14} /> {customer.email}</span>}
                            {customer.phone && <span className="flex items-center gap-1"><Icon name="Phone" size={14} /> {customer.phone}</span>}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Icon name="Edit2" size={14} className="mr-2" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm">Block</Button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total Spent (LTV)</div>
                    <div className="text-2xl font-bold text-gray-900">₦{Number(customer.totalSpent).toLocaleString()}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total Orders</div>
                    <div className="text-2xl font-bold text-gray-900">{customer.totalOrders}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Avg. Order Value</div>
                    <div className="text-2xl font-bold text-gray-900">₦{Math.round(customer.averageOrderValue).toLocaleString()}</div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[400px]">
                <div className="flex border-b border-gray-100">
                    {['overview', 'orders', 'messages'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {activeTab === 'overview' && (
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-900">Notes</h3>
                            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                {customer.notes || "No notes added for this customer."}
                            </p>

                            <div className="flex gap-2 mt-4">
                                {customer.tags.map((tag: string) => (
                                    <Badge key={tag} variant="info" className="bg-gray-100 text-gray-700">{tag}</Badge>
                                ))}
                            </div>
                            <div className="mt-8">
                                <h3 className="font-bold text-gray-900 mb-2">Addresses</h3>
                                {customer.addresses?.map((addr: any) => (
                                    <div key={addr.id} className="text-sm text-gray-600 mb-2">
                                        {addr.isDefault && <Badge variant="default" className="mr-2">Default</Badge>}
                                        {addr.addressLine1}, {addr.city}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="space-y-3">
                            {customer.orders?.length === 0 ? (
                                <div className="text-gray-500 text-center py-10">No orders yet</div>
                            ) : customer.orders?.map((order: any) => (
                                <div key={order.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/dashboard/orders/${order.id}`)}>
                                    <div>
                                        <div className="font-bold text-gray-900">#{order.orderNumber}</div>
                                        <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 0} Items</div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono font-bold">₦{Number(order.total).toLocaleString()}</p>
                                        <Badge variant="warning" className="text-[10px] mt-1">{order.status}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'messages' && (
                        <div className="space-y-4">
                            {customer.conversations?.length === 0 ? (
                                <div className="text-gray-500 text-center py-10">No message history available.</div>
                            ) : (
                                customer.conversations?.map((conv: any) => (
                                    <div key={conv.id} className="flex gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50">
                                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            <Icon name="MessageSquare" size={14} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-gray-900">{conv.platform}</span>
                                                <span className="text-xs text-gray-400">{new Date(conv.date).toLocaleString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {conv.lastMessage}
                                            </p>
                                        </div>
                                        <Button size="sm" variant="outline">Open Chat</Button>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
