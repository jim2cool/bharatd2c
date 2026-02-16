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
};

export default nextConfig;
