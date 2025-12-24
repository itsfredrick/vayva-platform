'use client';

import React, { useState } from 'react';
import { Palette, Upload, Loader2 } from 'lucide-react';

export default function BrandingPage() {
    const [logoUrl, setLogoUrl] = useState('');
    const [primaryColor, setPrimaryColor] = useState('#22C55E');
    const [accentColor, setAccentColor] = useState('#16A34A');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        // TODO: Implement save logic
        setTimeout(() => setSaving(false), 1000);
    };

    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Branding</h1>
                <p className="text-gray-600 mt-1">
                    Customize your store's appearance
                </p>
            </div>

            {/* Logo Upload */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Logo</h3>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors cursor-pointer">
                    {logoUrl ? (
                        <img src={logoUrl} alt="Store logo" className="max-h-32 mx-auto mb-4" />
                    ) : (
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    )}
                    <p className="text-gray-700 font-medium mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 2MB</p>
                </div>
            </div>

            {/* Brand Colors */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-50 rounded-lg">
                        <Palette className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Brand Colors</h3>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Primary Color
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="color"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Accent Color
                        </label>
                        <div className="flex items-center gap-4">
                            <input
                                type="color"
                                value={accentColor}
                                onChange={(e) => setAccentColor(e.target.value)}
                                className="h-12 w-20 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={accentColor}
                                onChange={(e) => setAccentColor(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Preview */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>

                <div className="border border-gray-200 rounded-lg p-6" style={{ backgroundColor: `${primaryColor}10` }}>
                    <div className="flex items-center gap-4 mb-4">
                        {logoUrl && <img src={logoUrl} alt="Logo" className="h-12" />}
                        <h4 className="text-xl font-bold" style={{ color: primaryColor }}>
                            Your Store Name
                        </h4>
                    </div>
                    <button
                        className="px-6 py-2 rounded-lg font-medium text-white"
                        style={{ backgroundColor: primaryColor }}
                    >
                        Shop Now
                    </button>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save Changes'
                    )}
                </button>
            </div>
        </div>
    );
}
