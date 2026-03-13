import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { SkeletonCard } from "@/shared/ui";

export default function DoctorLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8 lg:py-12">
          <div className="mb-6 h-4 w-24 animate-pulse rounded bg-border/40" />
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
            <div className="h-32 w-32 shrink-0 animate-pulse rounded-full bg-border/40 sm:h-40 sm:w-40" />
            <div className="flex-1 space-y-4">
              <div className="h-8 w-64 animate-pulse rounded bg-border/40" />
              <div className="h-4 w-40 animate-pulse rounded bg-border/40" />
              <div className="h-4 w-28 animate-pulse rounded bg-border/40" />
            </div>
          </div>
          <div className="mt-10 space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
