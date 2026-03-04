import { NextResponse } from "next/server";
import { SEED_MOVIES } from "@/lib/movies/catalog";

export function GET() {
  const res = NextResponse.json(
    { ok: true, ts: Date.now(), count: SEED_MOVIES.length, items: SEED_MOVIES },
    { status: 200 }
  );
  res.headers.set("cache-control", "no-store");
  res.headers.set("content-type", "application/json; charset=utf-8");
  res.headers.set("x-lumora-movies", "catalog-v1");
  return res;
}
