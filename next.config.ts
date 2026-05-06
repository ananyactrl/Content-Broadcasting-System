import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // picsum.photos kept for any seed data that still references it
      // during the transition period; remove once all seed data uses
      // the local placeholder.
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    // Allow SVG files to be served via next/image (unoptimized)
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
