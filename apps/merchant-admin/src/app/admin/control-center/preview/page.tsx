'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Icon, Button } from '@vayva/ui';
import { Spinner } from '@/components/Spinner';
import Link from 'next/link';

function PreviewContent() {
    const searchParams = useSearchParams();
    const templateId = searchParams.get('template') || 'current';

    return (
        <div className="flex min-h-screen flex-col bg-white text-black">
            {/* Mock Storefront Header */}
            <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-50">
                <div className="font-bold text-xl tracking-tight">MY STORE</div>
                <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
                    <a href="#" className="hover:text-black">Home</a>
                    <a href="#" className="hover:text-black">Shop</a>
                    <a href="#" className="hover:text-black">About</a>
                    <a href="#" className="hover:text-black">Contact</a>
                </nav>
                <div className="flex gap-4">
                    <Icon name="Search" size={20} className="text-gray-400" />
                    <Icon name="ShoppingBag" size={20} className="text-gray-400" />
                </div>
            </header>

            {/* Preview Banner */}
            <div className="bg-black text-white text-xs py-2 text-center font-medium">
                PREVIEW MODE • {templateId === 'current' ? 'Live Settings' : `Template: ${templateId}`}
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-12 bg-gray-50">
                <div className="max-w-md text-center space-y-6">
                    <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center text-gray-400 mb-8">
                        <Icon name="Image" size={32} />
                    </div>

                    <h1 className="text-4xl font-light text-gray-900">Theme Assets Pending Merge</h1>
                    <p className="text-gray-500">
                        The <strong>Vayva Storefront</strong> template is currently being integrated.
                        Once the assets are merged, this preview will show the actual storefront with your data.
                    </p>

                    <div className="pt-8 border-t border-gray-200 w-full">
                        <div className="h-4 w-3/4 bg-gray-200 rounded mx-auto mb-3"></div>
                        <div className="h-4 w-1/2 bg-gray-200 rounded mx-auto"></div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12 text-center text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} My Awesome Store. Powered by Vayva.
            </footer>

            {/* Close Button UI override */}
            <div className="fixed bottom-6 right-6 z-50">
                <Link href="/admin/control-center/templates">
                    <Button variant="primary" className="shadow-xl">
                        Back to Editor
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default function PreviewPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Spinner /></div>}>
            <PreviewContent />
        </Suspense>
    );
}
