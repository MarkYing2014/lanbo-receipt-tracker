/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.clerk.dev', 'img.clerk.com'],
  },
  // Configure module transpilation for Clerk and Tailwind
  transpilePackages: ['@clerk/nextjs', '@clerk/clerk-react'],
  webpack: (config) => {
    // Add specific loaders for Tailwind CSS v4 if needed
    return config;
  },
};

module.exports = nextConfig;
