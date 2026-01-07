"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

interface OrderNotificationContextType {
    lastOrderId: string | null;
}

const OrderNotificationContext = createContext<OrderNotificationContextType>({
    lastOrderId: null,
});

export function useOrderNotifications() {
    return useContext(OrderNotificationContext);
}

export function OrderNotificationProvider({ children }: { children: React.ReactNode }) {
    const [lastOrderId, setLastOrderId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const pathname = usePathname();

    // Only run on dashboard pages
    const isDashboard = pathname?.startsWith("/dashboard");

    useEffect(() => {
        // Initialize audio
        audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
        // "Ding" sound URL (publicly available placeholder)
    }, []);

    useEffect(() => {
        if (!isDashboard) return;

        const checkOrders = async () => {
            try {
                // We need an endpoint that is lightweight. 
                // Assuming GET /api/store/orders?limit=1 exists or we use a dedicated check
                // For now, let's assume we can fetch the latest order.
                // NOTE: If this endpoint doesn't exist, we need to create it.
                // I will assume /api/store/orders exists from previous context, but will verify.
                const res = await fetch("/api/store/orders?limit=1");
                if (!res.ok) return;

                const data = await res.json();
                const latestOrder = data.orders?.[0]; // Assuming standard paginated response

                if (latestOrder) {
                    if (lastOrderId && latestOrder.id !== lastOrderId) {
                        // NEW ORDER!
                        toast.success(`New Order Received! #${latestOrder.orderNumber || latestOrder.id.slice(0, 8)}`, {
                            duration: 5000,
                            action: {
                                label: "View",
                                onClick: () => window.location.href = `/dashboard/orders/${latestOrder.id}`
                            }
                        });

                        // Play sound
                        if (audioRef.current) {
                            audioRef.current.play().catch(e => console.log("Audio play failed", e));
                        }
                    }
                    setLastOrderId(latestOrder.id);
                }
            } catch (error) {
                // Silent fail on polling error
            }
        };

        // Initial check
        checkOrders();

        // Poll every 30 seconds
        const interval = setInterval(checkOrders, 30000);

        return () => clearInterval(interval);
    }, [isDashboard, lastOrderId]);

    return (
        <OrderNotificationContext.Provider value={{ lastOrderId }}>
            {children}
        </OrderNotificationContext.Provider>
    );
}
