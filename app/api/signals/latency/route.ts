import { guardedJson } from "@/lib/api/guardedJson";
import { getIngestionLatencyReport } from "@/lib/signals/diagnostics/latency";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limitRaw = Number(searchParams.get("limit") || "1");
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(5, limitRaw)) : 1;

  const report = await getIngestionLatencyReport(limit);
  const allWithinThreshold = report.every((item) => item.withinThreshold);

  return guardedJson("api.signals.latency", {
    ok: true,
    limit,
    allWithinThreshold,
    providers: report,
    ts: Date.now(),
  });
}
