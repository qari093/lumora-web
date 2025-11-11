#!/usr/bin/env bash
# Step 25.7 — LumaSpace debug dashboard page
set -euo pipefail

ROOT="${LUMORA_ROOT:-$HOME/lumora-web}"
cd "$ROOT" || { echo "❌ Project not found at $ROOT"; exit 1; }

mkdir -p app/lumaspace/debug logs

# ─────────────────────────────────────────
# COMPLETE CODE — /lumaspace/debug page
# ─────────────────────────────────────────
cat >app/lumaspace/debug/page.tsx <<'TS'
"use client";

import { useEffect, useState } from "react";

type LumaSpaceMode = "demo" | "beta" | "live";

interface LumaSpaceSection {
  id: string;
  label: string;
  enabled: boolean;
  weight: number;
}

interface LumaSpaceStatePayload {
  ok: boolean;
  mode: LumaSpaceMode;
  version: string;
  updatedAt: string;
  sections: LumaSpaceSection[];
}

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; payload: LumaSpaceStatePayload };

export default function LumaSpaceDebugPage() {
  const [state, setState] = useState<FetchState>({ status: "idle" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    fetch("/api/lumaspace/state", {
      method: "GET",
      headers: { "accept": "application/json" },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(
            `HTTP ${res.status} ${res.statusText || ""} ${text}`.trim()
          );
        }
        return res.json();
      })
      .then((json: LumaSpaceStatePayload) => {
        if (cancelled) return;
        if (!json || typeof json !== "object" || !("ok" in json)) {
          throw new Error("Invalid LumaSpace state payload");
        }
        setState({ status: "ready", payload: json });
      })
      .catch((err: any) => {
        if (cancelled) return;
        const msg = err?.message ?? String(err);
        setState({ status: "error", error: msg });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const title = "LumaSpace Debug State";

  return (
    <main className="min-h-screen bg-black text-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-6 border-b border-slate-800 pb-4">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-slate-400">
            Live view of <code className="font-mono">/api/lumaspace/state</code>{" "}
            for debugging and integration.
          </p>
        </header>

        {state.status === "loading" && (
          <section className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-300">Loading LumaSpace state…</p>
          </section>
        )}

        {state.status === "error" && (
          <section className="rounded-lg border border-rose-900 bg-rose-950/60 p-4">
            <h2 className="text-sm font-semibold text-rose-200">
              State fetch failed
            </h2>
            <p className="mt-1 text-xs text-rose-300 break-all">
              {state.error}
            </p>
          </section>
        )}

        {state.status === "ready" && (
          <section className="space-y-4">
            <div className="rounded-lg border border-emerald-900 bg-emerald-950/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-300">
                    LumaSpace Mode
                  </p>
                  <p className="text-lg font-semibold text-emerald-100">
                    {state.payload.mode.toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-emerald-300">
                    Version {state.payload.version}
                  </p>
                  <p className="text-[11px] text-emerald-200/80">
                    Updated:{" "}
                    {new Date(state.payload.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
              <h2 className="text-sm font-semibold text-slate-100">
                Sections
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Controlled by <code className="font-mono">/api/lumaspace/state</code>.
              </p>

              <div className="mt-3 space-y-2">
                {state.payload.sections.map((section) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between rounded-md border border-slate-800/80 bg-slate-950/80 px-3 py-2 text-xs"
                  >
                    <div>
                      <p className="font-medium text-slate-50">
                        {section.label}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        id:{" "}
                        <code className="font-mono text-[11px]">
                          {section.id}
                        </code>
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold " +
                          (section.enabled
                            ? "bg-emerald-900/70 text-emerald-200 border border-emerald-700/70"
                            : "bg-slate-900 text-slate-300 border border-slate-700/70")
                        }
                      >
                        {section.enabled ? "ENABLED" : "DISABLED"}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        weight: {section.weight.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <details className="rounded-lg border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-300">
              <summary className="cursor-pointer text-[11px] font-semibold text-slate-200">
                Raw payload
              </summary>
              <pre className="mt-2 max-h-80 overflow-auto rounded bg-black/60 p-2 text-[11px] leading-snug">
                {JSON.stringify(state.payload, null, 2)}
              </pre>
            </details>
          </section>
        )}

        {state.status === "idle" && (
          <p className="text-sm text-slate-400">
            Waiting to load LumaSpace state…
          </p>
        )}
      </div>
    </main>
  );
}
TS

# ─────────────────────────────────────────
# INTEGRATION NOTES — smoke check page
# ─────────────────────────────────────────
LOG_FILE="logs/phase25.step7.lumaspace-debug.log"
PORT="${PORT:-3000}"

echo "Step 25.7 — LumaSpace debug page integration (PORT=$PORT)" | tee "$LOG_FILE"

# Assume dev server already running from previous steps; no restart to avoid churn.
URL="http://127.0.0.1:$PORT/lumaspace/debug"
echo "Checking $URL" | tee -a "$LOG_FILE"

if curl -fsS -D /tmp/phase25.step7.hdr.$$ -o /tmp/phase25.step7.body.$$ "$URL" 2>>"$LOG_FILE"; then
  head -n 8 /tmp/phase25.step7.hdr.$$ | tee -a "$LOG_FILE"
  echo "--- body preview ---" | tee -a "$LOG_FILE"
  head -c 260 /tmp/phase25.step7.body.$$ 2>/dev/null | tee -a "$LOG_FILE"
  echo | tee -a "$LOG_FILE"
else
  echo "Request failed for $URL (see log)" | tee -a "$LOG_FILE"
fi

rm -f /tmp/phase25.step7.hdr.$$ /tmp/phase25.step7.body.$$ 2>/dev/null || true

# ─────────────────────────────────────────
# OPTIMIZATION RECOMMENDATIONS — log only
# ─────────────────────────────────────────
echo "" | tee -a "$LOG_FILE"
echo "Optimization notes:" | tee -a "$LOG_FILE"
echo "- Later: gate /lumaspace/debug behind admin/dev guard or feature flag." | tee -a "$LOG_FILE"
echo "- Optionally read state via server component + RSC for lower client work." | tee -a "$LOG_FILE"

echo "Step 25.7 — done"
