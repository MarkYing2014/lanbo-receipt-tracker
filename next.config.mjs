/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.clerk.dev', 'img.clerk.com'],
  },
  // Allow Convex and Clerk to be used in Edge runtime
  serverExternalPackages: ['convex/server'],
};

export default nextConfig;
