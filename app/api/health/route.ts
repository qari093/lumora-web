import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "lumora-web",
      status: "healthy",
      ts: Date.now(),
      env: process.env.NEXT_PUBLIC_APP_ENV || "development",
      node: process.version,
    },
    {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
      },
    }
  );
}
