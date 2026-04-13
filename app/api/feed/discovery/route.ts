import { injectDiscoveryLayer } from "@/lib/feed/discovery/engine";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: injectDiscoveryLayer(),
    ts: Date.now()
  }), {
    headers: { "content-type": "application/json" }
  });
}
