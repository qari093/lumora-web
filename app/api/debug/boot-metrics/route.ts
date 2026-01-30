import { NextResponse } from "next/server";

export async function GET() {
  // Server cannot access client performance marks; this endpoint exists
  // to define the contract and future wiring to RUM ingestion.
  return NextResponse.json({
    ok: true,
    metrics: {
      splash_end: "performance.mark(lumora:splash_end)",
      first_interactive: "performance.mark(lumora:first_interactive)",
      boot_to_interactive: "performance.measure(lumora:boot_to_interactive)",
    },
    note: "Client-side marks available via Performance API in browser devtools.",
    ts: Date.now(),
  });
}
