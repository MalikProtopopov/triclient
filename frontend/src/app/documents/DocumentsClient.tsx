"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Download, ArrowRight } from "lucide-react";
import gsap from "gsap";

import { useDocuments } from "@/entities/document";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Button, SkeletonCard } from "@/shared/ui";
import { ROUTES } from "@/shared/config";
import { cn } from "@/shared/lib";
import { useGSAP } from "@/shared/lib/useGSAP";

export default function DocumentsClient() {
  const { data, isLoading } = useDocuments();
  const documents = data?.data ?? [];
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const headerRef = useGSAP((_ctx, el) => {
    gsap.fromTo(
      el.querySelectorAll("[data-hero-text]"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" },
    );
  });

  const toggleOpen = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

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
              Документы организации
            </h1>
            <p data-hero-text className="mt-4 max-w-xl text-text-secondary">
              Уставные и правовые материалы, политики и официальные документы общества
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
          <div className="w-full">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
            {documents.map((doc) => {
              const isOpen = openIds.has(doc.id);
              return (
                <div
                  key={doc.id}
                  className="rounded-xl border border-border bg-bg-secondary overflow-hidden"
                >
                  <button
                    onClick={() => toggleOpen(doc.id)}
                    className="flex w-full items-center justify-between px-4 py-4 text-left transition-colors hover:bg-bg"
                  >
                    <span className="font-medium text-text-primary">
                      {doc.title}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-text-muted transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-border px-4 py-4">
                      <div
                        className="prose prose-sm max-w-none prose-headings:font-heading prose-headings:text-text-primary prose-p:text-text-secondary mb-4"
                        dangerouslySetInnerHTML={{ __html: doc.content }}
                      />
                      <div className="flex items-center gap-3">
                        {doc.file_url && (
                          <a
                            href={doc.file_url}
                            download
                            className="inline-flex items-center gap-2"
                          >
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                              Скачать
                            </Button>
                          </a>
                        )}
                        <Link href={ROUTES.DOCUMENT(doc.slug)}>
                          <Button variant="outline" size="sm">
                            Подробнее
                            <ArrowRight className="ml-1 h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
