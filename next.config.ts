import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [{ protocol: 'https', hostname: 'placehold.co', pathname: '/**' }],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/dashboard/marketplace/:path*',
        destination: 'http://localhost:3001/dashboard/marketplace/:path*',
      },
      {
        source: '/proxy/:path*',
        destination: `http://localhost:8080/proxy/:path*`,
      },
    ];
  },
};

export default nextConfig;
