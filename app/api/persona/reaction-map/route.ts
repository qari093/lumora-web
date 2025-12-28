import { NextResponse } from "next/server";
import { REACTION_MATRIX, pickReaction, pickReactionVariant, reactionCode } from "@/src/lib/persona/reactionMatrix";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMOTIONS = ["neutral","happy","sad","angry","surprised","focused","calm"] as const;
type Emotion = (typeof EMOTIONS)[number];

function safeEmotion(v: string | null): Emotion | null {
  if (!v) return null;
  return (EMOTIONS as readonly string[]).includes(v) ? (v as Emotion) : null;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const emotion = safeEmotion(url.searchParams.get("emotion"));
  const seed = url.searchParams.get("seed") || "default";
  const variant = url.searchParams.get("variant") || pickReactionVariant(seed);

  if (emotion) {
    const reaction = pickReaction(emotion, seed);
    return NextResponse.json({
      ok: true,
      emotion,
      seed,
      reaction,
      variant,
      code: reactionCode(reaction, variant),
      url: `/persona/emojis/${reactionCode(reaction, variant)}.svg`,
      recommended: REACTION_MATRIX[emotion],
    });
  }

  return NextResponse.json({ ok: true, emotions: EMOTIONS, matrix: REACTION_MATRIX });
}
