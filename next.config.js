/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.clerk.dev', 'img.clerk.com'],
  },
  // Configure module transpilation for Clerk and Tailwind
  transpilePackages: ['@clerk/nextjs', '@clerk/clerk-react'],
  webpack: (config, { isServer }) => {
    // Handle Node.js built-in modules for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        async_hooks: false,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        perf_hooks: false
      };
    }
    
    // Fix for node: protocol imports
    config.resolve.alias = {
      ...config.resolve.alias,
      'node:async_hooks': 'async_hooks',
    };
    
    return config;
  },
};

module.exports = nextConfig;
