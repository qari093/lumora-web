import { buildCountdownTrigger } from "@/lib/fomo/countdown/triggers";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: buildCountdownTrigger(),
    ts: Date.now()
  }), {
    headers: { "content-type": "application/json" }
  });
}
