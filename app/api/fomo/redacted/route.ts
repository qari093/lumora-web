import { buildRedactedContent } from "@/lib/fomo/redacted/system";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: buildRedactedContent(),
    ts: Date.now()
  }), {
    headers: { "content-type": "application/json" }
  });
}
