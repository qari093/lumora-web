import { buildInterestGraph } from "@/lib/profile/interests/graph";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    { ok: true, data: buildInterestGraph(), ts: Date.now() },
    { headers: { "cache-control": "no-store, must-revalidate" } }
  );
}
