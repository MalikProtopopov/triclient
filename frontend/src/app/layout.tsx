import type { Metadata } from "next";

import { fetchPublicSettingsServer } from "@/entities/settings";

import { Plus_Jakarta_Sans, Inter } from "next/font/google";

import { Toaster } from "sonner";

import { Providers } from "@/providers/Providers";

import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "cyrillic-ext"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const FALLBACK_SITE_NAME = "Профессиональное общество Трихологов";
const FALLBACK_DESCRIPTION =
  "Профессиональная организация врачей-трихологов России. Каталог специалистов, мероприятия, сертификация.";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchPublicSettingsServer();
  const siteName = settings?.site_name?.trim() || FALLBACK_SITE_NAME;
  const description = settings?.site_description?.trim() || FALLBACK_DESCRIPTION;

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    openGraph: {
      type: "website",
      locale: "ru_RU",
      siteName: siteName,
      title: siteName,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${jakarta.variable} ${inter.variable} theme-clinical-aura`}
    >
      <body className="min-h-screen antialiased">
        <Providers>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
