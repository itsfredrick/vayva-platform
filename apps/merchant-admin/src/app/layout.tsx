import { Space_Grotesk, Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/context/AuthContext";
import QueryProvider from "@/providers/query-provider";
// import { NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react";
// import { authClient } from "@/lib/neon-auth";
import { Toaster } from "sonner";
// import "@neondatabase/neon-js/ui/css";
import "./globals.css";

export const dynamic = "force-dynamic";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

import { BootSplash } from "@/components/pwa/BootSplash";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Vayva - Seller Dashboard",
  description: "Manage your Vayva store",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Vayva",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body
        className={`font-sans antialiased min-h-screen bg-background`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <QueryProvider>
            <BootSplash />
            {children}
            <Toaster position="top-right" />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
