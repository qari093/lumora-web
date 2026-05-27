import { NextResponse } from "next/server";
import { buildRuntimeHealthSnapshot } from "@/src/core/creator-alchemy/health";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    health: buildRuntimeHealthSnapshot()
  });
}
