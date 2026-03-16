import { connection } from "next/server";
import ArticlesClient from "./ArticlesClient";

export default async function ArticlesPage() {
  await connection();
  return <ArticlesClient />;
}
