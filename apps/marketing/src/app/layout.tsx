import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vayva — WhatsApp Commerce for Nigeria | Sell, Get Paid, Deliver Faster',
  description: 'Turn WhatsApp chats into orders. Get paid, manage delivery (Kwik optional), track customers, and grow with templates built for Nigeria.',
  keywords: ['WhatsApp commerce Nigeria', 'online store WhatsApp', 'accept payments Nigeria', 'dispatch delivery tracking', 'storefront templates', 'merchant dashboard'],
  openGraph: {
    title: 'Vayva — WhatsApp Commerce for Nigeria',
    description: 'Turn WhatsApp chats into orders. Get paid, manage delivery, track customers.',
    url: 'https://vayva.ng',
    siteName: 'Vayva',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Vayva - WhatsApp Commerce for Nigeria'
      }
    ],
    locale: 'en_NG',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vayva — WhatsApp Commerce for Nigeria',
    description: 'Turn WhatsApp chats into orders. Get paid, manage delivery, track customers.',
    images: ['/og-image.png']
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://vayva.ng'
  }
};

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-[#F7FAF7] text-[#0B1220] antialiased flex flex-col min-h-screen"
      >
        <Header />
        <main className="flex-grow pt-[72px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
