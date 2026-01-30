import { NextResponse } from "next/server";
import { ingestCineVerse } from "@/services/cineverse/ingest";

export async function POST() {
  const items = await ingestCineVerse();
  return NextResponse.json({ ok: true, items });
}
