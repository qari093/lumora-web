import { NextResponse } from "next/server";
import { ALL_SOURCE_ADAPTERS } from "@/src/lib/content/adapters/allAdapters";
import { isMultiSourceFypEnabled } from "@/src/lib/content/fyp/multiSourceFlags";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const ids = ALL_SOURCE_ADAPTERS.map((adapter) => adapter.id);

  return NextResponse.json({
    ok: true,
    enabled: isMultiSourceFypEnabled(),
    sourceCount: ALL_SOURCE_ADAPTERS.length,
    sources: ids,
    rejectedRestrictedSources: ["cern", "open-planet"],
  });
}
