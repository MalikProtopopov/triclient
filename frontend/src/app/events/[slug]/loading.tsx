import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { SkeletonCard } from "@/shared/ui";

export default function EventLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 lg:px-8">
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-border/40" />
        <div className="mb-8 h-64 w-full animate-pulse rounded-xl bg-border/40" />
        <div className="mb-2 h-8 w-3/4 animate-pulse rounded bg-border/40" />
        <div className="mb-2 h-4 w-48 animate-pulse rounded bg-border/40" />
        <div className="mb-8 h-4 w-36 animate-pulse rounded bg-border/40" />
        <div className="mb-10 space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-border/40" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-border/40" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-border/40" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </main>
      <Footer />
    </div>
  );
}
