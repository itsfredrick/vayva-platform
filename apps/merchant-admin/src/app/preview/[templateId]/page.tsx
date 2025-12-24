
'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { getTemplateComponent } from '@/components/templates/registry';
import { StoreProvider } from '@/context/StoreContext';

// Mock business context for preview
const PREVIEW_CONTEXT = {
    businessName: "Mimi's Fashion Hub",
    demoMode: true
};

export default function TemplatePreviewPage({ params }: { params: Promise<{ templateId: string }> }) {
    const { templateId } = React.use(params);
    const TemplateComponent = getTemplateComponent(templateId);

    if (!TemplateComponent) {
        return notFound();
    }

    // Wrap the preview in StoreProvider to enable the Connection Layer
    return (
        <StoreProvider demoMode={PREVIEW_CONTEXT.demoMode}>
            <TemplateComponent
                businessName={PREVIEW_CONTEXT.businessName}
                demoMode={PREVIEW_CONTEXT.demoMode}
            />
        </StoreProvider>
    );
}
