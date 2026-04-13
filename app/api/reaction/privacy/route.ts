import { getReactionPrivacyGuard } from "@/lib/reaction/privacy/guard";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    { ok: true, data: getReactionPrivacyGuard(), ts: Date.now() },
    { headers: { "cache-control": "no-store, must-revalidate" } }
  );
}
