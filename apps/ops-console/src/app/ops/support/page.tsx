import React from 'react';
import { Mail, MessageSquare } from 'lucide-react';

export default function SupportPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">Support Inbox</h1>
                    <p className="text-sm text-muted-foreground mt-1">Merchant inquiries and help requests.</p>
                </div>
            </div>

            <div className="glass-card p-12 text-center space-y-4">
                <div className="bg-primary/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-primary">
                    <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold">Inbox Module Loading...</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    The support ticket integration is being connected to the external helpdesk provider.
                    Direct messaging functionality will be available in v1.1.
                </p>
                <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80">
                    Open External Helpdesk
                </button>
            </div>
        </div>
    );
}
