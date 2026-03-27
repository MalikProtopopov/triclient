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

/** Публичный origin S3/CloudFront для галерей и медиа (полный URL без path), опционально */
function getS3PublicImagePattern() {
  const origin = process.env.NEXT_PUBLIC_S3_PUBLIC_ORIGIN?.trim();
  if (!origin) return null;
  try {
    const u = new URL(origin);
    return {
      protocol: u.protocol.replace(":", "") as "http" | "https",
      hostname: u.hostname,
      pathname: "/**",
      ...(u.port && u.port !== "80" && u.port !== "443" ? { port: u.port } : {}),
    };
  } catch {
    return null;
  }
}

const imageRemotePatterns = [getApiImagePattern()];
const s3Pattern = getS3PublicImagePattern();
if (s3Pattern) imageRemotePatterns.push(s3Pattern);

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: imageRemotePatterns,
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
        source: "/cities",
        destination: "/doctors/cities",
        permanent: true,
      },
      {
        source: "/cities/",
        destination: "/doctors/cities",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
    return [
      { source: "/sitemap.xml", destination: `${API_URL}/sitemap.xml` },
      { source: "/robots.txt", destination: `${API_URL}/robots.txt` },
      {
        source: "/api/v1/:path*",
        destination: `${apiBase.replace(/\/$/, "")}/:path*`,
      },
    ];
  },
};

export default nextConfig;
