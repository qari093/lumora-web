import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  // Guard is client-local; server exposes policy only
  return NextResponse.json(
    {
      ok: true,
      policy: {
        persistOn: ["skipped", "timed_out"],
        key: "lumora:splash_guard:v1",
        behavior: "If user skipped or device timed out last launch, next cold-start bypasses splash."
      }
    },
    { status: 200 }
  );
}
