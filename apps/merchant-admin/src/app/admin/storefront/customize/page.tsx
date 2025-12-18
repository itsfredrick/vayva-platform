'use client';

import React, { useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Button, Icon } from '@vayva/ui';
import { api } from '@/services/api';

export default function ThemeCustomizerPage() {
    const [settings, setSettings] = useState({
        brandName: 'My Store',
        accentColor: '#22C55E',
        logoS3Key: null,
        whatsappNumberE164: null
    });

    const handleSave = async () => {
        try {
            await api.put('/themes/theme/settings', settings);
            alert('Settings saved!');
        } catch (err) {
            console.error(err);
        }
    };

    const handlePublish = async () => {
        try {
            await api.post('/themes/theme/publish');
            alert('Theme published!');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AdminShell title="Customize" breadcrumb="Storefront">
            <div className="flex gap-8">

                {/* Settings Panel */}
                <div className="w-96 flex-shrink-0 space-y-6">

                    <div>
                        <h2 className="text-xl font-bold text-[#0B1220] mb-4">Branding</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#0B1220] mb-1">Brand Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                    value={settings.brandName}
                                    onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#0B1220] mb-1">Accent Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        className="w-12 h-10 border border-gray-200 rounded-lg"
                                        value={settings.accentColor}
                                        onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                                        value={settings.accentColor}
                                        onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#0B1220] mb-1">Logo</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                                    <Icon name="Upload" size={32} className="mx-auto text-gray-300 mb-2" />
                                    <p className="text-sm text-[#525252]">Upload logo</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={handleSave}>Save Draft</Button>
                        <Button className="flex-1" onClick={handlePublish}>Publish</Button>
                    </div>

                </div>

                {/* Preview Pane */}
                <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 p-8">
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <h3 className="text-2xl font-bold mb-4" style={{ color: settings.accentColor }}>
                            {settings.brandName}
                        </h3>
                        <p className="text-gray-500 mb-6">Live preview of your storefront</p>
                        <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="aspect-square bg-gray-100 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </AdminShell>
    );
}
