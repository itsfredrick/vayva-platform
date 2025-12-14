'use client';

import { OpsShell, GlassPanel, Button, Icon } from '@vayva/ui';
import { useRouter } from 'next/navigation';

export default function PlaceholderPage({ title = "Coming Soon" }: { title?: string }) {
    const router = useRouter();

    return (
        <OpsShell
            header={<h1 className="text-xl font-bold">{title}</h1>}
            sidebar={<div className="p-4 text-gray-500">Sidebar</div>}
        >
            <div className="flex items-center justify-center h-[50vh]">
                <GlassPanel className="p-12 text-center max-w-md mx-auto bg-black border border-white/10">
                    <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="construction" className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
                    <p className="text-gray-400 mb-8">Internal tool under construction.</p>
                    <Button onClick={() => router.back()} variant="secondary">
                        Go Back
                    </Button>
                </GlassPanel>
            </div>
        </OpsShell>
    );
}
