'use client';

import React from 'react';
import { Icon } from '@vayva/ui';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                        V
                    </div>
                    <span className="font-mono text-sm font-bold text-gray-500 uppercase tracking-wider">Mission Control</span>
                </div>

                <nav className="flex items-center gap-6 text-sm font-medium">
                    <a href="/admin" className="text-gray-900 hover:text-black">Overview</a>
                    <a href="/admin/merchants" className="text-gray-500 hover:text-black">Merchants</a>
                    <a href="/admin/webhooks" className="text-gray-500 hover:text-black">Webhooks</a>
                    <a href="/admin/audit" className="text-gray-500 hover:text-black">Audit</a>
                </nav>

                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-bold text-gray-500">SYSTEM NORMAL</span>
                </div>
            </header>
            <main className="flex-1 max-w-7xl w-full mx-auto p-6">
                {children}
            </main>
        </div>
    );
}
