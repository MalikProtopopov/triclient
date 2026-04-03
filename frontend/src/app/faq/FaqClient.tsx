"use client";

import { useState, useCallback, useRef, Suspense } from "react";
import { Search, ChevronDown, User, Calendar } from "lucide-react";
import gsap from "gsap";

import { useFaqList } from "@/entities/faq";
import type { FaqPublicItem } from "@/entities/faq";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Button, SkeletonCard, EmptyState } from "@/shared/ui";
import { useGSAP } from "@/shared/lib/useGSAP";

const PER_PAGE = 20;

function FaqAccordionItem({ item }: { item: FaqPublicItem }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;

    if (isOpen) {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => setIsOpen(false),
      });
    } else {
      setIsOpen(true);
      gsap.set(el, { height: "auto", opacity: 1 });
      const h = el.offsetHeight;
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        { height: h, opacity: 1, duration: 0.3, ease: "power2.inOut" },
      );
    }
  }, [isOpen]);

  const formattedDate = item.original_date
    ? new Date(item.original_date).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-bg-secondary transition-colors duration-200 hover:border-accent/30">
      <button
        onClick={toggle}
        className="flex w-full items-start gap-4 px-6 py-5 text-left"
      >
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-base font-semibold leading-snug text-text-primary sm:text-lg">
            {item.question_title}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-text-muted">
            {item.author_name && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {item.author_name}
              </span>
            )}
            {formattedDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formattedDate}
              </span>
            )}
          </div>
        </div>
        <ChevronDown
          className={`mt-1 h-5 w-5 shrink-0 text-text-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
      >
        <div className="border-t border-border px-6 py-5">
          {item.question_text && (
            <div className="mb-4">
              <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
                Вопрос
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                {item.question_text}
              </p>
            </div>
          )}
          {item.answer_text && (
            <div className="rounded-xl bg-accent/5 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-accent">
                Ответ эксперта
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-text-primary">
                {item.answer_text}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FaqContent() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value.length >= 2 ? value : "");
      setPage(1);
    }, 400);
  }, []);

  const { data, isLoading } = useFaqList({
    answered_only: true,
    limit: PER_PAGE,
    offset: (page - 1) * PER_PAGE,
    search: debouncedSearch || undefined,
  });

  const items = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PER_PAGE);

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
              Вопросы и ответы
            </h1>
            <p data-hero-text className="mt-4 max-w-xl text-text-secondary">
              Ответы экспертов-трихологов на вопросы пациентов
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
          <div className="w-full">
            <div className="relative mb-8 w-full sm:w-96">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Поиск по вопросам..."
                className="w-full rounded-xl border border-border bg-bg-secondary py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : items.length === 0 ? (
              <EmptyState
                title="Вопросы не найдены"
                description={
                  debouncedSearch
                    ? "Попробуйте другой поисковый запрос"
                    : "Пока нет опубликованных вопросов"
                }
                action={
                  debouncedSearch
                    ? {
                        label: "Сбросить поиск",
                        onClick: () => {
                          setSearch("");
                          setDebouncedSearch("");
                          setPage(1);
                        },
                      }
                    : undefined
                }
              />
            ) : (
              <>
                <p className="mb-6 text-sm text-text-muted">
                  Найдено вопросов: {total}
                </p>
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <FaqAccordionItem key={item.id} item={item} />
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

export default function FaqClient() {
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
              <div className="w-full space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <FaqContent />
    </Suspense>
  );
}
