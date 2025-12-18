import './globals.css';

import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { OpsShell } from '@/components/OpsShell';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });

export const metadata: Metadata = {
  title: 'Vayva Ops Console',
  description: 'Internal Operations Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
        <OpsShell>
          {children}
        </OpsShell>
      </body>
    </html>
  );
}
