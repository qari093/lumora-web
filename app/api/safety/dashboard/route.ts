import { guardedJson } from "@/lib/api/guardedJson";
import { getModerationDashboard } from "@/lib/safety/dashboard/moderationDashboard";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await getModerationDashboard();

  return guardedJson("api.safety.dashboard", {
    ok: true,
    snapshot,
    ts: Date.now(),
  });
}
