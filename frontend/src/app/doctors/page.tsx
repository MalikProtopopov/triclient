"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useDoctors, useCities, DoctorCard } from "@/entities/doctor";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Input, Select, Button, SkeletonCard, EmptyState } from "@/shared/ui";

const PER_PAGE = 12;

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function DoctorsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [citySlug, setCitySlug] = useState(searchParams.get("city") ?? "");
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    const params = new URLSearchParams();
    if (citySlug) params.set("city", citySlug);
    if (debouncedSearch) params.set("search", debouncedSearch);
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "/doctors", { scroll: false });
  }, [citySlug, debouncedSearch, router]);

  const { data: citiesData } = useCities();
  const { data: doctorsData, isLoading } = useDoctors({
    city_slug: citySlug || undefined,
    search: debouncedSearch || undefined,
    limit: PER_PAGE,
    offset: (page - 1) * PER_PAGE,
  });

  const cities = citiesData ?? [];
  const doctors = doctorsData?.data ?? [];
  const total = doctorsData?.total ?? 0;
  const totalPages = Math.ceil(total / PER_PAGE);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const handleCityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCitySlug(e.target.value);
    setPage(1);
  }, []);

  const cityOptions = [
    { value: "", label: "Все города" },
    ...cities
      .filter((c) => !c.doctors_count || c.doctors_count > 0)
      .map((c) => ({ value: c.slug, label: c.name })),
  ];

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
          <div className="mb-10">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
              Ассоциация трихологов
            </p>
            <h1 className="font-heading text-4xl font-bold text-text-primary lg:text-5xl">
              Врачи — члены ассоциации
            </h1>
            <p className="mt-3 max-w-xl text-text-secondary">
              Только верифицированные специалисты с подтверждённой квалификацией
            </p>
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
              <Select
                options={cityOptions}
                value={citySlug}
                onChange={handleCityChange}
                placeholder="Город"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                  setCitySlug("");
                  setSearch("");
                  setPage(1);
                },
              }}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {doctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    Назад
                  </Button>
                  <span className="px-4 text-sm text-text-secondary">
                    {page} из {totalPages}
                  </span>
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

export default function DoctorsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col bg-bg">
          <Header />
          <main className="flex-1">
            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
