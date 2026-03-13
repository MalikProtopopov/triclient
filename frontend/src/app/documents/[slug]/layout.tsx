import type { Metadata } from "next";

import { serverFetch } from "@/shared/lib/serverFetch";
import type { OrganizationDocument } from "@/entities/document";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await serverFetch<OrganizationDocument>(`/api/v1/organization-documents/${slug}`);
  if (!doc) return { title: "Документ не найден" };

  return {
    title: doc.title,
    description: `Документ организации: ${doc.title}`,
  };
}

export default function DocumentLayout({ children }: Props) {
  return children;
}
