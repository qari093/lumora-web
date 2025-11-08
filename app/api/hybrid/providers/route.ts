import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  const cfg = {
    emoji: {
      default: process.env.HYBRID_EMOJI_DEFAULT || "local",
      providers: (process.env.HYBRID_EMOJI_PROVIDERS || "local").split(",").map(s=>s.trim()).filter(Boolean),
    },
    avatar: {
      default: process.env.HYBRID_AVATAR_DEFAULT || "local",
      providers: (process.env.HYBRID_AVATAR_PROVIDERS || "local").split(",").map(s=>s.trim()).filter(Boolean),
    },
    flags: {
      freeDaily: Number(process.env.HYBRID_FREE_DAILY || 0),
      rollover:  (process.env.HYBRID_CREDITS_ROLLOVER || "0") === "1",
      mirrorAI:  Boolean(process.env.MIRRORAI_API_KEY),
      renderX:   Boolean(process.env.RENDERX_API_KEY),
    }
  };
  return NextResponse.json({ ok:true, cfg });
}
