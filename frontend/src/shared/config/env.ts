export const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME ?? "Ассоциация трихологов",
} as const;
