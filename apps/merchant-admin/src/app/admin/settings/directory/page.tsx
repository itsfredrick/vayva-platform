'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon } from '@vayva/ui';

export default function DirectorySettingsPage() {
    const [settings, setSettings] = useState({
        isDirectoryListed: false,
        isMarketplaceListed: false,
        state: 'Lagos',
        city: 'Ikeja',
        pickupAvailable: false
    });

    return (
        <AdminShell title="Directory Settings" breadcrumb="Settings">
            <div className="max-w-3xl mx-auto flex flex-col gap-8">

                <div>
                    <h1 className="text-2xl font-bold text-[#0B1220] mb-2">Store Directory</h1>
                    <p className="text-[#525252]">Control how your store appears in the Vayva directory.</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">

                    {/* Listing Toggles */}
                    <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                        <div>
                            <h3 className="font-medium text-[#0B1220] mb-1">List in Directory</h3>
                            <p className="text-sm text-[#525252]">Make your store discoverable to buyers</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={settings.isDirectoryListed} onChange={(e) => setSettings({ ...settings, isDirectoryListed: e.target.checked })} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-[#0B1220] mb-2">State</label>
                        <select className="w-full px-3 py-2 border border-gray-200 rounded-lg" value={settings.state} onChange={(e) => setSettings({ ...settings, state: e.target.value })}>
                            <option value="Lagos">Lagos</option>
                            <option value="FCT">Abuja (FCT)</option>
                            <option value="Rivers">Rivers</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#0B1220] mb-2">City</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-200 rounded-lg" value={settings.city} onChange={(e) => setSettings({ ...settings, city: e.target.value })} />
                    </div>

                    {/* Pickup */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                        <div>
                            <h3 className="font-medium text-[#0B1220] mb-1">Pickup Available</h3>
                            <p className="text-sm text-[#525252]">Allow customers to pick up orders</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={settings.pickupAvailable} onChange={(e) => setSettings({ ...settings, pickupAvailable: e.target.checked })} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                    </div>

                </div>

                <Button>Save Changes</Button>

            </div>
        </AdminShell>
    );
}
