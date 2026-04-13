import { assembleFeed } from "@/lib/feed/assembler/engine";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: assembleFeed(),
    ts: Date.now()
  }), {
    headers: { "content-type": "application/json" }
  });
}
