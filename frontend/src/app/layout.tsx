import type { Metadata } from "next";
import {
  Playfair_Display,
  Raleway,
  Cormorant_Garamond,
  Mulish,
  Libre_Baskerville,
  Nunito,
  Plus_Jakarta_Sans,
  Inter,
  Instrument_Serif,
  DM_Sans,
  Space_Grotesk,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
} from "next/font/google";

import { Toaster } from "sonner";

import { Providers } from "@/providers/Providers";

import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const libre = Libre_Baskerville({
  variable: "--font-libre",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

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

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ассоциация трихологов",
    template: "%s | Ассоциация трихологов",
  },
  description:
    "Профессиональная ассоциация врачей-трихологов России. Каталог специалистов, мероприятия, сертификация.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Ассоциация трихологов",
    title: "Ассоциация трихологов",
    description:
      "Профессиональная ассоциация врачей-трихологов России. Каталог специалистов, мероприятия, сертификация.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ассоциация трихологов",
    description:
      "Профессиональная ассоциация врачей-трихологов России.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${playfair.variable} ${raleway.variable} ${cormorant.variable} ${mulish.variable} ${libre.variable} ${nunito.variable} ${jakarta.variable} ${inter.variable} ${instrumentSerif.variable} ${dmSans.variable} ${spaceGrotesk.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} theme-clinical`}
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
