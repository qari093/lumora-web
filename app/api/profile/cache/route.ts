import { getPersonalizationCache } from "@/lib/profile/cache/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: getPersonalizationCache(),
    ts: Date.now()
  }), {
    headers: { "content-type": "application/json" }
  });
}
