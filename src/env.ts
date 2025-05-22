import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  client: {
    NEXT_PUBLIC_API_URL: z
      .string()
      .url('NEXT_PUBLIC_API_URL should be a valid URL'),
    NEXT_PUBLIC_IMAGE_CDN_URL: z
      .string()
      .url('IMAGE_CDN_HOSTNAME should be a valid URL'),
  },
  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_IMAGE_CDN_URL: process.env.NEXT_PUBLIC_IMAGE_CDN_URL,
  },
});
