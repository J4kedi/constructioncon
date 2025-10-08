import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [{ protocol: 'https', hostname: 'placehold.co', pathname: '/**' }],
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
