"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { useArticles, useArticleThemes } from "@/entities/article";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Select, Button, SkeletonCard, EmptyState } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { formatDate } from "@/shared/lib/format";

const PER_PAGE = 10;

export default function ArticlesPage() {
  const [themeSlug, setThemeSlug] = useState("");
  const [page, setPage] = useState(1);

  const { data: themesData } = useArticleThemes();
  const { data, isLoading } = useArticles({
    theme_slug: themeSlug || undefined,
    limit: PER_PAGE,
    offset: (page - 1) * PER_PAGE,
  });

  const articles = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PER_PAGE);
  const themes = themesData ?? [];

  const themeOptions = [
    { value: "", label: "Все темы" },
    ...themes.map((t) => ({ value: t.slug, label: t.title })),
  ];

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 lg:px-8">
        <div className="mb-10">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
            Ассоциация трихологов
          </p>
          <h1 className="font-heading text-4xl font-bold text-text-primary lg:text-5xl">
            Статьи и новости
          </h1>
        </div>

        {themes.length > 0 && (
          <div className="mb-8 w-full sm:w-56">
            <Select
              options={themeOptions}
              value={themeSlug}
              onChange={(e) => {
                setThemeSlug(e.target.value);
                setPage(1);
              }}
              placeholder="Тема"
            />
          </div>
        )}

        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <EmptyState
            title="Статьи не найдены"
            description="Попробуйте другую тему"
            action={
              themeSlug
                ? {
                    label: "Сбросить фильтр",
                    onClick: () => {
                      setThemeSlug("");
                      setPage(1);
                    },
                  }
                : undefined
            }
          />
        ) : (
          <>
            <div className="space-y-5">
              {articles.map((article) => (
                <Link key={article.id} href={ROUTES.ARTICLE(article.slug)}>
                  <article className="group flex flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-bg-secondary transition-all duration-300 hover:border-accent/40 hover:shadow-md sm:flex-row">
                    <div className="relative h-52 w-full flex-shrink-0 sm:h-auto sm:w-[280px]">
                      {article.cover_image_url ? (
                        <Image
                          src={article.cover_image_url}
                          alt={article.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 100vw, 280px"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-border-light to-accent/20" />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center p-6">
                      <p className="mb-2 text-xs text-text-muted">
                        {formatDate(article.published_at)}
                      </p>
                      <h2 className="mb-2 font-heading text-lg font-semibold leading-snug text-text-primary">
                        {article.title}
                      </h2>
                      {article.themes.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-1">
                          {article.themes.map((t) => (
                            <span
                              key={t.id}
                              className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent"
                            >
                              {t.title}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-text-secondary">
                        {article.excerpt}
                      </p>
                      <span className="text-sm font-medium text-text-muted transition-colors group-hover:text-text-primary">
                        Читать →
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Назад
                </Button>
                <span className="px-4 text-sm text-text-secondary">
                  {page} из {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Вперёд
                </Button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
