"use client";

import { KitchenBoard } from "@/components/kitchen/KitchenBoard";
import { Badge } from "@vayva/ui";
import { Flame } from "lucide-react";

export default function KitchenPage() {
    return (
        <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden">
            {/* Page Header */}
            <div className="px-6 py-4 bg-white border-b flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                        <Flame className="text-orange-600" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Kitchen Display System</h1>
                        <p className="text-sm text-gray-500">Live order management for kitchen staff</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Live Connection
                    </div>
                    <Badge variant="warning" className="text-xs">
                        AUTO-REFRESH: 15s
                    </Badge>
                </div>
            </div>

            {/* Board Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
                <KitchenBoard />
            </div>
        </div>
    );
}
