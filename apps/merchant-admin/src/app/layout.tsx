import { Manrope } from 'next/font/google';
import '@vayva/theme/css'; // Use shared theme
import { AuthProvider } from '@/context/AuthContext';

const manrope = Manrope({
    subsets: ['latin'],
    weight: ['200', '300', '400', '500', '600', '700', '800'],
    variable: '--font-manrope',
});

export const metadata: Metadata = {
    title: 'Vayva Admin',
    description: 'Seller Dashboard',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            </head>
            <body className={`${manrope.variable} font-sans antialiased min-h-screen`}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
