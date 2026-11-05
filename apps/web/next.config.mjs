/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const srcDir = join(__dirname, 'src');

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Keep dev artifacts separate so a production build cannot corrupt a running dev server.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '4000',
        pathname: '/uploads/**',
      },
    ],
  },
  // Path aliases for cleaner imports
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/components': join(srcDir, 'components'),
      '@/lib': join(srcDir, 'lib'),
      '@/hooks': join(srcDir, 'hooks'),
      '@/utils': join(srcDir, 'utils'),
    };
    return config;
  },
};

export default nextConfig;
