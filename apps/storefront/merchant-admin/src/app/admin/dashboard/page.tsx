'use client';

import { AppShell } from '@vayva/ui';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
    const { logout, user } = useAuth();

    return (
        <AppShell
            title="Overview"
            breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }]}
            profile={{ name: user?.name || 'Merchant', email: user?.email || '' }}
            storeName="Vayva Store"
            onLogout={logout}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                    <h3 className="text-text-secondary text-sm mb-1">Total Sales</h3>
                    <div className="text-2xl font-bold text-white">$0.00</div>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                    <h3 className="text-text-secondary text-sm mb-1">Active Orders</h3>
                    <div className="text-2xl font-bold text-white">0</div>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                    <h3 className="text-text-secondary text-sm mb-1">Store Status</h3>
                    <div className="inline-flex items-center px-2 py-1 rounded bg-yellow-500/20 text-yellow-500 text-sm font-medium">Draft</div>
                </div>
            </div>
        </AppShell>
    );
}
