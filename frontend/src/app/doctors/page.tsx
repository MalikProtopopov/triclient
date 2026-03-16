import { connection } from "next/server";
import DoctorsClient from "./DoctorsClient";

export default async function DoctorsPage() {
  await connection();
  return <DoctorsClient />;
}
