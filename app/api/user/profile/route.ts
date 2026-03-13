import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      profile: {
        id: "launch-user",
        displayName: "Lumora User",
      },
      source: "launch-user-profile-stub",
      ts: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "X-Lumora-Sec": "1",
      },
    }
  );
}
