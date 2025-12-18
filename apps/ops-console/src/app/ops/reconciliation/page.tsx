import React from 'react';
import { Download, Calendar } from 'lucide-react';

export default function ReconciliationPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Payments Reconciliation</h1>
                    <p className="text-sm text-muted-foreground mt-1">Audit daily transaction flows and settlement discrepancies.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white hover:bg-gray-50 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        Today: Dec 17, 2025
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <div className="glass-card p-4">
                    <div className="text-sm text-muted-foreground">Total Processed</div>
                    <div className="text-2xl font-bold mt-1">₦45.2M</div>
                    <div className="text-xs text-green-600 mt-1">+12% vs yesterday</div>
                </div>
                <div className="glass-card p-4">
                    <div className="text-sm text-muted-foreground">Pending Settlement</div>
                    <div className="text-2xl font-bold mt-1">₦12.8M</div>
                    <div className="text-xs text-muted-foreground mt-1">Clears tomorrow</div>
                </div>
                <div className="glass-card p-4">
                    <div className="text-sm text-muted-foreground">Failed Transactions</div>
                    <div className="text-2xl font-bold mt-1 text-red-600">₦450k</div>
                    <div className="text-xs text-red-600 mt-1">24 incidents</div>
                </div>
                <div className="glass-card p-4">
                    <div className="text-sm text-muted-foreground">Discrepancies</div>
                    <div className="text-2xl font-bold mt-1 text-orange-600">₦12k</div>
                    <div className="text-xs text-orange-600 mt-1">Action required</div>
                </div>
            </div>

            {/* Placeholder Chart/Table Area */}
            <div className="glass-card p-8 text-center text-muted-foreground border-dashed border-2 bg-gray-50/50">
                <p>Reconciliation timeline module is loading...</p>
                <p className="text-xs mt-2">(Data integration pending)</p>
            </div>
        </div>
    );
}
