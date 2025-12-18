'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@vayva/ui';

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<any[]>([]);
    const [current, setCurrent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Modal
    const [previewTemplate, setPreviewTemplate] = useState<any>(null);
    const [applying, setApplying] = useState(false);

    const loadData = async () => {
        setLoading(true);
        // Parallel Fetch
        const [tplRes, currRes] = await Promise.all([
            fetch('/api/merchant/templates'),
            fetch('/api/merchant/templates/current')
        ]);

        const tplData = await tplRes.json();
        const currData = await currRes.json();

        setTemplates(tplData.templates || []);
        setCurrent(currData.selection);
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const handleApply = async (tId: string) => {
        if (!confirm('Apply this template? Your content will remain safe.')) return;
        setApplying(true);
        try {
            const res = await fetch('/api/merchant/templates/apply', {
                method: 'POST',
                body: JSON.stringify({ templateId: tId })
            });
            if (res.ok) {
                alert('Template Applied!');
                setPreviewTemplate(null);
                loadData();
            } else {
                alert('Failed to apply');
            }
        } finally {
            setApplying(false);
        }
    };

    // Dev Tool: Trigger Sync
    const handleSync = async () => {
        // This is admin endpoint but let's try calling it for demo setup
        // In real app, this button wouldn't exist here.
        await fetch('/api/admin/templates/sync', { method: 'POST' });
        loadData();
    };

    if (loading) return <div className="p-8">Loading Gallery...</div>;

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Template Gallery</h1>
                <button onClick={handleSync} className="text-xs text-gray-400 hover:text-gray-600">
                    ↻ Refresh Registry
                </button>
            </div>

            {/* Current Selection */}
            {current && (
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-xl mb-8 flex items-center justify-between shadow-lg">
                    <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Active Theme</div>
                        <div className="text-2xl font-bold">{current.template.name}</div>
                        <div className="text-sm text-gray-400">Version {current.version}</div>
                    </div>
                </div>
            )}

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map(t => (
                    <div key={t.id} className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
                        <div className="h-40 bg-gray-100 relative">
                            <img src={t.previewImageUrl} className="w-full h-full object-cover" alt={t.name} />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <button
                                    onClick={() => setPreviewTemplate(t)}
                                    className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm transform translate-y-2 group-hover:translate-y-0 transition-transform"
                                >
                                    Preview & Apply
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold">{t.name}</h3>
                                {t.id === current?.templateId && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">Active</span>}
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2">{t.description}</p>
                            <div className="mt-4 flex gap-2">
                                {t.tags.map((tag: string) => (
                                    <span key={tag} className="text-[10px] bg-gray-50 border px-2 py-1 rounded text-gray-600 uppercase tracking-wide">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Preview Modal */}
            {previewTemplate && (
                <div className="fixed inset-0 bg-black/80 z-50 flex flex-col animate-in fade-in duration-200">
                    <div className="bg-white p-4 flex justify-between items-center shadow-md">
                        <div>
                            <h2 className="font-bold text-lg">{previewTemplate.name}</h2>
                            <p className="text-xs text-gray-500">Preview Mode</p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setPreviewTemplate(null)} className="text-sm font-bold text-gray-600">Close Preview</button>
                            <button
                                onClick={() => handleApply(previewTemplate.id)}
                                disabled={applying}
                                className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800"
                            >
                                {applying ? 'Applying...' : 'Apply Theme'}
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 bg-gray-100 p-8 overflow-auto flex justify-center">
                        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-lg overflow-hidden flex flex-col">
                            {/* Mock Preview Content - In real app, this would be an iframe to /templates/preview */}
                            <div className="h-full flex items-center justify-center bg-gray-50 text-gray-400">
                                <div className="text-center">
                                    <Icon name="Layout" size={48} className="mx-auto mb-4 opacity-50" />
                                    <h3 className="font-bold text-xl text-gray-900">Live Preview</h3>
                                    <p>Store content rendered with {previewTemplate.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
