import { computeFeedMix } from "@/lib/profile/mix/engine";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: computeFeedMix(),
    ts: Date.now()
  }), {
    headers: { "content-type": "application/json" }
  });
}
