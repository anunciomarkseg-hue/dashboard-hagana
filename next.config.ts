import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/hagana",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
