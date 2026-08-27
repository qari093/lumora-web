import { NextResponse } from "next/server";

type Portal = "video" | "live" | "nexa" | "movies" | "music";

const PORTALS: Portal[] = ["video", "live", "nexa", "movies", "music"];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const base =
    url.searchParams.get("base") ||
    (process.env.NEXT_PUBLIC_BASE_URL
      ? process.env.NEXT_PUBLIC_BASE_URL
      : "http://127.0.0.1:3000");

  const results: Record<string, any> = {};

  // We only report intended endpoints. No internal fetches by default to avoid boot loops.
  // If you ever want live checks, we can add a guarded ?probe=1 in a later step.
  for (const p of PORTALS) {
    results[p] = {
      healthPath: `/api/${p}/health`,
      status: "registered",
      activationState: "not_asserted",
        probed: false,
    };
  }

  return NextResponse.json({
    ok: true,
    base,
    portals: results,
    note: "Configured health paths only. Endpoint availability, product activation, and content readiness are not asserted without probing.",
    ts: Date.now(),
  });
}
