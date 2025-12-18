'use client';

import React, { useState, useEffect } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon, cn } from '@vayva/ui';
import { api } from '@/services/api';
import { motion } from 'framer-motion';

export default function TeamPage() {
    const [members, setMembers] = useState<any[]>([]);
    const [invites, setInvites] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);

    const fetchTeam = async () => {
        try {
            const res = await api.get('/rbac/team'); 
            if (res.data) {
                setMembers(res.data.members || []);
                setInvites(res.data.invites || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        // Simplified Logic
        const form = e.target as HTMLFormElement;
        const email = (form.elements.namedItem('email') as HTMLInputElement).value;
        
        try {
            await api.post('/rbac/team/invite', { email });
            setShowInviteModal(false);
            fetchTeam();
        } catch (err) {
            alert('Failed to invite');
        }
    };

    return (
        <AdminShell title="Team Management" breadcrumb="Settings">
            <div className="max-w-5xl mx-auto flex flex-col gap-8">
                
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0B0B0B]">Team Members</h1>
                        <p className="text-[#525252]">Manage staff access and roles.</p>
                    </div>
                    <Button onClick={() => setShowInviteModal(true)}><Icon name="Plus" size={16} className="mr-2" /> Invite Staff</Button>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-12 text-center text-gray-400">Loading...</td></tr>
                            ) : (
                                <>
                                    {members.map(m => (
                                        <tr key={m.id}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                        {m.user.firstName?.[0] || m.user.email[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-[#0B0B0B]">{m.user.firstName} {m.user.lastName}</div>
                                                        <div className="text-xs text-[#525252]">{m.user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                                                    {m.roleEnum || m.roleRel?.name || 'Staff'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4"><span className="text-green-600 text-xs font-bold uppercase">Active</span></td>
                                            <td className="px-6 py-4 text-[#525252]">{new Date(m.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="sm">Edit</Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {invites.map(i => (
                                        <tr key={i.id} className="bg-gray-50/50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3 opacity-60">
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs text-gray-500">
                                                        @
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-[#0B0B0B]">Invited User</div>
                                                        <div className="text-xs text-[#525252]">{i.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 opacity-60">
                                                 <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                                                    {i.role || 'Staff'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4"><span className="text-orange-600 text-xs font-bold uppercase">Pending</span></td>
                                            <td className="px-6 py-4 text-[#525252] opacity-60">{new Date(i.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="sm" className="text-red-500">Revoke</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Invite Modal (Simple) */}
                {showInviteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
                            <h3 className="text-lg font-bold mb-4">Invite Staff</h3>
                            <form onSubmit={handleInvite} className="flex flex-col gap-4">
                                <div>
                                    <label className="text-xs font-bold uppercase text-gray-500">Email Address</label>
                                    <input name="email" type="email" required className="w-full mt-1 p-2 border rounded-lg" placeholder="colleague@example.com" />
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button type="button" variant="ghost" onClick={() => setShowInviteModal(false)}>Cancel</Button>
                                    <Button type="submit">Send Invite</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </AdminShell>
    );
}
