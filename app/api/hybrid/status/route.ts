import { NextResponse } from "next/server";
import { healthSnapshot } from "@/app/_modules/hybrid/providers";
import { snapshot } from "@/app/_modules/hybrid/state";

export const dynamic = "force-dynamic";

export async function GET() {
  const health = await healthSnapshot();
  const mem = snapshot();
  return NextResponse.json({
    ok: true,
    health,
    memoryCredits: mem,
    env: {
      MIRRORAI_API_KEY: Boolean(process.env.MIRRORAI_API_KEY),
      RENDERX_API_KEY: Boolean(process.env.RENDERX_API_KEY),
    },
    time: new Date().toISOString(),
  });
}
