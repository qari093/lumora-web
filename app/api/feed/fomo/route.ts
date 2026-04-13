import { injectFomoContent } from "@/lib/feed/fomo/engine";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: injectFomoContent(),
    ts: Date.now()
  }), {
    headers: { "content-type": "application/json" }
  });
}
