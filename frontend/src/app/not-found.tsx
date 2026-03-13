import Link from "next/link";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <p className="mb-2 text-6xl font-bold text-accent">404</p>
        <h1 className="mb-4 font-heading text-2xl font-semibold text-text-primary">
          Страница не найдена
        </h1>
        <p className="mb-8 max-w-md text-text-secondary">
          Возможно, она была удалена или вы перешли по неверной ссылке.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast transition-colors hover:bg-accent/90"
        >
          На главную
        </Link>
      </main>
      <Footer />
    </div>
  );
}
