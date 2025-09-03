import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [{ protocol: 'https', hostname: 'placehold.co', pathname: '/**' }],
  },
  /** @type {import('next').NextConfig} */
  // assetPrefix: '/dashboard/estoque',
  // async rewrites() {
  //     return [
  //         {
  //             source: '/dashboard',
  //             destination: `${process.env.SUBDOMAIN}/estoque`,
  //         },
  //     ];
  // },
};

export default nextConfig;
