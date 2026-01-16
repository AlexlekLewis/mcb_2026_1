import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";

import { StickyMobileCTA } from "@/components/StickyMobileCTA";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://moderncurtains.com.au"),
  title: {
    default: "Modern Curtains and Blinds | Custom Window Treatments Melbourne",
    template: "%s | Modern Curtains and Blinds"
  },
  description: "Premium custom curtains, blinds, shutters and security doors. Australian made and installed in Melbourne.",
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: '/',
    siteName: 'Modern Curtains and Blinds',
    title: "Modern Curtains and Blinds | Custom Window Treatments Melbourne",
    description: "Premium custom curtains, blinds, shutters and security doors. Australian made and installed in Melbourne.",
    images: [
      {
        url: '/assets/og-image.jpg', // Ensure this asset exists or is created
        width: 1200,
        height: 630,
        alt: 'Modern Curtains and Blinds',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-mcb-paper text-mcb-charcoal selection:bg-mcb-terracotta selection:text-white">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <ChatWidget />
        <StickyMobileCTA />
      </body>
    </html>
  );
}
