import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      { source: "/sitemap.xml", destination: `${API_URL}/sitemap.xml` },
      { source: "/robots.txt", destination: `${API_URL}/robots.txt` },
    ];
  },
};

export default nextConfig;
