'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { CustomersService, Customer, CustomerOrderSummary, CustomerNote } from '@/services/customers';
import { CustomerOrdersTable, NotesSection } from '@/components/customers/CustomerComponents';
import { Button, Icon, cn } from '@vayva/ui';

export default function CustomerProfilePage({ params }: { params: { id: string } }) {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [orders, setOrders] = useState<CustomerOrderSummary[]>([]);
    const [notes, setNotes] = useState<CustomerNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'orders' | 'notes'>('orders');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [custData, ordersData, notesData] = await Promise.all([
                    CustomersService.getCustomer(params.id),
                    CustomersService.getCustomerOrders(params.id),
                    CustomersService.getNotes(params.id)
                ]);
                setCustomer(custData);
                setOrders(ordersData);
                setNotes(notesData);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [params.id]);

    const handleAddNote = async (content: string) => {
        const newNote = await CustomersService.addNote(params.id, content);
        setNotes(prev => [newNote, ...prev]);
    };

    if (loading) return <AdminShell title="Loading..."><div className="p-12 text-center text-gray-400">Loading Profile...</div></AdminShell>;
    if (!customer) return <AdminShell title="Not Found"><div className="p-12 text-center text-gray-400">Customer not found.</div></AdminShell>;

    return (
        <AdminShell title={customer.name} breadcrumb="Customers">
            <div className="flex flex-col gap-8 max-w-5xl mx-auto">

                {/* Header Profile Card */}
                <div className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-2xl uppercase">
                            {customer.name.charAt(0)}
                        </div>
                        <div className="flex flex-col gap-1">
                            <h1 className="text-xl font-bold text-[#0B0B0B]">{customer.name}</h1>
                            <div className="flex flex-wrap gap-4 text-sm text-[#525252]">
                                <span className="flex items-center gap-1"><Icon name="Mail" size={14} /> {customer.email}</span>
                                <span className="flex items-center gap-1"><Icon name="Phone" size={14} /> {customer.phone}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" className="flex-1 md:flex-none">Message on WhatsApp</Button>
                        <Button className="flex-1 md:flex-none">Create Order</Button>
                    </div>
                </div>

                {/* Statistics Row */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-xs uppercase tracking-wider text-[#525252] mb-1">Total Spent</p>
                        <p className="text-2xl font-bold text-[#0B0B0B]">₦ {customer.totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-xs uppercase tracking-wider text-[#525252] mb-1">Orders</p>
                        <p className="text-2xl font-bold text-[#0B0B0B]">{customer.ordersCount}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-xs uppercase tracking-wider text-[#525252] mb-1">Last Order</p>
                        <p className="text-lg font-bold text-[#0B0B0B]">{new Date(customer.lastOrderDate).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Tabs & Content */}
                <div className="flex flex-col gap-6">
                    <div className="border-b border-gray-200 flex gap-6">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={cn(
                                "pb-3 text-sm font-bold border-b-2 transition-colors",
                                activeTab === 'orders' ? "border-black text-black" : "border-transparent text-gray-400 hover:text-gray-600"
                            )}
                        >
                            Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('notes')}
                            className={cn(
                                "pb-3 text-sm font-bold border-b-2 transition-colors",
                                activeTab === 'notes' ? "border-black text-black" : "border-transparent text-gray-400 hover:text-gray-600"
                            )}
                        >
                            Notes <span className="ml-1 bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-[10px]">{notes.length}</span>
                        </button>
                    </div>

                    {activeTab === 'orders' && <CustomerOrdersTable orders={orders} />}
                    {activeTab === 'notes' && <NotesSection notes={notes} onAddNote={handleAddNote} />}
                </div>

            </div>
        </AdminShell>
    );
}
