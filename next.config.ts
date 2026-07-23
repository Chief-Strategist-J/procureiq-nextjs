import type { NextConfig } from "next";

const targetBackendUrl = process.env.SPRINGBOOT_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:6565";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${targetBackendUrl}/api/v1/:path*`,
      },
    ];
  },
  experimental: {},
};

export default nextConfig;
