import type { Metadata } from "next";

import { serverFetch } from "@/shared/lib/serverFetch";
import { ENV } from "@/shared/config/env";
import type { OrganizationDocument } from "@/entities/document";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await serverFetch<OrganizationDocument>(`/api/v1/organization-documents/${slug}`);
  if (!doc) return { title: "Документ не найден" };

  const title = `${doc.title} — ${ENV.SITE_NAME}`;
  const description = stripHtml(doc.content).slice(0, 160) || doc.title;
  const canonicalUrl = `${ENV.SITE_URL.replace(/\/$/, "")}/documents/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      ...(doc.file_url && {
        types: { "application/pdf": doc.file_url } as Record<string, string>,
      }),
    },
  };
}

export default function DocumentLayout({ children }: Props) {
  return children;
}
