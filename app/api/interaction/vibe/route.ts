import { vibeCheck } from "@/lib/interaction/vibe/engine";
export const dynamic = "force-dynamic";
export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: vibeCheck(),
    ts: Date.now()
  }), { headers: { "content-type": "application/json" } });
}
