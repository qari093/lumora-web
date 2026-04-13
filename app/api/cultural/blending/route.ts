import { culturalBlending } from "@/lib/cultural/blending/engine";
export const dynamic = "force-dynamic";
export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: culturalBlending(),
    ts: Date.now()
  }), { headers: { "content-type": "application/json" } });
}
