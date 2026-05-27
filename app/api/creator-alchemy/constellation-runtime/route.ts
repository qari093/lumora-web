import { NextResponse } from "next/server";
import { inferRuntimeConstellation } from "@/src/core/creator-alchemy/constellation-runtime";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = inferRuntimeConstellation({
    creatorId: "demo-creator",
    toneShift: 0.45,
    audienceMutation: 0.55,
    creatorCuriosity: 0.4,
    rewatchDensity: 0.7
  });

  return NextResponse.json({ ok: true, state });
}
