"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Icon, Button } from "@vayva/ui";
import { toast } from "sonner";

export const StoreQRCode = () => {
    const [qrUrl, setQrUrl] = useState<string>("");
    const [storeLink, setStoreLink] = useState<string>("");

    useEffect(() => {
        // Fetch store URL
        fetch("/api/storefront/url")
            .then((res) => res.json())
            .then((data) => {
                if (data.url) {
                    setStoreLink(data.url);
                    generateQR(data.url);
                }
            })
            .catch((err) => console.error("Failed to load store link", err));
    }, []);

    const generateQR = async (text: string) => {
        try {
            const url = await QRCode.toDataURL(text, { width: 300, margin: 2, color: { dark: '#000000', light: '#ffffff' } });
            setQrUrl(url);
        } catch (err) {
            console.error(err);
        }
    };

    const downloadQR = () => {
        if (!qrUrl) return;
        const link = document.createElement("a");
        link.href = qrUrl;
        link.download = "my-store-qr.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("QR Code downloaded!");
    };

    if (!storeLink) return <div className="animate-pulse h-64 bg-gray-100 rounded-2xl"></div>;

    return (
        <div className="bg-white border border-gray-200 p-6 rounded-2xl h-full flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                <Icon name="QrCode" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Store QR Code</h3>
            <p className="text-gray-500 text-sm mb-6">
                Let customers scan to visit your store instantly.
            </p>

            <div className="mb-6 p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                {qrUrl ? (
                    <img src={qrUrl} alt="Store QR Code" className="w-48 h-48 object-contain" />
                ) : (
                    <div className="w-48 h-48 flex items-center justify-center text-gray-300">Generating...</div>
                )}
            </div>

            <div className="mt-auto flex gap-3 w-full">
                <Button variant="outline" className="flex-1" onClick={downloadQR}>
                    <Icon name="Download" size={16} className="mr-2" /> Download
                </Button>
                <Button variant="ghost" size="icon" onClick={() => {
                    navigator.clipboard.writeText(storeLink);
                    toast.success("Link copied!");
                }}>
                    <Icon name="Copy" size={16} />
                </Button>
            </div>
        </div>
    );
};
