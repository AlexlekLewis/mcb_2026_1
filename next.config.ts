import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // ---------------------------------------------------------------
      // Legacy URLs from the pre-2026 site. These 404'd with no redirect
      // rules at all, and were still taking ~87 sessions/month from stale
      // index entries and old backlinks (2026-07 growth audit). Each is
      // mapped to the closest live equivalent so the equity is recovered.
      // ---------------------------------------------------------------
      { source: '/tcs', destination: '/terms', permanent: true },
      { source: '/terms-and-conditions', destination: '/terms', permanent: true },
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/gallery', destination: '/projects', permanent: true },
      { source: '/faq', destination: '/guides', permanent: true },

      // Old /blogs-articles namespace → closest current asset.
      {
        source: '/blogs-articles/curtains-vs-blinds-which-is-better-for-my-home',
        destination: '/curtains',
        permanent: true,
      },
      {
        source: '/blogs-articles/security-doors-enhancing-home-safety-with-modern-solutions',
        destination: '/security/security-doors',
        permanent: true,
      },
      {
        source: '/blogs-articles/avoiding-costly-mistakes-in-home-renovations-a-guide-for-homeowners',
        destination: '/guides/new-build-window-furnishings-not-included',
        permanent: true,
      },
      {
        source: '/blogs-articles/the-art-of-curtain-design-enhancing-your-home-with-style-and-elegance',
        destination: '/curtains',
        permanent: true,
      },
      {
        source: '/blogs-articles/expert-guide-to-roller-blinds-functionality-style-and-smart-solutions',
        destination: '/blinds/roller-blinds',
        permanent: true,
      },
      {
        source: '/blogs-articles/expert-tips-for-choosing-perfect-curtains-for-your-home',
        destination: '/curtains',
        permanent: true,
      },
      {
        source: '/blogs-articles/plantation-shutters-a-timeless-investment-in-elegance-and-functionality',
        destination: '/shutters/plantation-shutters',
        permanent: true,
      },
      {
        source: '/blogs-articles/outdoor-zip-screens-transforming-your-outdoor-living-experience',
        destination: '/awnings/zipscreens',
        permanent: true,
      },
      // Catch-all for any remaining legacy blog slug not mapped above.
      { source: '/blogs-articles/:slug*', destination: '/guides', permanent: true },
      { source: '/blogs-articles', destination: '/guides', permanent: true },
      { source: '/blog/:slug*', destination: '/guides', permanent: true },
      { source: '/blog', destination: '/guides', permanent: true },

      {
        source: '/blinds/veri-shades',
        destination: '/blinds/soft-vertical-drapes',
        permanent: true,
      },
      {
        source: '/awnings/outdoor-blinds',
        destination: '/awnings',
        permanent: true,
      },
      {
        source: '/locations/:suburb/outdoor-blinds',
        destination: '/locations/:suburb/awnings',
        permanent: true,
      },
      {
        source: '/awnings/window-awnings',
        destination: '/awnings/auto-awnings',
        permanent: true,
      },
      {
        source: '/locations/:suburb/window-awnings',
        destination: '/locations/:suburb/auto-awnings',
        permanent: true,
      },
      {
        source: '/locations/:suburb/outdoor-shutters',
        destination: '/locations/:suburb/aluminium-shutters',
        permanent: true,
      },
      {
        source: '/curtains/s-fold',
        destination: '/curtains/s-fold-curtains',
        permanent: true,
      },
      {
        // Collapse the old 2-hop chain: velvet-curtains → velvet → theatre-velvet.
        // Point straight at the final destination so there's a single 308.
        source: '/curtains/velvet-curtains',
        destination: '/curtains/theatre-velvet',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'lrhgrmklpvwyjzaipioh.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
