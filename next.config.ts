import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/random-pokemon-team-generator",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
