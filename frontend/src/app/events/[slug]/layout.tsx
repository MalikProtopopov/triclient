import type { Metadata } from "next";

import { serverFetch } from "@/shared/lib/serverFetch";
import { buildMetadata } from "@/shared/lib/seo";
import type { EventResponseSchema } from "@/entities/event";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await serverFetch<EventResponseSchema>(`/api/v1/events/${slug}`);
  if (!event) return { title: "Мероприятие не найдено" };

  return buildMetadata(event.seo ?? null, {
    title: event.title,
    description: event.description?.replace(/<[^>]+>/g, "").slice(0, 160) ?? "",
  });
}

export default function EventLayout({ children }: Props) {
  return children;
}
