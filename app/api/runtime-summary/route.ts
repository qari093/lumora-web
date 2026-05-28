import { NextResponse } from "next/server";
import { getLumoraRuntimeSummary } from "@/lib/runtime/lumoraRuntimeSummary";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(getLumoraRuntimeSummary(), {
    headers: { "cache-control": "no-store" }
  });
}
