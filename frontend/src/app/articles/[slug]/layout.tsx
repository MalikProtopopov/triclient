import type { Metadata } from "next";

import { serverFetch } from "@/shared/lib/serverFetch";
import { buildMetadata } from "@/shared/lib/seo";
import type { ArticleResponseSchema } from "@/entities/article";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await serverFetch<ArticleResponseSchema>(`/api/v1/articles/${slug}`);
  if (!article) return { title: "Статья не найдена" };

  return buildMetadata(article.seo ?? null, {
    title: article.title,
    description: article.excerpt?.slice(0, 160) ?? "",
  });
}

export default function ArticleLayout({ children }: Props) {
  return children;
}
