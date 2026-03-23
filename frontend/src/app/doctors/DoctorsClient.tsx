"use client";

import { useState, useEffect, useCallback, Suspense, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useDoctors, useCities, DoctorCard } from "@/entities/doctor";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Input, DropdownSelect, Button, SkeletonCard, EmptyState } from "@/shared/ui";
import { useDebouncedValue } from "@/shared/lib/useDebouncedValue";
import { ROUTES } from "@/shared/config";
import { useGSAP } from "@/shared/lib/useGSAP";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PER_PAGE = 12;

function DoctorsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const cityFromUrl = searchParams.get("city") ?? "";
  const citySlug = "";
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    if (cityFromUrl) {
      const target = debouncedSearch && debouncedSearch.length >= 2
        ? `${ROUTES.DOCTORS_CITY(cityFromUrl)}?search=${encodeURIComponent(debouncedSearch)}`
        : ROUTES.DOCTORS_CITY(cityFromUrl);
      router.replace(target, { scroll: false });
      return;
    }
  }, [cityFromUrl, debouncedSearch, router]);

  useEffect(() => {
    if (cityFromUrl) return;
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "/doctors", { scroll: false });
  }, [cityFromUrl, debouncedSearch, router]);

  const { data: citiesData } = useCities({ withDoctors: true });
  const { data: doctorsData, isLoading } = useDoctors({
    city_slug: citySlug || undefined,
    search:
      debouncedSearch && debouncedSearch.length >= 2
        ? debouncedSearch
        : undefined,
    limit: PER_PAGE,
    offset: (page - 1) * PER_PAGE,
  });

  const cities = citiesData ?? [];
  const doctors = doctorsData?.data ?? [];
  const total = doctorsData?.total ?? 0;
  const totalPages = Math.ceil(total / PER_PAGE);

  useEffect(() => {
    if (!gridRef.current || isLoading || doctors.length === 0) return;
    const cards = gridRef.current.querySelectorAll("[data-doctor-card]");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.06,
        ease: "power3.out",
        clearProps: "transform",
      },
    );
  }, [doctors, isLoading, page]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const handleCityChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newSlug = e.target.value;
      if (!newSlug) return;
      router.push(
        debouncedSearch && debouncedSearch.length >= 2
          ? `${ROUTES.DOCTORS_CITY(newSlug)}?search=${encodeURIComponent(debouncedSearch)}`
          : ROUTES.DOCTORS_CITY(newSlug),
      );
      setPage(1);
    },
    [debouncedSearch, router],
  );

  const cityOptions = [
    { value: "", label: "Все города" },
    ...cities
      .filter((c) => !c.doctors_count || c.doctors_count > 0)
      .map((c) => ({ value: c.slug, label: c.name })),
  ];

  const headerRef = useGSAP((_ctx, el) => {
    gsap.fromTo(
      el.querySelectorAll("[data-hero-text]"),
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" },
    );
  });

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />

      <main className="flex-1">
        <div ref={headerRef} className="border-b border-border bg-bg-secondary">
          <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-16">
            <p data-hero-text className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
              Ассоциация трихологов
            </p>
            <h1 data-hero-text className="font-heading text-4xl font-bold text-text-primary lg:text-5xl xl:text-6xl">
              Врачи — члены
              <br />
              <span className="text-accent">ассоциации</span>
            </h1>
            <p data-hero-text className="mt-4 max-w-xl text-text-secondary">
              Только верифицированные специалисты с подтверждённой квалификацией
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href={ROUTES.DOCTORS_CITIES}
              className="text-sm text-text-secondary transition-colors hover:text-accent"
            >
              По городам →
            </Link>
            {total > 0 && (
              <span className="text-sm text-text-muted">{total} специалистов</span>
            )}
          </div>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Input
                placeholder="Поиск по имени..."
                value={search}
                onChange={handleSearchChange}
              />
            </div>
            <div className="w-full sm:w-48">
              <DropdownSelect
                options={cityOptions}
                value={citySlug}
                onChange={handleCityChange}
                placeholder="Город"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <EmptyState
              title="Врачи не найдены"
              description="Попробуйте изменить параметры поиска или фильтры"
              action={{
                label: "Сбросить фильтры",
                onClick: () => {
                  setSearch("");
                  setPage(1);
                },
              }}
            />
          ) : (
            <>
              <div
                ref={gridRef}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {doctors.map((doctor, i) => (
                  <div
                    key={doctor.id}
                    data-doctor-card
                    className={
                      i === 0 && page === 1
                        ? "sm:col-span-2 sm:row-span-1 lg:col-span-2"
                        : ""
                    }
                  >
                    <DoctorCard
                      doctor={doctor}
                      featured={i === 0 && page === 1}
                    />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    Назад
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
                            page === pageNum
                              ? "bg-accent text-accent-contrast"
                              : "text-text-muted hover:bg-accent/10 hover:text-text-primary"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 5 && (
                      <span className="px-2 text-text-muted">...</span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    Вперёд
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function DoctorsClient() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col bg-bg">
          <Header />
          <main className="flex-1">
            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </div>
          </main>
          <Footer />
        </div>
      }
    >
      <DoctorsContent />
    </Suspense>
  );
}
