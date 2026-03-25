"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Loader2 } from "lucide-react";

import { CabinetSidebar } from "@/widgets/cabinet-sidebar";
import { RequireAuth } from "@/providers/RequireAuth";
import { cn } from "@/shared/lib";
import { useOnboardingStatus } from "@/entities/auth";
import { getOnboardingStepRoute, shouldSkipClientOnboarding } from "@/providers/AuthProvider";

function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: status, isLoading } = useOnboardingStatus();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (status && !shouldSkipClientOnboarding(status)) {
    const targetRoute = getOnboardingStepRoute(status.next_step);
    if (targetRoute !== pathname) {
      router.replace(targetRoute);
      return null;
    }
  }

  return <>{children}</>;
}

export default function CabinetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RequireAuth>
      <OnboardingGuard>
        <div className="flex min-h-screen bg-bg">
          <div className="fixed left-0 top-0 z-30 hidden h-screen w-60 lg:block">
            <CabinetSidebar />
          </div>

          {sidebarOpen && (
            <>
              <div
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
              />
              <div className="fixed left-0 top-0 z-50 h-screen w-60 lg:hidden">
                <CabinetSidebar />
              </div>
            </>
          )}

          <div className="fixed right-4 top-4 z-20 lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-bg-secondary text-text-primary transition-colors hover:bg-bg"
              aria-label="Открыть меню"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <main
            className={cn(
              "min-h-screen flex-1 p-6 pt-16 lg:ml-60 lg:pt-8 lg:px-8",
            )}
          >
            {children}
          </main>
        </div>
      </OnboardingGuard>
    </RequireAuth>
  );
}
