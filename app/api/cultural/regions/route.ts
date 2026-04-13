import { crossRegionMapping } from "@/lib/cultural/regions/engine";
export const dynamic = "force-dynamic";
export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: crossRegionMapping(),
    ts: Date.now()
  }), { headers: { "content-type": "application/json" } });
}
