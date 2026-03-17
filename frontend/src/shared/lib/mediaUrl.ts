/**
 * Derives event status from event_date when backend does not return status.
 */
export function deriveEventStatus(eventDate: string): "upcoming" | "past" {
  return new Date(eventDate) >= new Date() ? "upcoming" : "past";
}
