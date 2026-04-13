import { rankFeed } from "@/lib/feed/ranking/engine";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: rankFeed(),
    ts: Date.now()
  }), {
    headers: { "content-type": "application/json" }
  });
}
