
import React from "react";

export default function OpsLoading() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <div className="h-8 w-48 bg-gray-200 rounded-lg"></div>
                <div className="h-4 w-96 bg-gray-100 rounded-lg"></div>
            </div>

            {/* KPI Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-gray-100 rounded-2xl border border-gray-200"></div>
                ))}
            </div>

            {/* Content Area Skeleton */}
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 h-96 bg-gray-100 rounded-2xl border border-gray-200"></div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-gray-100 rounded-xl border border-gray-200"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
