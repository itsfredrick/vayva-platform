import React from "react";
import "../globals.css"; // Import global styles for Tailwind
import { DownloadModalProvider } from "@/context/DownloadModalContext";
import { PWAInstallToast } from "@/components/marketing/PWAInstallToast";
import { Toaster } from "sonner";

// This layout is intentionally minimal to avoid inheriting generic Vayva headers/footers
// It is used for template previews so they look like standalone sites.

export default function StandaloneLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <React.Fragment>
            <DownloadModalProvider>
                <main className="min-h-screen bg-white">
                    {children}
                </main>
                {/* We still include PWA toast as requested (once per session), but NO header/footer */}
                <PWAInstallToast />
                <Toaster position="top-center" richColors />
            </DownloadModalProvider>
        </React.Fragment>
    );
}
