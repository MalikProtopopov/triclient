"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import gsap from "gsap";

import { useArticles, useArticleThemes } from "@/entities/article";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { DropdownSelect, Button, SkeletonCard, EmptyState } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { formatDate } from "@/shared/lib/format";
import { useGSAP } from "@/shared/lib/useGSAP";

const PER_PAGE = 10;

function ArticlesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [themeSlug, setThemeSlug] = useState(searchParams.get("theme") ?? "");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams();
    if (themeSlug) params.set("theme", themeSlug);
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : ROUTES.ARTICLES, { scroll: false });
  }, [themeSlug, router]);

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

  const headerRef = useGSAP((_ctx, el) => {
    gsap.fromTo(
      el.querySelectorAll("[data-hero-text]"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" },
    );
  });

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <main className="flex-1">
        <div ref={headerRef} className="border-b border-border bg-bg-secondary">
          <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-16">
            <p
              data-hero-text
              className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-text-muted"
            >
              Ассоциация трихологов
            </p>
            <h1
              data-hero-text
              className="font-heading text-4xl font-bold text-text-primary lg:text-5xl xl:text-6xl"
            >
              Статьи и новости
            </h1>
            <p data-hero-text className="mt-4 max-w-xl text-text-secondary">
              Материалы ассоциации: исследования, новости профессии и практические материалы
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
          <div className="w-full">
            {themes.length > 0 && (
              <div className="mb-8 w-full sm:w-56">
                <DropdownSelect
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
                  <div className="mt-8 flex items-center justify-start gap-2">
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ArticlesClient() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col bg-bg">
          <Header />
          <main className="flex-1">
            <div className="border-b border-border bg-bg-secondary">
              <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-16">
                <div className="mb-2 h-3 w-40 animate-pulse rounded bg-border-light/60" />
                <div className="mb-4 h-10 w-64 animate-pulse rounded bg-border-light/60 lg:h-12 lg:w-96" />
                <div className="h-4 w-full max-w-xl animate-pulse rounded bg-border-light/60" />
              </div>
            </div>
            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
              <div className="w-full space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <ArticlesContent />
    </Suspense>
  );
}
