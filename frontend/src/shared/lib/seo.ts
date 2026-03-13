import type { Metadata } from "next";

import { ENV } from "@/shared/config/env";
import type { SeoMeta } from "@/shared/types";

interface MetadataDefaults {
  title: string;
  description: string;
}

export function buildMetadata(
  seo: SeoMeta | null | undefined,
  defaults: MetadataDefaults,
): Metadata {
  const title = seo?.title || defaults.title;
  const description = seo?.description || defaults.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: ENV.SITE_NAME,
      url: seo?.og_url ?? undefined,
      type: (seo?.og_type as "website" | "article") ?? "website",
      images: seo?.og_image ? [{ url: seo.og_image }] : undefined,
    },
    twitter: {
      card: (seo?.twitter_card as "summary" | "summary_large_image") ?? "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: seo?.canonical_url ?? undefined,
    },
  };
}
