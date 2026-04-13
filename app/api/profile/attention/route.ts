import { captureAttentionTrace } from "@/lib/profile/attention/trace";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    { ok: true, data: captureAttentionTrace(), ts: Date.now() },
    { headers: { "cache-control": "no-store, must-revalidate" } }
  );
}
