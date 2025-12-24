'use client';

import React, { Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { RetailOverview as DashboardOverview } from '@/components/dashboard/overview/RetailOverview';

function DashboardContent() {
    const { isLoading } = useAuth();

    if (isLoading) {
        return <div className="p-12 text-center text-gray-400 font-medium">Loading your workspace...</div>;
    }

    return <DashboardOverview />;
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-gray-400 font-medium">Initializing...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
