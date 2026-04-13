import { computeReactionVisualScale } from "@/lib/reaction/visual/scaling";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    {
      ok: true,
      data: computeReactionVisualScale({ viewerCount: 42, intensity: 0.74 }),
      ts: Date.now(),
    },
    { headers: { "cache-control": "no-store, must-revalidate" } }
  );
}
