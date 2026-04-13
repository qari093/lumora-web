import { buildExclusivityLayer } from "@/lib/fomo/exclusive/layer";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: buildExclusivityLayer(),
    ts: Date.now()
  }), {
    headers: { "content-type": "application/json" }
  });
}
