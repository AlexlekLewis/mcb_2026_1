import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
        source: '/curtains/velvet-curtains',
        destination: '/curtains/velvet',
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
