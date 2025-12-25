import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

function readJson(relPath: string) {
  const root = process.cwd();
  const abs = path.join(root, relPath);
  const raw = fs.readFileSync(abs, "utf8");
  return JSON.parse(raw);
}

export async function GET() {
  try {
    const motion = readJson("branding/_animation/motion_engine_selection.step15.json");
    const choreo = readJson("branding/_animation/reveal_choreography.step9.json");
    const budget = readJson("branding/_animation/frame_budget_optimization.step22.json");

    // Minimal payload for client gate (no sensitive data)
    return NextResponse.json(
      {
        ok: true,
        splash: {
          motion: motion.selection,
          timeoutMs: motion.fallback?.timeoutGuardMs ?? 2000,
          reducedMotion: motion.fallback?.reducedMotion ?? "static_png_swap",
          budgets: budget.budgets,
          caps: budget.caps,
          timing: choreo.timing,
        },
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "splash_config_read_failed" },
      { status: 500 }
    );
  }
}
