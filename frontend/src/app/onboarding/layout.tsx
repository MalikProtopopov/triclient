"use client";

import { RequireAuth } from "@/providers/RequireAuth";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}
