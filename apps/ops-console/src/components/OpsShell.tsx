'use client';

import React from 'react';
import { OpsSidebar } from './OpsSidebar';
import { Search, Bell } from 'lucide-react';

export function OpsShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50 pl-64">
            <OpsSidebar />

            {/* Header */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
                <div className="w-96 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search merchants, orders, disputes..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-black relative">
                        <Bell size={18} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                        AD
                    </div>
                </div>
            </header>

            <main className="p-8 pb-20">
                {children}
            </main>
        </div>
    );
}
