import type { NextConfig } from "next";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(
    /\/+$/,
    "",
  );

const nextConfig: NextConfig = {
  images: {
    remotePatterns: apiBaseUrl
      ? [
          new URL(
            `${apiBaseUrl}/api/images/**`,
          ),
        ]
      : [],
  },
};

export default nextConfig;
