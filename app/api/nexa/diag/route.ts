import { NextResponse } from "next/server";
import { getNexaDiag } from "@/lib/nexa/diag";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function GET() {
  const payload = getNexaDiag();
  return NextResponse.json(payload, {
    status: 200,
    headers: {
      "cache-control": "no-store, max-age=0",
      "x-nexa-diag": "1",
    },
  });
}
