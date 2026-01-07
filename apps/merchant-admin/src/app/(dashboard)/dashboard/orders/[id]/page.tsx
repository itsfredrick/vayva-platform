"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Badge, Card, Avatar } from "@vayva/ui";
import { Icon } from "@vayva/ui";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/orders/${params.id}`);
                if (!res.ok) throw new Error("Order not found");
                const json = await res.json();
                setOrder(json);
            } catch (error) {
                toast.error("Failed to load order");
                router.push("/dashboard/orders");
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchOrder();
    }, [params.id, router]);

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
    if (!order) return null;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
                        <Badge variant={order.displayStatus === "PAID" ? "success" : "default"}>
                            {order.displayStatus}
                        </Badge>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Placed on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                </div>
                <Button variant="outline" onClick={() => window.print()}>
                    <Icon name="Printer" className="mr-2" size={16} /> Print
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <Card className="overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-100 font-medium text-sm">Order Items</div>
                        <div className="divide-y divide-gray-100">
                            {order.items?.map((item: any) => (
                                <div key={item.id} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                            <Icon name="Package" size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{item.productName || "Product"}</p>
                                            <p className="text-sm text-gray-500">{item.quantity} x {order.currency} {Number(item.price).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-gray-900">
                                        {order.currency} {(item.quantity * Number(item.price)).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-gray-50/50 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="text-gray-900">{order.currency} {Number(order.total).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Shipping</span>
                                <span className="text-gray-900">{order.currency} 0.00</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t border-gray-100 pt-2 mt-2">
                                <span>Total</span>
                                <span>{order.currency} {Number(order.total).toLocaleString()}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Timeline/Activity (Placeholder) */}
                    <Card className="p-6">
                        <h3 className="font-bold mb-4">Timeline</h3>
                        <div className="relative border-l border-gray-200 ml-2 space-y-6 pl-6 pb-2">
                            <div className="relative">
                                <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-green-500 border border-white ring-2 ring-gray-100" />
                                <p className="text-sm font-medium">Order Placed</p>
                                <p className="text-xs text-gray-500">{format(new Date(order.createdAt), "MMM d, h:mm a")}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer */}
                    <Card className="p-6">
                        <h3 className="font-bold mb-4">Customer</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <Avatar fallback={order.customer?.firstName?.[0] || "?"} />
                            <div>
                                <p className="font-medium text-sm text-gray-900">
                                    {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "Guest"}
                                </p>
                                <p className="text-sm text-gray-500">{order.customer?.email}</p>
                            </div>
                        </div>
                        <div className="border-t border-gray-100 pt-4 mt-4">
                            <h4 className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-2">Shipping Address</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {order.shippingAddress || "No address provided"}
                            </p>
                        </div>
                    </Card>

                    {/* Payment */}
                    <Card className="p-6">
                        <h3 className="font-bold mb-4">Payment</h3>
                        <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-gray-500">Gateway</span>
                            <span className="font-medium">Paystack</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Status</span>
                            <Badge variant={order.paymentStatus === "PAID" ? "success" : "default"}>{order.paymentStatus}</Badge>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
