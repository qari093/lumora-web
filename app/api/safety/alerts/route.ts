import { guardedJson } from "@/lib/api/guardedJson";
import {
  readModerationAlertStore,
  refreshModerationAlerts,
} from "@/lib/safety/alerts/moderationAlerts";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get("mode") || "read").trim();

  if (mode === "refresh") {
    const store = await refreshModerationAlerts();
    return guardedJson("api.safety.alerts", {
      ok: true,
      mode: "refresh",
      count: store.alerts.length,
      updatedAt: store.updatedAt,
      alerts: store.alerts,
      ts: Date.now(),
    });
  }

  const store = await readModerationAlertStore();
  return guardedJson("api.safety.alerts", {
    ok: true,
    mode: "read",
    count: store.alerts.length,
    updatedAt: store.updatedAt,
    alerts: store.alerts,
    ts: Date.now(),
  });
}
