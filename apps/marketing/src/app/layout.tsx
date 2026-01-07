import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
    title: "Vayva - WhatsApp Business Platform for Nigeria",
    description: "Stop fighting with chat bubbles. Let Vayva's AI auto-capture orders, track payments, and organize your business.",
    keywords: ["WhatsApp business", "Nigeria", "e-commerce", "order management", "payments"],
    authors: [{ name: "Vayva" }],
    manifest: "/manifest.json",
    openGraph: {
        title: "Vayva - WhatsApp Business Platform",
        description: "Turn WhatsApp into a complete business platform",
        url: "https://vayva.ng",
        siteName: "Vayva",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
            },
        ],
        locale: "en_NG",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Vayva - WhatsApp Business Platform",
        description: "Turn WhatsApp into a complete business platform",
        images: ["/og-image.png"],
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

import Script from "next/script";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Vayva",
        "url": "https://vayva.ng",
        "logo": "https://vayva.ng/favicon.svg",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+234-XXX-XXXX-XXXX",
            "contactType": "customer service",
            "email": "support@vayva.ng"
        },
        "description": "Vayva is the leading WhatsApp Business Platform in Nigeria, helping SMEs automate sales, payments, and logistics with AI.",
        "sameAs": [
            "https://twitter.com/vayvang",
            "https://www.linkedin.com/company/vayva"
        ]
    };

    return (
        <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} light`} suppressHydrationWarning>
            <head>
                <Script
                    id="json-ld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className="antialiased font-sans bg-white text-slate-900" style={{ backgroundColor: "#ffffff", color: "#000000" }} suppressHydrationWarning>
                {children}
            </body>
        </html>
    );
}
