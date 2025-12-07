import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ftp.goit.study',
      },
      {
        protocol: 'https',
        hostname: '*cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*ac.goit.global',
      },
    ],
  },
};

export default nextConfig;
