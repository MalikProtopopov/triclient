import type { Metadata } from "next";

import { ENV } from "@/shared/config/env";
import type { SeoMeta } from "@/shared/types";

interface MetadataDefaults {
  title: string;
  description: string;
}

const VALID_OG_TYPES = new Set(["website", "article", "book", "profile"]);
type OgType = "website" | "article" | "book" | "profile";

const VALID_TWITTER_CARDS = new Set(["summary", "summary_large_image"]);
type TwitterCard = "summary" | "summary_large_image";

export function buildMetadata(
  seo: SeoMeta | null | undefined,
  defaults: MetadataDefaults,
): Metadata {
  const title = seo?.title || defaults.title;
  const description = seo?.description || defaults.description;

  const ogType: OgType = VALID_OG_TYPES.has(seo?.og_type ?? "")
    ? (seo!.og_type as OgType)
    : "website";

  const twitterCard: TwitterCard = VALID_TWITTER_CARDS.has(seo?.twitter_card ?? "")
    ? (seo!.twitter_card as TwitterCard)
    : "summary_large_image";

  const ogImageUrl = seo?.og_image ?? undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: ENV.SITE_NAME,
      url: seo?.og_url ?? undefined,
      type: ogType,
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
    twitter: {
      card: twitterCard,
      title,
      description,
    },
    alternates: {
      canonical: seo?.canonical_url ?? undefined,
    },
  };
}
