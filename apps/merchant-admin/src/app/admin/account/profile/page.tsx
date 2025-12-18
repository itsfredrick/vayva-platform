'use client';

import React, { useEffect, useState } from 'react';
import { GlassPanel, Button, Input } from '@vayva/ui';
import { AccountService } from '@/services/account.service';
import { MerchantProfile } from '@/types/account';
import { Spinner } from '@/components/Spinner';

export default function ProfilePage() {
    const [profile, setProfile] = useState<MerchantProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const load = async () => {
            const data = await AccountService.getProfile();
            setProfile(data);
            setLoading(false);
        };
        load();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;
        setSaving(true);
        try {
            await AccountService.updateProfile(profile);
            // In real app, show toast
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading || !profile) return <div className="text-text-secondary"><Spinner size="sm" /> Loading profile...</div>;

    return (
        <div className="max-w-2xl">
            <GlassPanel className="p-8">
                <h2 className="text-xl font-bold text-white mb-6">Personal Profile</h2>

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">First Name</label>
                            <Input
                                value={profile.firstName}
                                onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Last Name</label>
                            <Input
                                value={profile.lastName}
                                onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Email Address</label>
                        <Input
                            value={profile.email}
                            disabled
                            className="opacity-50 cursor-not-allowed"
                        />
                        <p className="text-xs text-text-secondary">Email cannot be changed contact support.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Phone Number</label>
                        <Input
                            value={profile.phone}
                            onChange={e => setProfile({ ...profile, phone: e.target.value })}
                            required
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button type="submit" variant="primary" disabled={saving}>
                            {saving ? <Spinner size="sm" className="mr-2" /> : null}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </GlassPanel>
        </div>
    );
}
