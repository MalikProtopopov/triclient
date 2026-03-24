"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, useParams } from "next/navigation";

import {
  useDoctors,
  useCities,
  useCityBySlug,
  DoctorCard,
} from "@/entities/doctor";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import {
  Input,
  DropdownSelect,
  Button,
  SkeletonCard,
  EmptyState,
} from "@/shared/ui";
import { useDebouncedValue } from "@/shared/lib/useDebouncedValue";
import { ROUTES } from "@/shared/config";

const PER_PAGE = 12;

function DoctorsByCityContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const citySlug = typeof params.citySlug === "string" ? params.citySlug : "";

  const specFromUrl =
    searchParams.get("specialization") ?? searchParams.get("search") ?? "";
  const [search, setSearch] = useState(specFromUrl);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search, 300);

  const { data: city, isLoading: cityLoading, isError: cityError } = useCityBySlug(citySlug);
  const { data: citiesData } = useCities({ withDoctors: true });
  const { data: doctorsData, isLoading: doctorsLoading } = useDoctors({
    city_slug: citySlug || undefined,
    specialization:
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
    const urlParams = new URLSearchParams();
    if (debouncedSearch) urlParams.set("specialization", debouncedSearch);
    const qs = urlParams.toString();
    const target = `${ROUTES.DOCTORS_CITY(citySlug)}${qs ? `?${qs}` : ""}`;
    router.replace(target, { scroll: false });
  }, [citySlug, debouncedSearch, router]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setPage(1);
    },
    [],
  );

  const handleCityChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newSlug = e.target.value;
      if (!newSlug) {
        router.push(ROUTES.DOCTORS);
        return;
      }
      router.push(
        debouncedSearch && debouncedSearch.length >= 2
          ? `${ROUTES.DOCTORS_CITY(newSlug)}?specialization=${encodeURIComponent(debouncedSearch)}`
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

  const isLoading = cityLoading || doctorsLoading;

  if (cityError || (!cityLoading && !city)) {
    return (
      <div className="flex min-h-screen flex-col bg-bg">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-text-primary">
              Город не найден
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              Проверьте ссылку или выберите город из списка
            </p>
            <Link
              href={ROUTES.DOCTORS_CITIES}
              className="mt-4 inline-block text-accent hover:underline"
            >
              ← Все города
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
              Трихологи в {city?.name ?? "..."}
            </h1>
            <p className="mt-3 max-w-xl text-text-secondary">
              Врачи-трихологи — члены ассоциации в выбранном городе
            </p>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <Link
              href={ROUTES.DOCTORS}
              className="text-sm text-text-secondary transition-colors hover:text-accent"
            >
              ← Все врачи
            </Link>
            <span className="text-text-muted">·</span>
            <Link
              href={ROUTES.DOCTORS_CITIES}
              className="text-sm text-text-secondary transition-colors hover:text-accent"
            >
              По городам
            </Link>
          </div>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Input
                placeholder="Поиск по специализации..."
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
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <EmptyState
              title="Врачи не найдены"
              description="Попробуйте изменить параметры поиска или выберите другой город"
              action={{
                label: "Все города",
                onClick: () => router.push(ROUTES.DOCTORS_CITIES),
              }}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
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
                    onClick={() =>
                      setPage((p) => Math.min(totalPages, p + 1))
                    }
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

export default function DoctorsByCityClient() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col bg-bg">
          <Header />
          <main className="flex-1">
            <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-12">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
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
      <DoctorsByCityContent />
    </Suspense>
  );
}
