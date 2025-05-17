import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'favicon-cdn.bora-karaca.workers.dev',
      },
    ],
  },
};

export default nextConfig;
