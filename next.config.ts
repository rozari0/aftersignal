import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let phones on the LAN load dev assets/HMR from this machine (dev only).
  allowedDevOrigins: ["192.168.0.192"],
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
