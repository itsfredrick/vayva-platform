'use client';

import React from 'react';
import { AdminShell } from '@/components/admin-shell';

export default function ControlCenterLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminShell title="Control Center" breadcrumb="Storefront">
            {children}
        </AdminShell>
    );
}
