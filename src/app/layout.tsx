import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { OrganizationSchema } from "@/components/RichSchema";

import { Analytics, AnalyticsNoScript } from "@/components/Analytics";
import { EventTracker } from "@/components/EventTracker";
import { EngagementTracker } from "@/components/EngagementTracker";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { PaymentOptions } from "@/components/PaymentOptions";
import { SITE } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Custom Curtains, Blinds, Shutters & Security Screens Melbourne",
    template: "%s | Modern Curtains and Blinds"
  },
  description: "Book a free in-home measure and quote for custom curtains, blinds, shutters, security screens, awnings and motorisation across Melbourne.",
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    // No `url` here: a root-level og:url is inherited by every page that doesn't
    // set its own, making all pages advertise the homepage as their OG URL.
    // The homepage sets og:url '/' itself; other pages set their own canonical.
    siteName: 'Modern Curtains and Blinds',
    title: "Custom Curtains, Blinds, Shutters & Security Screens Melbourne",
    description: "Free in-home measure and quote. Samples brought to you, clear written pricing and professional installation across Melbourne.",
    images: [
      {
        url: '/images/mcb-og-multi-product.png',
        width: 1200,
        height: 630,
        alt: 'Modern Curtains and Blinds full product range',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Curtains, Blinds, Shutters & Security Screens Melbourne",
    description: "Free in-home measure and quote. Samples brought to you, clear written pricing and professional installation across Melbourne.",
    images: ["/images/mcb-og-multi-product.png"],
  },
  robots: {
    index: process.env.NEXT_PUBLIC_NOINDEX !== "true",
    follow: process.env.NEXT_PUBLIC_NOINDEX !== "true",
    googleBot: {
      index: process.env.NEXT_PUBLIC_NOINDEX !== "true",
      follow: process.env.NEXT_PUBLIC_NOINDEX !== "true",
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
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
      style={{ position: "relative" }}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-mcb-paper text-mcb-charcoal selection:bg-mcb-terracotta selection:text-white">
        <AnalyticsNoScript />
        <Navbar />
        <PaymentOptions variant="banner" topOffset />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <ChatWidget />
        <StickyMobileCTA />
        <OrganizationSchema />
        <Analytics />
        <EventTracker />
        <EngagementTracker />
      </body>
    </html>
  );
}
