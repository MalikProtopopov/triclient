import { connection } from "next/server";
import EventsClient from "./EventsClient";

export default async function EventsPage() {
  await connection();
  return <EventsClient />;
}
