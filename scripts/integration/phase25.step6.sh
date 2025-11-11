#!/usr/bin/env bash
# Step 25.6 — LumaSpace API routes + tests + smoke checks
set -euo pipefail

ROOT="${LUMORA_ROOT:-$HOME/lumora-web}"
cd "$ROOT" || { echo "Project not found at $ROOT"; exit 1; }

mkdir -p app/api/lumaspace/ping app/api/lumaspace/state tests logs

# ─────────────────────────────────────────
# COMPLETE CODE — API ROUTES
# ─────────────────────────────────────────

cat >app/api/lumaspace/ping/route.ts <<'TS'
import { NextResponse } from "next/server";

function buildOk(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, { status: 200, ...init });
}

function buildError(message: string, status = 500) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function GET() {
  try {
    const now = new Date();
    return buildOk({
      ok: true,
      service: "LumaSpace",
      role: "health-ping",
      ts: now.toISOString(),
      unix: Math.floor(now.getTime() / 1000),
      env: process.env.NODE_ENV ?? "development",
    });
  } catch (e: any) {
    const msg = e?.message ?? String(e);
    return buildError(`LumaSpace ping failed: ${msg}`, 500);
  }
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}

export const dynamic = "force-dynamic";
TS

cat >app/api/lumaspace/state/route.ts <<'TS'
import { NextResponse } from "next/server";

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

function buildOk(body: LumaSpaceStatePayload) {
  return NextResponse.json(body, { status: 200 });
}

function buildError(message: string, status = 500) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function GET() {
  try {
    const now = new Date();
    const mode: LumaSpaceMode =
      (process.env.LUMASPACE_MODE as LumaSpaceMode | undefined) ?? "demo";

    const sections: LumaSpaceSection[] = [
      {
        id: "reflection-journal",
        label: "Reflection Journal",
        enabled: true,
        weight: 1.0,
      },
      {
        id: "shadow-journal",
        label: "Shadow Journal",
        enabled: true,
        weight: 0.95,
      },
      {
        id: "emotion-heatmap",
        label: "Emotion Heatmap",
        enabled: true,
        weight: 0.9,
      },
      {
        id: "breath-room",
        label: "Breath Room",
        enabled: true,
        weight: 0.85,
      },
    ];

    const payload: LumaSpaceStatePayload = {
      ok: true,
      mode,
      version: process.env.LUMASPACE_VERSION ?? "1.0.0",
      updatedAt: now.toISOString(),
      sections,
    };

    return buildOk(payload);
  } catch (e: any) {
    const msg = e?.message ?? String(e);
    return buildError(`LumaSpace state error: ${msg}`, 500);
  }
}

export const dynamic = "force-dynamic";
TS

# ─────────────────────────────────────────
# TESTS — unit tests for handlers
# ─────────────────────────────────────────

cat >tests/api.lumaspace.ping.spec.ts <<'TS'
import { GET as pingGET } from "../app/api/lumaspace/ping/route";

describe("LumaSpace /api/lumaspace/ping", () => {
  it("returns ok: true and metadata", async () => {
    const res = await pingGET();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.service).toBe("LumaSpace");
    expect(typeof json.ts).toBe("string");
    expect(typeof json.unix).toBe("number");
  });
});
TS

cat >tests/api.lumaspace.state.spec.ts <<'TS'
import { GET as stateGET } from "../app/api/lumaspace/state/route";

describe("LumaSpace /api/lumaspace/state", () => {
  it("returns a valid state payload", async () => {
    const res = await stateGET();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(["demo", "beta", "live"]).toContain(json.mode);
    expect(Array.isArray(json.sections)).toBe(true);
    expect(json.sections.length).toBeGreaterThan(0);
  });
});
TS

# ─────────────────────────────────────────
# INTEGRATION NOTES — smoke test endpoints
# ─────────────────────────────────────────

LOG_FILE="logs/phase25.step6.lumaspace-api.log"
PORT="${PORT:-3000}"

echo "Step 25.6 — LumaSpace API integration (PORT=$PORT)" | tee "$LOG_FILE"

# Ensure dev server is running
if ! curl -fsS "http://127.0.0.1:$PORT" >/dev/null 2>&1; then
  echo "Next.js not responding, restarting dev server..." | tee -a "$LOG_FILE"
  pkill -f "next dev" >/dev/null 2>&1 || true
  NEXT_LOG="/tmp/next-dev.out"
  rm -f "$NEXT_LOG"
  PORT="$PORT" npx next dev >"$NEXT_LOG" 2>&1 & disown
  sleep 8
  echo "Next.js tail:" | tee -a "$LOG_FILE"
  tail -n 16 "$NEXT_LOG" 2>/dev/null | tee -a "$LOG_FILE" || echo "No Next log yet" | tee -a "$LOG_FILE"
fi

check_route () {
  local path="$1"
  local label="$2"
  local url="http://127.0.0.1:${PORT}${path}"
  echo "" | tee -a "$LOG_FILE"
  echo "$label  ($url)" | tee -a "$LOG_FILE"
  if curl -fsS -D /tmp/phase25.step6.hdr.$$ -o /tmp/phase25.step6.body.$$ "$url" 2>>"$LOG_FILE"; then
    head -n 8 /tmp/phase25.step6.hdr.$$ | tee -a "$LOG_FILE"
    echo "--- body preview ---" | tee -a "$LOG_FILE"
    head -c 260 /tmp/phase25.step6.body.$$ 2>/dev/null | tee -a "$LOG_FILE"
    echo | tee -a "$LOG_FILE"
  else
    echo "Request failed for $url (see log)" | tee -a "$LOG_FILE"
  fi
  rm -f /tmp/phase25.step6.hdr.$$ /tmp/phase25.step6.body.$$ 2>/dev/null || true
}

check_route "/api/lumaspace/ping"  "LumaSpace API ping"
check_route "/api/lumaspace/state" "LumaSpace state API"

# ─────────────────────────────────────────
# OPTIMIZATION RECOMMENDATIONS — log only
# ─────────────────────────────────────────

echo "" | tee -a "$LOG_FILE"
echo "Optimization notes:" | tee -a "$LOG_FILE"
echo "- Cache /api/lumaspace/state for a few seconds if traffic grows." | tee -a "$LOG_FILE"
echo "- Move mode/sections to DB or feature flags when wiring admin UI." | tee -a "$LOG_FILE"

echo "Step 25.6 — done"
