"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { CabinetSidebar } from "@/widgets/cabinet-sidebar";
import { cn } from "@/shared/lib";

export default function CabinetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Desktop: fixed sidebar 240px */}
      <div className="fixed left-0 top-0 z-30 hidden h-screen w-60 lg:block">
        <CabinetSidebar />
      </div>

      {/* Mobile: sidebar overlay when burger opened */}
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

      {/* Mobile burger toggle */}
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

      {/* Content area */}
      <main
        className={cn(
          "min-h-screen flex-1 p-6 pt-16 lg:ml-60 lg:pt-8 lg:px-8",
        )}
      >
        {children}
      </main>
    </div>
  );
}
