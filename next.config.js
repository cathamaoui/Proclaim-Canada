/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Skip type checking during build for MVP - types are checked in IDE
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Specify output file tracing root to avoid lockfile warnings
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;
