"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Icon, Button } from "@vayva/ui";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin-shell";

const imglyRemoveBackground = async (image: any, options: any) => {
    const { removeBackground } = await import("@imgly/background-removal");
    return removeBackground(image, options);
};

export default function VayvaCutProPage() {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0); // Mock progress for UX

    // Cleanup object URLs to avoid memory leaks
    useEffect(() => {
        return () => {
            if (originalImage) URL.revokeObjectURL(originalImage);
            if (processedImage) URL.revokeObjectURL(processedImage);
        };
    }, [originalImage, processedImage]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        // Reset state
        setIsProcessing(true);
        setProcessedImage(null);
        setProgress(10);

        // create preview
        const objectUrl = URL.createObjectURL(file);
        setOriginalImage(objectUrl);

        try {
            // Start mock progress
            const interval = setInterval(() => {
                setProgress(p => Math.min(p + 5, 90));
            }, 200);

            // Process with imgly
            const blob = await imglyRemoveBackground(file, {
                progress: (key: string, current: number, total: number) => {
                    // console.log(`Downloading ${key}: ${current} of ${total}`);
                }
            });

            clearInterval(interval);
            setProgress(100);

            const processedUrl = URL.createObjectURL(blob);
            setProcessedImage(processedUrl);
            toast.success("Background removed successfully!");

        } catch (error) {
            console.error("Background removal failed:", error);
            toast.error("Failed to remove background. Please try another image.");
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        maxFiles: 1,
        multiple: false
    });

    const handleDownload = () => {
        if (!processedImage) return;
        const link = document.createElement("a");
        link.href = processedImage;
        link.download = "vayva-cut-pro-result.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleReset = () => {
        setOriginalImage(null);
        setProcessedImage(null);
        setIsProcessing(false);
        setProgress(0);
    };

    return (
        <AdminShell>
            <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
                {/* Header */}
                <div className="h-16 px-8 border-b border-gray-200 bg-white flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                            <Icon name="Scissors" size={16} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 font-heading tracking-tight">Vayva Cut Pro</h1>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Beta</span>
                                <span className="text-[10px] text-gray-400">Powered by AI</span>
                            </div>
                        </div>
                    </div>
                    {processedImage && (
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" onClick={handleReset} className="text-gray-500 hover:text-black">New Image</Button>
                            <Button onClick={handleDownload} className="bg-black text-white hover:bg-gray-800 shadow-md">
                                <Icon name="Download" size={16} className="mr-2" /> Download HD
                            </Button>
                        </div>
                    )}
                </div>

                {/* Main Canvas */}
                <div className="flex-1 p-8 flex items-center justify-center relative bg-[url('https://toppng.com/public/uploads/preview/transparent-background-pattern-11553460455n3gq9r492p.png')] bg-repeat">
                    {/* Overlay to dim background pattern */}
                    <div className="absolute inset-0 bg-gray-50/90 backdrop-blur-[2px] pointer-events-none" />

                    {!originalImage ? (
                        <div
                            {...getRootProps()}
                            className={`relative z-10 w-full max-w-2xl aspect-video rounded-3xl border-4 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group
                            ${isDragActive ? "border-purple-500 bg-purple-50 scale-105" : "border-gray-300 bg-white hover:border-gray-400 hover:shadow-xl"}`}
                        >
                            <input {...getInputProps()} />
                            <div className={`w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:bg-purple-50 group-hover:text-purple-500 ${isDragActive ? "animate-bounce" : ""}`}>
                                <Icon name="ImagePlus" size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Drop your product here</h3>
                            <p className="text-sm text-gray-500 font-medium">Supports JPG, PNG, WEBP up to 10MB</p>
                            <p className="mt-8 text-xs text-gray-400 font-mono bg-gray-100 px-3 py-1 rounded-full">Runs locally. 100% Private.</p>
                        </div>
                    ) : (
                        <div className="relative z-10 w-full max-w-[1400px] h-full flex gap-8 items-center justify-center">
                            {/* Original */}
                            <div className="flex-1 h-full max-h-[600px] bg-white rounded-2xl shadow-lg border border-gray-200 p-4 flex flex-col">
                                <div className="flex justify-between items-center mb-4 px-2">
                                    <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">Original</span>
                                </div>
                                <div className="flex-1 relative rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                    <img src={originalImage} alt="Original" className="max-w-full max-h-full object-contain" />
                                </div>
                            </div>

                            {/* Divider / Arrow */}
                            <div className="hidden md:flex items-center justify-center">
                                <div className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-400">
                                    <Icon name="ArrowRight" size={20} />
                                </div>
                            </div>

                            {/* Processed */}
                            <div className="flex-1 h-full max-h-[600px] bg-white rounded-2xl shadow-xl border border-purple-100 p-4 flex flex-col relative overflow-hidden ring-1 ring-purple-500/10">
                                <div className="flex justify-between items-center mb-4 px-2">
                                    <span className="text-xs font-bold uppercase text-purple-600 tracking-wider flex items-center gap-1">
                                        <Icon name="Stars" size={12} /> Result
                                    </span>
                                </div>
                                <div className="flex-1 relative rounded-lg overflow-hidden bg-[url('https://t4.ftcdn.net/jpg/02/68/52/64/360_F_268526431_op1d7x8d3o8t4l4h3q4k1z4p6m.jpg')] bg-cover flex items-center justify-center">
                                    {isProcessing ? (
                                        <div className="text-center z-10">
                                            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
                                            <p className="text-gray-600 font-medium">Removing Background...</p>
                                            <p className="text-xs text-gray-400 mt-1">{progress}%</p>
                                        </div>
                                    ) : (
                                        processedImage && (
                                            <img src={processedImage} alt="Processed" className="max-w-full max-h-full object-contain relative z-10" />
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminShell>
    );
}
