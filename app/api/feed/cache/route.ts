import { getFeedCacheState } from "@/lib/feed/cache/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: getFeedCacheState(),
    ts: Date.now()
  }), {
    headers: { "content-type": "application/json" }
  });
}
