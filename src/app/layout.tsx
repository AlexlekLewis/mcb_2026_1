import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { JsonLd } from "@/components/JsonLd";

import { Analytics, AnalyticsNoScript } from "@/components/Analytics";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://moderncurtains.com.au"),
  title: {
    default: "Modern Curtains & Blinds Solutions",
    template: "%s | Modern Curtains and Blinds"
  },
  description: "Modern Curtains & Blinds: Discover custom window treatments that elevate home aesthetics. Book a free quote today and enjoy summer savings!",
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: '/',
    siteName: 'Modern Curtains and Blinds',
    title: "Modern Curtains & Blinds Solutions",
    description: "Modern Curtains & Blinds: Discover custom window treatments that elevate home aesthetics. Book a free quote today and enjoy summer savings!",
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
    index: false, // PRE-LAUNCH SAFETY: Do not index staging
    follow: false, // PRE-LAUNCH SAFETY: Do not follow links
    googleBot: {
      index: false,
      follow: false,
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
        <AnalyticsNoScript />
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <ChatWidget />
        <StickyMobileCTA />
        <JsonLd />
        <Analytics />
      </body>
    </html>
  );
}
