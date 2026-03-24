"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { useArticle } from "@/entities/article";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { DocumentContentBlockRenderer } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { formatDate } from "@/shared/lib/format";

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: article, isLoading, isError, error } = useArticle(slug);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <Header />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 lg:px-8">
          <div className="mb-6 h-6 w-48 animate-pulse rounded bg-border-light" />
          <div className="mb-8 h-64 animate-pulse rounded-xl bg-border-light" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-border-light" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-border-light" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <Header />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 lg:px-8">
          <p className="text-error">
            {error ? "Не удалось загрузить статью" : "Статья не найдена"}
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 lg:px-8">
        <Link
          href={ROUTES.ARTICLES}
          className="mb-6 inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-accent"
        >
          ← Все статьи
        </Link>

        {article.cover_image_url ? (
          <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl bg-metal-light">
            <Image
              src={article.cover_image_url}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>
        ) : (
          <div className="mb-6 h-64 w-full overflow-hidden rounded-xl bg-metal-light" />
        )}

        <div className="mb-3 flex items-center gap-3">
          <p className="text-sm text-text-muted">
            {formatDate(article.published_at)}
          </p>
          {article.themes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {article.themes.map((t) => (
                <span
                  key={t.id}
                  className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
                >
                  {t.title}
                </span>
              ))}
            </div>
          )}
        </div>

        <h1 className="mb-8 font-heading text-3xl font-semibold text-text-primary">
          {article.title}
        </h1>

        <div
          className="prose max-w-none prose-headings:font-heading prose-headings:text-text-primary prose-p:text-text-secondary"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <DocumentContentBlockRenderer blocks={article.content_blocks ?? []} className="mt-10 space-y-6" />
      </main>
      <Footer />
    </div>
  );
}
