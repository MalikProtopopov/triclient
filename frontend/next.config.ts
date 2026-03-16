import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function getApiImagePattern() {
  try {
    const u = new URL(API_URL);
    return {
      protocol: u.protocol.replace(":", "") as "http" | "https",
      hostname: u.hostname,
      pathname: "/**",
      ...(u.port && u.port !== "80" && u.port !== "443" ? { port: u.port } : {}),
    };
  } catch {
    return { protocol: "https" as const, hostname: "trihoback.mediann.dev", pathname: "/**" };
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [getApiImagePattern()],
  },
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
