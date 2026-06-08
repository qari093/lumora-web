import { productionDebugGate } from "@/src/lib/runtime-guards/productionDebugGate";
import { NextResponse } from "next/server";
import { getNexaDiag } from "@/lib/nexa/diag";
import { rateLimitHeaders } from "@/lib/nexa/rl";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function GET() {
  const payload = getNexaDiag();
  return NextResponse.json(payload, {
    status: 200,
    headers: {
      "cache-control": "no-store, max-age=0",
      "x-nexa-diag": "1",
      ...rateLimitHeaders(),
    },
  });
}
