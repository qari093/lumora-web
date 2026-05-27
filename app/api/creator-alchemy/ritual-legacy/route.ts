import { NextResponse } from "next/server";
import {
  buildFadingLampRuntime,
  buildMemorialGardenRuntime,
  buildVoiceWillRuntime,
  decideRitualRuntime
} from "@/src/core/creator-alchemy/ritual-legacy";

export const dynamic = "force-dynamic";

export async function GET() {
  const ritual = decideRitualRuntime({
    creatorId: "demo-creator",
    type: "mirror_chamber",
    daysSinceLastShown: 365,
    creatorConsented: true,
    emotionalOverload: false
  });

  const voiceWill = buildVoiceWillRuntime({
    creatorId: "demo-creator",
    enabled: true,
    selectedWorks: ["work-1", "work-2"],
    approved: true
  });

  const memorial = buildMemorialGardenRuntime({
    creatorId: "demo-creator",
    verifiedConsent: false
  });

  const fadingLamp = buildFadingLampRuntime(false);

  return NextResponse.json({
    ok: true,
    ritual,
    voiceWill,
    memorial,
    fadingLamp
  });
}
