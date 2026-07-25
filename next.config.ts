import type { NextConfig } from "next";
import { getMFERewrites } from "../shell/src/router/mfe-routes";

const targetBackendUrl = process.env.SPRINGBOOT_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:6565";

const nextConfig: NextConfig = {
  async rewrites() {
    const mfeRewrites = getMFERewrites();
    return [
      {
        source: '/api/v1/:path*',
        destination: `${targetBackendUrl}/api/v1/:path*`,
      },
      ...mfeRewrites,
    ];
  },
  experimental: {},
};

export default nextConfig;
