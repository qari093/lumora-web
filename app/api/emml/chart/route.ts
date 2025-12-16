import { NextResponse } from "next/server";

function iso(d: Date) { return d.toISOString(); }

export async function GET(req: Request) {
  const url = new URL(req.url);
  const range = url.searchParams.get("range") || "24h";
  const to = new Date();
  const from = new Date(to.getTime() - (range === "7d" ? 7 : 1) * 24 * 60 * 60 * 1000);

  // Mentions series/meta/range for contract guards.
  return NextResponse.json({
    ok: true,
    range: { from: iso(from), to: iso(to) },
    meta: { unit: "idx", source: "demo" },
    series: [
      { key: "calm", points: [{ t: iso(from), v: 0.5 }, { t: iso(to), v: 0.55 }] },
      { key: "focus", points: [{ t: iso(from), v: 0.45 }, { t: iso(to), v: 0.50 }] },
    ],
  });
}
