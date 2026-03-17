"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Loader2 } from "lucide-react";

function ConfirmEmailRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      router.replace(`/auth/verify-email?token=${encodeURIComponent(token)}`);
    } else {
      router.replace("/auth/verify-email");
    }
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />
      <main className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </main>
      <Footer />
    </div>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col bg-bg">
          <Header />
          <main className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </main>
          <Footer />
        </div>
      }
    >
      <ConfirmEmailRedirect />
    </Suspense>
  );
}
