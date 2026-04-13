import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "lumora-web",
      version: "v7.5",
      appEnv: process.env.NEXT_PUBLIC_APP_ENV || "development",
      ts: Date.now(),
    },
    {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
      },
    }
  );
}
