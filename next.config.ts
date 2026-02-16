import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/.well-known/commerce",
        destination: "/api/commerce",
      },
    ];
  },
  // Production optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', '@radix-ui/react-dialog', 'framer-motion']
  },
  webpack: (config, { isServer, dev }) => {
    // Only apply optimizations in production client builds
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Group common dependencies
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
              priority: 10,
            },
            // Separate large libraries
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module: any) {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1];
                return `npm.${packageName?.replace('@', '')}`;
              },
              priority: 20,
            },
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
