import { buildReplayWindow } from "@/lib/fomo/replay/window";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: buildReplayWindow(),
    ts: Date.now()
  }), {
    headers: { "content-type": "application/json" }
  });
}
