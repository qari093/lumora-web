import { buildTrailerCountdown } from "@/lib/fomo/trailer/countdown";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: buildTrailerCountdown(),
    ts: Date.now()
  }), {
    headers: { "content-type": "application/json" }
  });
}
