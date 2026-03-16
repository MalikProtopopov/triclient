import { connection } from "next/server";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  await connection();
  return <HomeClient />;
}
