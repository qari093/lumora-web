import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function versionGuess() {
  const raw =
    process.env.NEXT_PUBLIC_APP_VERSION ||
    process.env.APP_VERSION ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    "dev";

  return raw.replace(/\\n|\\r/g, "").trim() || "dev";
}

export async function GET() {
  return NextResponse.json(
    { ok: true, service: "lumora-web", version: versionGuess(), ts: Date.now() },
    { status: 200, headers: { "cache-control": "no-store" } }
  );
}
