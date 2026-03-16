import { connection } from "next/server";
import DocumentsClient from "./DocumentsClient";

export default async function DocumentsPage() {
  await connection();
  return <DocumentsClient />;
}
