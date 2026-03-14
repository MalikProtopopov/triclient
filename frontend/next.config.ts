import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/auth/reset-password",
        destination: "/reset-password",
        permanent: true,
      },
      {
        source: "/auth/confirm-email",
        destination: "/confirm-email",
        permanent: true,
      },
      {
        source: "/auth/verify-email",
        destination: "/confirm-email",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      { source: "/sitemap.xml", destination: `${API_URL}/sitemap.xml` },
      { source: "/robots.txt", destination: `${API_URL}/robots.txt` },
    ];
  },
};

export default nextConfig;
