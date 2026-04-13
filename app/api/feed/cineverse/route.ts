import { injectCineVerseHooks } from "@/lib/feed/cineverse/engine";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: injectCineVerseHooks(),
    ts: Date.now()
  }), {
    headers: { "content-type": "application/json" }
  });
}
