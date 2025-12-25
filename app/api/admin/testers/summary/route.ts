import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { requireAdmin } from "@/app/_lib/admin/adminAuth";

export const dynamic = "force-dynamic";

type TelemetryRow = {
  testerId: string;
  ts: number;
  type: string;
  path?: string;
  dur_ms?: number;
};

function readNdjson(filePath: string): any[] {
  try {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, "utf8");
    return raw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        try {
          return JSON.parse(l);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.res;

  const base = process.cwd();
  const telePath = path.join(base, ".lumora_telemetry", "telemetry.ndjson");

  const rows = readNdjson(telePath) as TelemetryRow[];

  // Aggregate
  const byTester = new Map<string, { testerId: string; events: number; lastTs: number; pages: Record<string, number> }>();
  for (const r of rows) {
    if (!r || typeof r.testerId !== "string") continue;
    const t = byTester.get(r.testerId) ?? { testerId: r.testerId, events: 0, lastTs: 0, pages: {} };
    t.events += 1;
    t.lastTs = Math.max(t.lastTs, typeof r.ts === "number" ? r.ts : 0);
    if (r.type === "route_view" && typeof r.path === "string") {
      t.pages[r.path] = (t.pages[r.path] || 0) + 1;
    }
    byTester.set(r.testerId, t);
  }

  const testers = Array.from(byTester.values()).sort((a, b) => b.lastTs - a.lastTs).slice(0, 200);

  return NextResponse.json({
    ok: true,
    mode: auth.mode,
    telemetryFile: fs.existsSync(telePath) ? ".lumora_telemetry/telemetry.ndjson" : null,
    totals: {
      testers: byTester.size,
      events: rows.length,
    },
    testers,
  });
}
