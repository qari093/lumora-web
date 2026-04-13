import { trendSplicing } from "@/lib/cultural/splicing/engine";
export const dynamic = "force-dynamic";
export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: trendSplicing(),
    ts: Date.now()
  }), { headers: { "content-type": "application/json" } });
}
