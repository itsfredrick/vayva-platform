'use client';

import React from 'react';
import { OpsShell } from '@/components/OpsShell';

export default function ModerationPage() {
    return (
        <OpsShell>
            <h1 className="text-2xl font-bold mb-6">Content Moderation</h1>
            <div className="text-center py-20 bg-white border border-gray-200 rounded-xl">
                <p className="text-gray-500">No content flagged for moderation.</p>
            </div>
        </OpsShell>
    );
}
