
"use client";

import React, { useState, useEffect } from 'react';
import { Customer, ApiResponse } from '@vayva/shared';
import { Button, Icon, Input } from '@vayva/ui';
import { CustomerSegmentStrip } from '@/components/customers/CustomerSegmentStrip';
import { CustomerList } from '@/components/customers/CustomerList';
import { CustomerDrawer } from '@/components/customers/CustomerDrawer';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [stats, setStats] = useState({
        total: 0,
        new: 0,
        returning: 0,
        vip: 0,
        inactive: 0
    });

    useEffect(() => {
        fetchCustomers();
    }, [activeFilter, searchQuery]);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (activeFilter !== 'all') params.append('filter', activeFilter);
            if (searchQuery) params.append('search', searchQuery);

            const res = await fetch(`/api/customers?${params.toString()}`);
            const json: ApiResponse<Customer[]> = await res.json();

            if (json.data) {
                setCustomers(json.data);
                // In real app, stats would be a separate fast aggregation endpoint
                // Mocking stats for now based on list or just static
                setStats({
                    total: 254, // Mock totals larger than list
                    new: 12,
                    returning: 180,
                    vip: 45,
                    inactive: 17
                });
            }
        } catch (e) {
            console.error("Failed to fetch customers", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-gray-900">Customers</h1>
                    <p className="text-gray-500 text-sm mt-1">See who buys from you and how often they return.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative w-full md:w-64">
                        <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or phone..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="sm" className="hidden sm:flex">
                        <Icon name="Download" size={14} className="mr-2" /> Export
                    </Button>
                </div>
            </div>

            {/* Segment Strip */}
            <CustomerSegmentStrip
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                stats={stats}
            />

            {/* Main List */}
            <CustomerList
                customers={customers}
                isLoading={loading}
                onSelectCustomer={setSelectedCustomer}
            />

            {/* Detail Drawer */}
            <CustomerDrawer
                isOpen={!!selectedCustomer}
                onClose={() => setSelectedCustomer(null)}
                customerId={selectedCustomer?.id || null}
            />

        </div>
    );
}
