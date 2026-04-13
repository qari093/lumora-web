import { NextResponse } from "next/server";
import { validateEnv } from "@/lib/env/validateEnv";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = validateEnv();

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": "no-store, must-revalidate",
    },
    status: result.ok ? 200 : 500,
  });
}
