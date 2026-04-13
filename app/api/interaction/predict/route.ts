import { predictionSystem } from "@/lib/interaction/predict/engine";
export const dynamic = "force-dynamic";
export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: predictionSystem(),
    ts: Date.now()
  }), { headers: { "content-type": "application/json" } });
}
