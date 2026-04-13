import { guardedJson } from "@/lib/api/guardedJson";
import { validateScoringConsistency } from "@/lib/intelligence/validation/scoringConsistency";

export const dynamic = "force-dynamic";

export async function GET() {
  const report = await validateScoringConsistency();

  return guardedJson(
    "api.intelligence.consistency",
    {
      ok: report.ok,
      totalSignals: report.totalSignals,
      issueCount: report.issueCount,
      issues: report.issues,
      checkedAt: report.checkedAt,
      ts: Date.now(),
    },
    {
      status: report.ok ? 200 : 500,
    }
  );
}
