import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";

export default function ArticleLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 lg:px-8">
        <div className="mb-6 h-4 w-24 animate-pulse rounded bg-border/40" />
        <div className="mb-6 h-64 w-full animate-pulse rounded-xl bg-border/40" />
        <div className="mb-3 flex items-center gap-3">
          <div className="h-4 w-28 animate-pulse rounded bg-border/40" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-border/40" />
        </div>
        <div className="mb-8 h-8 w-3/4 animate-pulse rounded bg-border/40" />
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-border/40" />
          <div className="h-4 w-full animate-pulse rounded bg-border/40" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-border/40" />
          <div className="h-4 w-full animate-pulse rounded bg-border/40" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-border/40" />
          <div className="h-4 w-full animate-pulse rounded bg-border/40" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-border/40" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
