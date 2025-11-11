#!/usr/bin/env bash
# Step 25.9 — LumaSpace state banner component + helper tests
set -euo pipefail

ROOT="${LUMORA_ROOT:-$HOME/lumora-web}"
cd "$ROOT" || { echo "Project not found at $ROOT"; exit 1; }

mkdir -p app/_components/lumaspace tests logs

# ─────────────────────────────────────────
# COMPLETE CODE — app/_components/lumaspace/state-banner.tsx
# ─────────────────────────────────────────
cat >app/_components/lumaspace/state-banner.tsx <<'TS'
"use client";

import { useEffect, useState } from "react";

export type LumaSpaceMode = "demo" | "beta" | "live";

export interface LumaSpaceSection {
  id: string;
  label: string;
  enabled: boolean;
  weight: number;
}

export interface LumaSpaceStatePayload {
  ok: boolean;
  mode: LumaSpaceMode;
  version: string;
  updatedAt: string;
  sections: LumaSpaceSection[];
}

/**
 * Small, testable helper: maps mode → readable label.
 */
export function deriveModeLabel(mode: LumaSpaceMode): string {
  switch (mode) {
    case "demo":
      return "Demo: Preview configuration";
    case "beta":
      return "Beta: Limited release";
    case "live":
      return "Live: Production rollout";
    default:
      return "Unknown mode";
  }
}

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; payload: LumaSpaceStatePayload };

export interface LumaSpaceStateBannerProps {
  compact?: boolean;
}

export function LumaSpaceStateBanner(props: LumaSpaceStateBannerProps) {
  const { compact } = props;
  const [state, setState] = useState<FetchState>({ status: "idle" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    fetch("/api/lumaspace/state", {
      method: "GET",
      headers: { accept: "application/json" },
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
        if (!json || typeof json !== "object" || !("ok" in json) || !json.ok) {
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

  if (state.status === "idle" || state.status === "loading") {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/70 px-3 py-1 text-[11px] text-slate-300">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
        <span>LumaSpace status: loading…</span>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-rose-900 bg-rose-950/70 px-3 py-1 text-[11px] text-rose-200">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
        <span className="truncate">
          LumaSpace status error — check logs
        </span>
      </div>
    );
  }

  const payload = state.payload;
  const label = deriveModeLabel(payload.mode);

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-800 bg-emerald-950/70 px-3 py-1 text-[11px] text-emerald-100">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <span className="font-semibold uppercase tracking-[0.16em]">
          {payload.mode.toUpperCase()}
        </span>
        <span className="text-emerald-300/90">{payload.version}</span>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg border border-emerald-900 bg-emerald-950/70 px-3 py-2 text-xs text-emerald-50">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
            LUMASPACE {payload.mode.toUpperCase()}
          </span>
        </div>
        <div className="text-right text-[11px] text-emerald-200/90">
          <span>v{payload.version}</span>
          <span className="mx-1 text-emerald-500/60">•</span>
          <span>
            {new Date(payload.updatedAt).toLocaleString("de-DE", {
              hour12: false,
            })}
          </span>
        </div>
      </div>
      <p className="mt-1 text-[11px] text-emerald-100/95">{label}</p>
      <p className="mt-0.5 text-[10px] text-emerald-200/80">
        Active modules:{" "}
        {payload.sections
          .filter((s) => s.enabled)
          .map((s) => s.label)
          .join(", ") || "none"}
      </p>
    </div>
  );
}
TS

# ─────────────────────────────────────────
# TESTS — tests/lumaspace.state-banner.util.spec.ts
# ─────────────────────────────────────────
cat >tests/lumaspace.state-banner.util.spec.ts <<'TS'
import { deriveModeLabel } from "../app/_components/lumaspace/state-banner";

describe("deriveModeLabel", () => {
  it("returns a descriptive label for demo mode", () => {
    expect(deriveModeLabel("demo")).toMatch(/Demo/i);
  });

  it("returns a descriptive label for beta mode", () => {
    expect(deriveModeLabel("beta")).toMatch(/Beta/i);
  });

  it("returns a descriptive label for live mode", () => {
    expect(deriveModeLabel("live")).toMatch(/Live/i);
  });
});
TS

# ─────────────────────────────────────────
# INTEGRATION NOTES — log usage + optional type-check
# ─────────────────────────────────────────
LOG_FILE="logs/phase25.step9.lumaspace-banner.log"
echo "Step 25.9 — LumaSpace state banner component created" | tee "$LOG_FILE"
echo "Usage: import { LumaSpaceStateBanner } from \"@/app/_components/lumaspace/state-banner\";" | tee -a "$LOG_FILE"
echo "Then mount <LumaSpaceStateBanner compact /> or <LumaSpaceStateBanner /> in /lumaspace or /me/space layouts." | tee -a "$LOG_FILE"

if npm run 2>/dev/null | grep -q "type-check"; then
  echo "Running npm run type-check (optional)..." | tee -a "$LOG_FILE"
  if ! npm run type-check >>"$LOG_FILE" 2>&1; then
    echo "Type-check reported issues; see $LOG_FILE" | tee -a "$LOG_FILE"
  fi
else
  echo "No type-check script found, skipping TS validation." | tee -a "$LOG_FILE"
fi

echo "Optimization notes:" | tee -a "$LOG_FILE"
echo "- Later: lift LumaSpace state into a shared store or RSC to avoid repeated fetches." | tee -a "$LOG_FILE"
echo "- Consider SWR/React Query if banner is widely reused." | tee -a "$LOG_FILE"

echo "Step 25.9 — done"
