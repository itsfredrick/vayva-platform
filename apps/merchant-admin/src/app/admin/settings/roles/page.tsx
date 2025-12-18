'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon, cn } from '@vayva/ui';
import { api } from '@/services/api';

export default function RolesPage() {
    const [roles, setRoles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRoles = async () => {
        try {
            const res = await api.get('/rbac/roles');
            setRoles(res.data || []);
        } catch (err) {
            console.error(err);
            // Fallback mock
            setRoles([
                { id: '1', name: 'Owner', isSystem: true, usersCount: 1, description: 'Full access to everything.' },
                { id: '2', name: 'Staff', isSystem: true, usersCount: 3, description: 'Standard access.' },
                { id: '3', name: 'Dispatch', isSystem: false, usersCount: 1, description: 'Delivery management only.' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    return (
        <AdminShell title="Roles & Permissions" breadcrumb="Settings">
            <div className="max-w-5xl mx-auto flex flex-col gap-8">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0B0B0B]">Roles</h1>
                        <p className="text-[#525252]">Define what your team can see and do.</p>
                    </div>
                    <Button><Icon name="Plus" size={16} className="mr-2" /> Create Role</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map(role => (
                        <div key={role.id} className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col gap-4 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-gray-50 rounded-lg text-gray-600">
                                    <Icon name={role.name === 'Owner' ? 'Shield' : 'Users'} size={24} />
                                </div>
                                {role.isSystem && <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-500 px-2 py-1 rounded">System</span>}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-[#0B0B0B]">{role.name}</h3>
                                <p className="text-sm text-[#525252] mt-1">{role.description}</p>
                            </div>
                            <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-[#525252]">
                                <span>{role.usersCount || 0} members</span>
                                <span className="font-bold text-blue-600">View Permissions →</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </AdminShell>
    );
}
