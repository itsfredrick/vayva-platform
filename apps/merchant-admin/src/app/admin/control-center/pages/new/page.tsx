'use client';

import React, { useState } from 'react';
import { GlassPanel, Button, Icon, Input } from '@vayva/ui';
import { Spinner } from '@/components/Spinner';
import { ControlCenterService } from '@/services/control-center.service';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewPageEditor() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!title) return;
        setIsSaving(true);
        try {
            await ControlCenterService.createPage({
                title,
                slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                content,
                isPublished: true,
            });
            router.push('/admin/control-center/pages');
        } catch (e) {
            console.error(e);
            setIsSaving(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl p-6 h-[calc(100vh-64px)] flex flex-col">
            <div className="mb-6 flex items-center justify-between">
                <Link href="/admin/control-center/pages" className="flex items-center text-sm text-text-secondary hover:text-white">
                    <Icon name="ArrowLeft" size={16} className="mr-2" />
                    Back
                </Link>
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave} disabled={isSaving || !title}>
                        {isSaving ? <Spinner size="sm" /> : 'Save Page'}
                    </Button>
                </div>
            </div>

            <GlassPanel className="flex-1 flex flex-col p-8 gap-6">
                <div>
                    <label className="text-xs font-medium text-text-secondary uppercase mb-2 block">Page Title</label>
                    <Input
                        placeholder="e.g. About Us"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-2xl font-bold bg-transparent border-none placeholder:text-white/20 p-0 h-auto focus:ring-0"
                    />
                </div>

                <div className="flex-1">
                    <label className="text-xs font-medium text-text-secondary uppercase mb-2 block">Content</label>
                    <textarea
                        className="w-full h-full bg-transparent border-none resize-none text-white focus:ring-0 placeholder:text-white/20 p-0"
                        placeholder="Start typing your page content..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
            </GlassPanel>
        </div>
    );
}
