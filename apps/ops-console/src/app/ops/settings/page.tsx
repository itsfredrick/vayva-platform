'use client';

import React from 'react';
import { OpsShell } from '@/components/OpsShell';

export default function SettingsPage() {
    return (
        <OpsShell>
            <h1 className="text-2xl font-bold mb-6">Global Settings</h1>
            <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-2xl">
                <h3 className="font-bold mb-4">Platform Configuration</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Risk Threshold (Low to Medium)</label>
                        <input type="number" className="w-full border border-gray-300 rounded-md px-3 py-2" defaultValue={50} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Auto-Suspend Threshold</label>
                        <input type="number" className="w-full border border-gray-300 rounded-md px-3 py-2" defaultValue={90} />
                    </div>
                    <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold">Save Changes</button>
                </div>
            </div>
        </OpsShell>
    );
}
