import CitiesClient from "./CitiesClient";

export const metadata = {
  title: "Трихологи по городам | Ассоциация трихологов",
  description:
    "Список городов, в которых работают трихологи — члены Ассоциации трихологов. Выберите город, чтобы увидеть специалистов рядом с вами.",
};

export default function CitiesPage() {
  return <CitiesClient />;
}
