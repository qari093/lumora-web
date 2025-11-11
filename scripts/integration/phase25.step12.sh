#!/usr/bin/env bash
# Step 25.12 — LumaSpace schemaVersion upgrade + contract recheck
set -euo pipefail

ROOT="${LUMORA_ROOT:-$HOME/lumora-web}"
cd "$ROOT" || { echo "❌ Project not found at $ROOT"; exit 1; }

mkdir -p app/api/lumaspace/state tests scripts/integration logs

# ─────────────────────────────────────────
# COMPLETE CODE — app/api/lumaspace/state/route.ts (with schemaVersion)
# ─────────────────────────────────────────
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
  schemaVersion: number;
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
      schemaVersion: 1,
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
# TESTS — update tests/api.lumaspace.state.spec.ts
# ─────────────────────────────────────────
cat >tests/api.lumaspace.state.spec.ts <<'TS'
import { GET as stateGET } from "../app/api/lumaspace/state/route";

describe("LumaSpace /api/lumaspace/state", () => {
  it("returns a valid state payload with schemaVersion", async () => {
    const res = await stateGET();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.schemaVersion).toBe(1);
    expect(["demo", "beta", "live"]).toContain(json.mode);
    expect(Array.isArray(json.sections)).toBe(true);
    expect(json.sections.length).toBeGreaterThan(0);
  });
});
TS

# ─────────────────────────────────────────
# UPDATE CONTRACT VERIFIER — scripts/integration/phase25.step11.sh
# ─────────────────────────────────────────
cat >scripts/integration/phase25.step11.sh <<'SC'
#!/usr/bin/env bash
# Step 25.11 — LumaSpace /api/lumaspace/state contract verifier (with schemaVersion)
set -euo pipefail

ROOT="${LUMORA_ROOT:-$HOME/lumora-web}"
cd "$ROOT" || { echo "❌ Project not found at $ROOT"; exit 1; }

LOG_FILE="logs/phase25.step11.lumaspace-state-contract.log"
PORT="${PORT:-3000}"

mkdir -p logs
echo "Step 25.11 — LumaSpace state contract verifier (PORT=$PORT)" | tee "$LOG_FILE"

URL="http://127.0.0.1:$PORT/api/lumaspace/state"
echo "Checking $URL" | tee -a "$LOG_FILE"

TMP_HDR="/tmp/phase25.step11.hdr.$$"
TMP_BODY="/tmp/phase25.step11.body.$$"

if ! curl -fsS -D "$TMP_HDR" -o "$TMP_BODY" "$URL" 2>>"$LOG_FILE"; then
  echo "❌ Request to $URL failed (see $LOG_FILE)" | tee -a "$LOG_FILE"
  rm -f "$TMP_HDR" "$TMP_BODY" 2>/dev/null || true
  exit 1;
fi

echo "Response headers:" | tee -a "$LOG_FILE"
head -n 10 "$TMP_HDR" | tee -a "$LOG_FILE"

echo "--- raw body (first 260 bytes) ---" | tee -a "$LOG_FILE"
head -c 260 "$TMP_BODY" 2>/dev/null | tee -a "$LOG_FILE"
echo | tee -a "$LOG_FILE"

if command -v jq >/dev/null 2>&1; then
  echo "Running jq-based shape checks..." | tee -a "$LOG_FILE"

  if ! jq -e '.ok == true' "$TMP_BODY" >/dev/null 2>&1; then
    echo "❌ Contract: .ok != true" | tee -a "$LOG_FILE"
    rm -f "$TMP_HDR" "$TMP_BODY" 2>/dev/null || true
    exit 1
  fi

  if ! jq -e '.schemaVersion == 1' "$TMP_BODY" >/dev/null 2>&1; then
    echo "❌ Contract: .schemaVersion != 1" | tee -a "$LOG_FILE"
    rm -f "$TMP_HDR" "$TMP_BODY" 2>/dev/null || true
    exit 1
  fi

  if ! jq -e '.mode == "demo" or .mode == "beta" or .mode == "live"' "$TMP_BODY" >/dev/null 2>&1; then
    echo "❌ Contract: .mode is not demo|beta|live" | tee -a "$LOG_FILE"
    rm -f "$TMP_HDR" "$TMP_BODY" 2>/dev/null || true
    exit 1
  fi

  if ! jq -e '(.sections | type=="array") and (.sections | length > 0)' "$TMP_BODY" >/dev/null 2>&1; then
    echo "❌ Contract: .sections not a non-empty array" | tee -a "$LOG_FILE"
    rm -f "$TMP_HDR" "$TMP_BODY" 2>/dev/null || true
    exit 1
  fi

  if ! jq -e 'all(.sections[]; has("id") and has("label") and has("enabled") and has("weight"))' "$TMP_BODY" >/dev/null 2>&1; then
    echo "❌ Contract: one or more sections missing required keys" | tee -a "$LOG_FILE"
    rm -f "$TMP_HDR" "$TMP_BODY" 2>/dev/null || true
    exit 1
  fi

  echo "✅ LumaSpace state contract OK (schemaVersion 1)" | tee -a "$LOG_FILE"
else
  echo "ℹ️ jq not installed — skipping strict JSON shape checks" | tee -a "$LOG_FILE"
fi

rm -f "$TMP_HDR" "$TMP_BODY" 2>/dev/null || true

echo "Integration notes:" | tee -a "$LOG_FILE"
echo "- This script now locks schemaVersion=1 for /api/lumaspace/state." | tee -a "$LOG_FILE"
echo "- Bump schemaVersion and adjust checks when evolving the payload format." | tee -a "$LOG_FILE"

echo "Optimization notes:" | tee -a "$LOG_FILE"
echo "- When introducing v2+, keep this endpoint backward compatible or expose /state/v2." | tee -a "$LOG_FILE"

echo "Step 25.11 — done" | tee -a "$LOG_FILE"
SC

chmod +x scripts/integration/phase25.step11.sh

# ─────────────────────────────────────────
# Ensure Next.js dev is running (optional guard)
# ─────────────────────────────────────────
PORT="${PORT:-3000}"
if ! curl -fsS "http://127.0.0.1:$PORT" >/dev/null 2>&1; then
  echo "ℹ️ Next.js not responding, restarting dev server on PORT=$PORT..."
  pkill -f "next dev" >/dev/null 2>&1 || true
  NEXT_LOG="/tmp/next-dev.out"
  rm -f "$NEXT_LOG"
  PORT="$PORT" npx next dev >"$NEXT_LOG" 2>&1 & disown
  sleep 8
  tail -n 16 "$NEXT_LOG" || true
fi

# ─────────────────────────────────────────
# Re-run HTTP contract verifier
# ─────────────────────────────────────────
bash scripts/integration/phase25.step11.sh

echo "Step 25.12 — done"
