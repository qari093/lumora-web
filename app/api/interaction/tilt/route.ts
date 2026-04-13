import { tiltDetection } from "@/lib/interaction/tilt/engine";
export const dynamic = "force-dynamic";
export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: tiltDetection(),
    ts: Date.now()
  }), { headers: { "content-type": "application/json" } });
}
