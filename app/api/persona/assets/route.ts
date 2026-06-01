import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PersonaAsset = {
  id: string;
  type: "avatar" | "emoji" | "reaction" | "placeholder";
  name: string;
  src: string;
  premium: boolean;
};

const PERSONA_ASSETS: PersonaAsset[] = [
  {
    id: "neutral-avatar-001",
    type: "avatar",
    name: "Neutral Lumora Avatar",
    src: "/persona/placeholders/avatar-neutral.svg",
    premium: false,
  },
  {
    id: "calm-avatar-001",
    type: "avatar",
    name: "Calm Lumora Avatar",
    src: "/persona/placeholders/avatar-calm.svg",
    premium: false,
  },
  {
    id: "joy-emoji-001",
    type: "emoji",
    name: "Joy Pulse",
    src: "/persona/placeholders/emoji-joy.svg",
    premium: false,
  },
  {
    id: "focus-reaction-001",
    type: "reaction",
    name: "Focus Glow",
    src: "/persona/placeholders/reaction-focus.svg",
    premium: false,
  },
];

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      source: "persona_assets_manifest_v1",
      assets: PERSONA_ASSETS,
      count: PERSONA_ASSETS.length,
      note: "Manifest-only route. Large public media directories are intentionally excluded from serverless tracing.",
    },
    {
      status: 200,
      headers: {
        "cache-control": "public, max-age=3600, s-maxage=86400",
      },
    },
  );
}
