'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function StoreLivePage() {
    const [store, setStore] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetch('/api/merchant/store')
            .then(r => r.json())
            .then(data => setStore(data.store));
    }, []);

    const storeUrl = store ? `https://vayva.ng/${store.slug}` : '';

    function copyToClipboard() {
        navigator.clipboard.writeText(storeUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function shareOnWhatsApp() {
        const message = `Hi 👋 I'm now taking orders online. Browse and checkout here: ${storeUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-12 text-center">
                {/* Celebration */}
                <div className="text-6xl mb-6">🎉</div>

                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                    Your store is live!
                </h1>

                <p className="text-lg text-slate-600 mb-8">
                    Your storefront is ready to accept orders
                </p>

                {/* Store URL */}
                <div className="bg-slate-100 rounded-lg p-4 mb-8">
                    <p className="text-sm text-slate-600 mb-2">Your store URL:</p>
                    <p className="text-lg font-mono text-slate-900 mb-3">
                        {storeUrl || 'Loading...'}
                    </p>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyToClipboard}
                        disabled={!storeUrl}
                    >
                        {copied ? 'Copied!' : 'Copy Link'}
                    </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                    <Button
                        size="lg"
                        onClick={() => window.open(`/${store?.slug}`, '_blank')}
                        disabled={!store}
                    >
                        Open my store
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={shareOnWhatsApp}
                        disabled={!store}
                    >
                        Share on WhatsApp
                    </Button>
                    <Button
                        size="lg"
                        variant="ghost"
                        asChild
                    >
                        <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                </div>

                {/* Next Steps */}
                <div className="grid md:grid-cols-3 gap-4 text-left">
                    <div className="bg-white/50 rounded-lg p-4">
                        <h3 className="font-semibold text-slate-900 mb-2">Add more products</h3>
                        <p className="text-sm text-slate-600">Build your catalog</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-4">
                        <h3 className="font-semibold text-slate-900 mb-2">Switch templates</h3>
                        <p className="text-sm text-slate-600">Customize your look</p>
                    </div>
                    <div className="bg-white/50 rounded-lg p-4">
                        <h3 className="font-semibold text-slate-900 mb-2">Connect WhatsApp inbox</h3>
                        <p className="text-sm text-slate-600">Chat with customers</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
