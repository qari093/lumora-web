import { NextResponse } from "next/server";
import {
  ingestCineVerse,
  type CineVerseItem,
} from "@/services/cineverse/ingest";

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json().catch(() => null);

    const items: CineVerseItem[] = Array.isArray(body)
      ? (body as CineVerseItem[])
      : body &&
          typeof body === "object" &&
          Array.isArray((body as { items?: unknown }).items)
        ? ((body as { items: CineVerseItem[] }).items)
        : [];

    if (items.length === 0) {
      return NextResponse.json(
        { ok: false, error: "no_cineverse_items" },
        { status: 400 },
      );
    }

    const result = ingestCineVerse(items);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "cineverse_ingest_failed",
      },
      { status: 500 },
    );
  }
}
