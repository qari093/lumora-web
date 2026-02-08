import { readNexaOpsSnapshot } from "@/lib/nexa/ops_snapshot";

export const dynamic = "force-dynamic";

function fmt(x: any) {
  try { return JSON.stringify(x, null, 2); } catch { return String(x); }
}

export default async function NexaOpsPage() {
  const snap = await readNexaOpsSnapshot();

  return (
    <main style={{ padding: 18, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>
      <h1 style={{ fontSize: 18, marginBottom: 10 }}>NEXA Ops Snapshot</h1>
      <p style={{ margin: "0 0 8px 0", opacity: 0.8 }}>
        Path: <code>{snap.source}</code>
      </p>
      <p style={{ margin: "0 0 14px 0", opacity: 0.8 }}>
        Status:{" "}
        <b style={{ color: snap.ok ? "inherit" : "crimson" }}>
          {snap.ok ? "OK" : "MISSING/ERROR"}
        </b>{" "}
        · ts={snap.ts}
      </p>

      {!snap.ok ? (
        <div style={{ border: "1px solid rgba(255,0,0,.35)", padding: 12, borderRadius: 10 }}>
          <p style={{ margin: 0 }}>
            No snapshot available yet. Generate it with:
          </p>
          <pre style={{ margin: "10px 0 0 0", whiteSpace: "pre-wrap" }}>
            {`PORT=3040 OUT=/tmp/lumora_nexa_ops.json sh scripts/nexa/export_ops_json.sh`}
          </pre>
          <p style={{ margin: "10px 0 0 0", opacity: 0.85 }}>
            error: <code>{snap.error}</code>
          </p>
        </div>
      ) : (
        <pre style={{ fontSize: 12, lineHeight: 1.35, padding: 12, borderRadius: 10, border: "1px solid rgba(255,255,255,.12)", overflow: "auto" }}>
          {fmt(snap.data)}
        </pre>
      )}

      <div style={{ marginTop: 14, opacity: 0.8, fontSize: 12 }}>
        Tip: run <code>PORT=3040 OUT=/tmp/lumora_nexa_ops.json sh scripts/nexa/ops_bundle_v2.sh</code> to refresh.
      </div>
    </main>
  );
}
