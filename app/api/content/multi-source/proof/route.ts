import { NextResponse } from "next/server";
import { ALL_SOURCE_ADAPTERS } from "@/src/lib/content/adapters/allAdapters";
import { buildRuntimeMultiSource } from "@/src/lib/content/runtime/buildRuntimeMultiSource";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const runtime = await buildRuntimeMultiSource();
  const sources = ALL_SOURCE_ADAPTERS.map((adapter) => adapter.id);

  return NextResponse.json({
    ok: true,
    totalAdapters: sources.length,
    sources,
    rawCount: runtime.rawCount,
    acceptedCount: runtime.acceptedCount,
    rejectedCount: runtime.rejectedCount,
    rejectedRestrictedSources: ["cern", "open-planet"],
  });
}
