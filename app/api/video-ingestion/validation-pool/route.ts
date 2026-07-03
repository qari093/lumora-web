import { NextResponse } from "next/server";
import {
  createCanonicalVideoStoreSnapshot,
  seedValidationMediaPool,
} from "@/src/core/video-ingestion";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const seeded = seedValidationMediaPool();
    const snapshot = createCanonicalVideoStoreSnapshot();

    return NextResponse.json({
      ok: true,
      route: "/api/video-ingestion/validation-pool",
      poolSize: seeded.total,
      snapshot,
      lanes: seeded.lanes,
      purpose: "Controlled FYP + LumaSpace validation media pool",
      next: "fyp_lumaspace_runtime_smoke",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "unknown_error",
      },
      { status: 500 },
    );
  }
}
