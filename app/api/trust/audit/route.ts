import { guardedJson } from "@/lib/api/guardedJson";
import {
  appendTrustAuditEvent,
  readTrustAuditStore,
} from "@/lib/trust/audit/auditLog";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get("mode") || "read").trim();

  if (mode === "seed") {
    const item = await appendTrustAuditEvent({
      type: "trust_filter_refresh",
      meta: { source: "step_054_seed" },
    });

    return guardedJson("api.trust.audit", {
      ok: true,
      mode: "seed",
      item,
      ts: Date.now(),
    });
  }

  const store = await readTrustAuditStore();
  return guardedJson("api.trust.audit", {
    ok: true,
    mode: "read",
    count: store.events.length,
    updatedAt: store.updatedAt,
    events: store.events.slice(0, 100),
    ts: Date.now(),
  });
}
