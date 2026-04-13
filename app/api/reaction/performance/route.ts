import { validateReactionPerformance } from "@/lib/reaction/performance/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    { ok: true, data: validateReactionPerformance(11), ts: Date.now() },
    { headers: { "cache-control": "no-store, must-revalidate" } }
  );
}
