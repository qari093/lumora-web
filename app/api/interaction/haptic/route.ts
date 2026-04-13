import { hapticFeedback } from "@/lib/interaction/haptic/engine";
export const dynamic = "force-dynamic";
export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: hapticFeedback(),
    ts: Date.now()
  }), { headers: { "content-type": "application/json" } });
}
