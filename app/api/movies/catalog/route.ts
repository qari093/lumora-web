import { NextResponse } from "next/server";
import { getSeedMovies, seedMoviesEnabled } from "@/lib/cineverse/seedMovies";

export const runtime = "nodejs";

export async function GET() {
  try {
    const items = getSeedMovies();
    return NextResponse.json(
      {
        ok: true,
        mode: seedMoviesEnabled() ? "seed" : "disabled",
        count: items.length,
        items,
        ts: Date.now(),
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return NextResponse.json(
      { ok: false, error: msg, ts: Date.now() },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
