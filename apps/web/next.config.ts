import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ummies/ui"],
  distDir: process.env.NEXT_DIST_DIR || ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.lattafa-usa.com",
      },
      {
        protocol: "https",
        hostname: "lattafa-usa.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
