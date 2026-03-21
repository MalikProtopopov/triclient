"use client";

import Link from "next/link";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { useCities } from "@/entities/doctor";
import { Card, SkeletonCard } from "@/shared/ui";
import { ROUTES } from "@/shared/config";

function groupCitiesByLetter(
  cities: { name: string; slug: string; doctors_count?: number }[],
) {
  const groups: Record<string, typeof cities> = {};
  for (const city of cities) {
    const letter = (city.name.charAt(0) || "?").toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(city);
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}

export default function CitiesClient() {
  const { data: cities, isLoading } = useCities({ withDoctors: true });
  const citiesList = cities ?? [];
  const groups = groupCitiesByLetter(citiesList);

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
              Трихологи по городам
            </h1>
            <p className="mt-3 max-w-xl text-text-secondary">
              Выберите город, чтобы увидеть список врачей-трихологов — членов
              ассоциации
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : groups.length === 0 ? (
            <p className="text-text-muted">Пока нет городов с врачами</p>
          ) : (
            <div className="space-y-8">
              {groups.map(([letter, letterCities]) => (
                <section key={letter}>
                  <h2 className="mb-4 font-heading text-2xl font-semibold text-text-primary">
                    {letter}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {letterCities.map((city) => (
                      <Link
                        key={city.slug}
                        href={ROUTES.DOCTORS_CITY(city.slug)}
                        className="block"
                      >
                        <Card hover className="transition-colors">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-text-primary">
                              {city.name}
                            </span>
                            {city.doctors_count != null && (
                              <span className="text-sm text-text-muted">
                                {city.doctors_count}{" "}
                                {city.doctors_count === 1 ? "врач" : "врачей"}
                              </span>
                            )}
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          <div className="mt-10">
            <Link
              href={ROUTES.DOCTORS}
              className="text-sm text-text-secondary transition-colors hover:text-accent"
            >
              ← Все врачи
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
