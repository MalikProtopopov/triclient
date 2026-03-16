"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Download } from "lucide-react";

import { useDocument } from "@/entities/document";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Button, DocumentContentBlockRenderer } from "@/shared/ui";
import { ROUTES } from "@/shared/config";

export default function DocumentDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: doc, isLoading, error } = useDocument(slug);

  if (isLoading || !doc) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <Header />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 lg:px-8">
          <div className="mb-6 h-6 w-48 animate-pulse rounded bg-border-light" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-border-light" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-border-light" />
            <div className="h-64 animate-pulse rounded-xl bg-border-light" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <Header />
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 lg:px-8">
          <p className="text-error">Документ не найден</p>
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
          href={ROUTES.DOCUMENTS}
          className="mb-6 inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-accent"
        >
          ← Все документы
        </Link>

        <h1 className="mb-6 font-heading text-3xl font-semibold text-text-primary">
          {doc.title}
        </h1>

        {doc.content && (
          <div
            className="prose max-w-none prose-headings:font-heading prose-headings:text-text-primary prose-p:text-text-secondary mb-8"
            dangerouslySetInnerHTML={{ __html: doc.content }}
          />
        )}

        {doc.file_url && (
          <div className="mb-8">
            <a href={doc.file_url} download className="inline-flex items-center gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Скачать документ
              </Button>
            </a>
          </div>
        )}

        <DocumentContentBlockRenderer blocks={doc.content_blocks ?? []} />
      </main>
      <Footer />
    </div>
  );
}
