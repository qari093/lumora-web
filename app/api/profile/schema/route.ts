import { buildUserProfile } from "@/lib/profile/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(
    { ok: true, data: buildUserProfile("user_sample_001"), ts: Date.now() },
    { headers: { "cache-control": "no-store, must-revalidate" } }
  );
}
