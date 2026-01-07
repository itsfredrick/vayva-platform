"use client";

import React, { useState, useEffect, useRef } from "react";
import { Icon, Button } from "@vayva/ui";
import { ControlCenterShell } from "@/components/control-center/ControlCenterShell";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MediaAsset {
    id: string;
    url: string;
    name: string;
    type: string;
    size: string;
    updatedAt: string;
}

export default function MediaManagerPage() {
    const [assets, setAssets] = useState<MediaAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchAssets = async () => {
        try {
            const res = await fetch("/api/store/media");
            if (res.ok) {
                const data = await res.json();
                setAssets(data);
            }
        } catch (error) {
            console.error("Failed to fetch assets", error);
            toast.error("Failed to load assets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, []);

    const processUpload = async (file: File) => {
        setUploading(true);
        const toastId = toast.loading(`Uploading ${file.name}...`);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                toast.success("Uploaded successfully", { id: toastId });
                fetchAssets();
            } else {
                toast.error("Upload failed", { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error("Error uploading file", { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processUpload(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processUpload(e.dataTransfer.files[0]);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this asset?")) return;

        const toastId = toast.loading("Deleting asset...");
        try {
            const res = await fetch(`/api/store/media/${id}`, { method: "DELETE" });
            if (res.ok) {
                setAssets(prev => prev.filter(a => a.id !== id));
                toast.success("Asset deleted", { id: toastId });
            } else {
                toast.error("Failed to delete", { id: toastId });
            }
        } catch (error) {
            toast.error("Error deleting asset", { id: toastId });
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        toast.success("Copied to clipboard");
    };

    return (
        <ControlCenterShell>
            <div
                className={cn(
                    "p-8 space-y-8 flex flex-col h-full transition-colors",
                    isDragging ? "bg-indigo-50/50" : ""
                )}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 font-heading">
                            Media Library
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">
                            Manage images, files, and brand assets for your store.
                        </p>
                    </div>
                    <div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*" // Basic image restriction for now, can be expanded
                            onChange={handleFileSelect}
                        />
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="rounded-xl h-10 text-xs shadow-lg shadow-black/5"
                        >
                            {uploading ? <Icon name="Loader" className="animate-spin mr-2" size={14} /> : <Icon name="Upload" className="mr-2" size={14} />}
                            Upload New
                        </Button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto min-h-[400px]">
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((n) => (
                                <div key={n} className="aspect-square bg-gray-100 rounded-3xl animate-pulse" />
                            ))}
                        </div>
                    ) : assets.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                            {assets.map((asset) => (
                                <div key={asset.id} className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all ring-1 ring-black/5">
                                    <div className="aspect-square flex items-center justify-center bg-gray-50 relative overflow-hidden">
                                        {/* Image Preview */}
                                        <div
                                            className="w-full h-full bg-contain bg-center bg-no-repeat transition-transform group-hover:scale-105 duration-500"
                                            style={{ backgroundImage: `url(${asset.url})` }}
                                        />

                                        {/* Hover Overlay */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => copyToClipboard(asset.url)}
                                                className="p-2 bg-white/90 backdrop-blur rounded-xl text-gray-700 hover:text-black hover:bg-white transition-all shadow-lg"
                                                title="Copy Link"
                                            >
                                                <Icon name="Link" size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(asset.id)}
                                                className="p-2 bg-white/90 backdrop-blur rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all shadow-lg"
                                                title="Delete Asset"
                                            >
                                                <Icon name="Trash2" size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white/50 backdrop-blur-sm">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{asset.type}</p>
                                            <span className="text-[10px] text-gray-400 font-mono">{asset.size}</span>
                                        </div>
                                        <p className="text-xs font-bold text-gray-900 truncate" title={asset.name}>{asset.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            className={cn(
                                "h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-[32px] transition-all",
                                isDragging ? "border-indigo-500 bg-indigo-50/50" : "border-gray-200 hover:border-indigo-400 hover:bg-gray-50"
                            )}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-500 mb-4 shadow-sm ring-1 ring-black/5">
                                <Icon name="ImagePlus" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                {isDragging ? "Drop files here" : "Upload your assets"}
                            </h3>
                            <p className="text-sm text-gray-500 max-w-xs mx-auto mb-6">
                                Drag and drop files here, or click to browse.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                {!loading && assets.length > 0 && (
                    <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200 mt-auto flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-medium text-gray-600">
                                <strong className="text-black">{assets.length}</strong> items in library
                            </span>
                            <div className="h-4 w-px bg-gray-200" />
                            <span className="text-[10px] text-gray-400 font-mono">
                                {assets.map(a => parseFloat(a.size) || 0).reduce((a, b) => a + b, 0).toFixed(2)} KB Total
                            </span>
                        </div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            Vercel Blob Storage
                        </div>
                    </div>
                )}
            </div>
        </ControlCenterShell>
    );
}
