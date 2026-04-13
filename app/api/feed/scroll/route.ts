import { getInfiniteScrollState } from "@/lib/feed/scroll/engine";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: getInfiniteScrollState(),
    ts: Date.now()
  }), {
    headers: { "content-type": "application/json" }
  });
}
