import { env } from '@/env';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: new URL(env.NEXT_PUBLIC_IMAGE_CDN_URL).hostname,
      },
    ],
  },
};

export default nextConfig;
