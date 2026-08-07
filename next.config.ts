import type { NextConfig } from "next";
import path from "node:path";

const isVercel = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  turbopack: isVercel
    ? {
        resolveAlias: {
          "cloudflare:workers": "./lib/vercel-cloudflare-shim.ts",
        },
      }
    : undefined,
  webpack(config) {
    if (isVercel) {
      config.resolve.alias["cloudflare:workers"] = path.resolve(
        process.cwd(),
        "lib/vercel-cloudflare-shim.ts",
      );
    }
    return config;
  },
};

export default nextConfig;
