"use client";

import { useEffect } from "react";

import { useAuth } from "@/providers/AuthProvider";
import { ROUTES } from "@/shared/config";

const Loader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
  </div>
);

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirect = window.location.pathname;
      window.location.replace(
        `${ROUTES.LOGIN}?redirect=${encodeURIComponent(redirect)}`,
      );
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Loader />;
  }

  return <>{children}</>;
}
