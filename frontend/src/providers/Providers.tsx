"use client";

import { AuthProvider } from "./AuthProvider";
import { QueryProvider } from "./QueryProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
};
