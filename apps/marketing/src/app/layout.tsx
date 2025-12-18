import type { Metadata } from "next";
// import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

// const inter = Inter({
//   variable: "--font-inter",
//   subsets: ["latin"],
// });

// const spaceGrotesk = Space_Grotesk({
//   variable: "--font-heading", // Mapping to heading var in CSS
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Vayva | Sell Online in Nigeria",
  description: "Turn your WhatsApp into a sales machine with Vayva.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
