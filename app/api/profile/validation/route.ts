import { validatePersonalizationAccuracy } from "@/lib/profile/validation/accuracy";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: validatePersonalizationAccuracy(),
    ts: Date.now()
  }), {
    headers: { "content-type": "application/json" }
  });
}
