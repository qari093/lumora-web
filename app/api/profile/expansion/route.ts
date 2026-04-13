import { buildTasteExpansion } from "@/lib/profile/expansion/engine";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    data: buildTasteExpansion(),
    ts: Date.now()
  }), {
    headers: { "content-type": "application/json" }
  });
}
