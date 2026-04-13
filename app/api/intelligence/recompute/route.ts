import { guardedJson } from "@/lib/api/guardedJson";
import {
  getSchedulerRuntime,
  readRecomputeState,
  runRecomputeNow,
  startRecomputeScheduler,
  stopRecomputeScheduler,
} from "@/lib/intelligence/scheduler/recomputeScheduler";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get("mode") || "status").trim();
  const intervalRaw = Number(searchParams.get("intervalMs") || "300000");
  const intervalMs = Number.isFinite(intervalRaw) ? intervalRaw : 300000;

  if (mode === "run") {
    const run = await runRecomputeNow();
    return guardedJson("api.intelligence.recompute", {
      ok: run.ok,
      mode: "run",
      run,
      runtime: getSchedulerRuntime(),
      ts: Date.now(),
    });
  }

  if (mode === "start") {
    const state = await startRecomputeScheduler(intervalMs);
    return guardedJson("api.intelligence.recompute", {
      ok: true,
      mode: "start",
      state,
      runtime: getSchedulerRuntime(),
      ts: Date.now(),
    });
  }

  if (mode === "stop") {
    const state = await stopRecomputeScheduler();
    return guardedJson("api.intelligence.recompute", {
      ok: true,
      mode: "stop",
      state,
      runtime: getSchedulerRuntime(),
      ts: Date.now(),
    });
  }

  const state = await readRecomputeState();
  return guardedJson("api.intelligence.recompute", {
    ok: true,
    mode: "status",
    state,
    runtime: getSchedulerRuntime(),
    ts: Date.now(),
  });
}
