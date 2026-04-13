import fs from "node:fs";
import path from "node:path";

function readLaunchRun() {
  try {
    const file = path.join(process.cwd(), ".lumora_launch_run");
    const raw = fs.readFileSync(file, "utf8");
    const lines = raw.split("\n").filter(Boolean);

    const map = Object.fromEntries(
      lines.map((line) => {
        const idx = line.indexOf("=");
        return [line.slice(0, idx), line.slice(idx + 1)];
      })
    );

    return {
      lastCompletedStep: Number(map.LUMORA_LAUNCH_LAST_COMPLETED_STEP ?? 0),
      totalSteps: Number(map.LUMORA_LAUNCH_TOTAL_STEPS ?? 111),
      phase: map.LUMORA_LAUNCH_PHASE ?? "UNKNOWN",
      status: map.LUMORA_LAUNCH_STATUS ?? "UNKNOWN",
    };
  } catch {
    return {
      lastCompletedStep: 0,
      totalSteps: 111,
      phase: "UNKNOWN",
      status: "MISSING",
    };
  }
}

export default function ProgressPage() {
  const run = readLaunchRun();
  const percent = run.totalSteps > 0 ? Math.round((run.lastCompletedStep / run.totalSteps) * 100) : 0;

  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <section style={{ maxWidth: 900, margin: "0 auto" }}>
        <p style={{ opacity: 0.7, marginBottom: 8 }}>Lumora Progress</p>
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>Launch Progress</h1>
        <p style={{ fontSize: 16, opacity: 0.85, marginBottom: 24 }}>
          Current execution state for the locked 111-step launch run.
        </p>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 18,
            padding: 18,
            marginBottom: 18,
          }}
        >
          <div data-progress-last-step>Last Completed Step: {run.lastCompletedStep}</div>
          <div data-progress-total-steps>Total Steps: {run.totalSteps}</div>
          <div data-progress-phase>Phase: {run.phase}</div>
          <div data-progress-status>Status: {run.status}</div>
          <div data-progress-percent>Progress: {percent}%</div>
        </div>

        <div
          style={{
            width: "100%",
            height: 16,
            borderRadius: 999,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div
            data-progress-bar
            style={{
              width: `${percent}%`,
              height: "100%",
            }}
          />
        </div>
      </section>
    </main>
  );
}
