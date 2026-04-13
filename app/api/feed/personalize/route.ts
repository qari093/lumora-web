import { injectPersonalization } from "@/lib/feed/personalize/engine";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: injectPersonalization(),
    ts: Date.now()
  }), {
    headers: { "content-type": "application/json" }
  });
}
