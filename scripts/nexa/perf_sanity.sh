#!/usr/bin/env bash

# Resolve PORT (default 3040)
. "$(cd "$(dirname "$0")" && pwd)/port_resolve.sh" 2>/dev/null || . "scripts/dev/port_resolve.sh" 2>/dev/null || true
set -euo pipefail

# --- Lumora policy: DEV safe defaults (prevents infinite relief loops) ---
DEV_MODE="${DEV_MODE:-1}"
AUTO_RELIEF="${AUTO_RELIEF:-0}"
FREE_CHECK="${FREE_CHECK:-0}"
LOAD1_WARN="${LOAD1_WARN:-60}"
FREE_PCT_WARN="${FREE_PCT_WARN:-3}"
MAX_RELIEF="${MAX_RELIEF:-1}"
CONSEC_REQUIRED="${CONSEC_REQUIRED:-2}"
COOLDOWN_SEC="${COOLDOWN_SEC:-45}"
MAX_RUN_SEC="${MAX_RUN_SEC:-90}"

if [ "$DEV_MODE" = "1" ]; then
  # Next.js dev is noisy on macOS (watchers, JIT, cold compiles). Never auto-restart in dev.
  AUTO_RELIEF=0
  FREE_CHECK=0
fi
# --- End policy ---


PORT="${PORT:-3040}"
LOAD1_WARN="${LOAD1_WARN:-60}"
FREE_PCT_WARN="${FREE_PCT_WARN:-3}"
AUTO_RELIEF="${AUTO_RELIEF:-0}"
MAX_RELIEF="${MAX_RELIEF:-1}"
COOLDOWN_SEC="${COOLDOWN_SEC:-45}"
CONSEC_REQUIRED="${CONSEC_REQUIRED:-2}"
STATE_FILE="${STATE_FILE:-/tmp/nexa_perf_sanity_state.json}"

read_state(){
  if [ -f "${STATE_FILE}" ]; then
    python3 - <<'PYS' "${STATE_FILE}" 2>/dev/null || true
import json,sys
p=sys.argv[1]
try: d=json.load(open(p))
except Exception: d={}
print(d.get("consec_warn",0))
print(d.get("relief_used",0))
PYS
  else
    echo "0"; echo "0"
  fi
}

write_state(){
  consec="${1:-0}"; relief="${2:-0}"
  python3 - <<'PYS' "${STATE_FILE}" "${consec}" "${relief}" 2>/dev/null || true
import json,sys
p=sys.argv[1]; con=int(sys.argv[2]); rel=int(sys.argv[3])
json.dump({"consec_warn":con,"relief_used":rel}, open(p,"w"))
PYS
}


PORT="${PORT:-3040}"
STATE_FILE="${STATE_FILE:-/tmp/nexa_perf_sanity_state.json}"

read_state() {
  if [ -f "${STATE_FILE}" ]; then
    python3 - <<'PYS' "${STATE_FILE}" 2>/dev/null || true
import json,sys
p=sys.argv[1]
try:
  d=json.load(open(p))
except Exception:
  d={}
print(d.get("consec_warn",0))
print(d.get("relief_used",0))
PYS
  else
    echo "0"
    echo "0"
  fi
}

write_state() {
  consec="${1:-0}"
  relief="${2:-0}"
  python3 - <<'PYS' "${STATE_FILE}" "${consec}" "${relief}" 2>/dev/null || true
import json,sys,os
p=sys.argv[1]
con=int(sys.argv[2])
rel=int(sys.argv[3])
json.dump({"consec_warn":con,"relief_used":rel}, open(p,"w"))
PYS
}

set +e

PORT="${PORT:-3040}"
BASE="http://127.0.0.1:${PORT}"

# Thresholds (tunable)

echo "NEXA perf sanity — ${BASE}"
START_TS="${START_TS:-$(date +%s)}"
NOW_TS="$(date +%s)"
ELAPSED="$((NOW_TS-START_TS))"
if [ "$ELAPSED" -ge "$MAX_RUN_SEC" ]; then
  echo "⚠️ MAX_RUN_SEC reached (${ELAPSED}s >= ${MAX_RUN_SEC}s). Stopping to prevent long-running loops."
  exit 0
fi

echo "thresholds: load1>${LOAD1_WARN} free%<${FREE_PCT_WARN} auto_relief=${AUTO_RELIEF}"
echo

# Ensure server
PORT="${PORT}" sh scripts/dev/ensure_up.sh
echo

out="/tmp/nexa_perf_metrics.json"
curl -sS -m 15 --retry 2 --retry-delay 1 --retry-all-errors "${BASE}/api/nexa/metrics" > "${out}"
rc=$?
if [ "$rc" -ne 0 ]; then
  echo "❌ Failed to fetch /api/nexa/metrics (rc=${rc})"
  exit 0
fi

echo "✓ Saved: ${out}"
echo

node - <<'NODE'
const fs = require('fs');

const LOAD1_WARN = Number(process.env.LOAD1_WARN || 50);
const FREE_PCT_WARN = Number(process.env.FREE_PCT_WARN || 3);

function num(x){ return typeof x === 'number' && Number.isFinite(x) ? x : null; }

const p = '/tmp/nexa_perf_metrics.json';
let j;
try { j = JSON.parse(fs.readFileSync(p,'utf8')); } catch(e){ console.log('❌ JSON parse failed'); process.exit(0); }

const ok = j && j.ok === true;
const load = Array.isArray(j?.system?.loadavg) ? j.system.loadavg : null;
const free = num(j?.system?.freeMemBytes);
const total = num(j?.system?.totalMemBytes);
const rss = num(j?.process?.rssBytes);

console.log('metrics.ok=', ok);
console.log('node.version=', j?.node?.version || '(unknown)');
console.log('pid=', j?.node?.pid || '(unknown)');
console.log('uptimeMs=', j?.uptimeMs ?? '(unknown)');
console.log('loadavg=', load ? load.join(', ') : '(unknown)');
let freePct = null;
if (free!=null && total!=null) {
  freePct = (free/total)*100;
  console.log(`freeMemBytes=${free} (${freePct.toFixed(2)}%)`);
} else {
  console.log('freeMemBytes=(unknown)');
}
console.log('rssBytes=', rss ?? '(unknown)');

let warn = [];
const load1 = (load && typeof load[0]==='number') ? load[0] : null;
if (load1!=null && load1 > LOAD1_WARN) warn.push(`HIGH_LOADAVG_1M=${load1.toFixed(2)}>${LOAD1_WARN}`);
if (freePct!=null && freePct < FREE_PCT_WARN) warn.push(`LOW_FREE_MEM=${freePct.toFixed(2)}%<${FREE_PCT_WARN}%`);

if (warn.length) {
  console.log('WARN=1');
  console.log('⚠️ WARN:', warn.join(' | '));
} else {
  console.log('WARN=0');
  console.log('✓ perf sanity: OK');
}
NODE

warn_flag="$(node -e "const j=require('/tmp/nexa_perf_metrics.json'); const load=j?.system?.loadavg?.[0]; const free=j?.system?.freeMemBytes; const total=j?.system?.totalMemBytes; const loadWarn=Number(process.env.LOAD1_WARN||50); const freeWarn=Number(process.env.FREE_PCT_WARN||3); let warn=0; if(typeof load==='number'&&load>loadWarn) warn=1; if(typeof free==='number'&&typeof total==='number'&&(free/total*100)<freeWarn) warn=1; process.stdout.write(String(warn));")"

echo
if [ "${warn_flag}" = "1" ] && [ "${AUTO_RELIEF}" = "1" ]; then
# Hysteresis + max-relief guard (prevents infinite loop)
consec_warn="$(read_state | sed -n '1p' 2>/dev/null || echo 0)"
relief_used="$(read_state | sed -n '2p' 2>/dev/null || echo 0)"

if [ "${WARN:-0}" = "1" ]; then
  consec_warn="$((consec_warn+1))"
else
  consec_warn="0"
fi

write_state "${consec_warn}" "${relief_used}"

if [ "${AUTO_RELIEF}" != "1" ]; then
  exit 0
fi

if [ "${WARN:-0}" != "1" ]; then
  echo "✓ WARN present; relief decision evaluated"
  exit 0
fi

if [ "${consec_warn}" -lt "${CONSEC_REQUIRED}" ]; then
  echo "• WARN seen ${consec_warn}/${CONSEC_REQUIRED} times — waiting for confirmation before relief"
  exit 0
fi

if [ "${relief_used}" -ge "${MAX_RELIEF}" ]; then
  echo "⛔ AUTO_RELIEF blocked: relief_used=${relief_used} >= MAX_RELIEF=${MAX_RELIEF} (prevent loop)"
  exit 0
fi

relief_used="$((relief_used+1))"
write_state "${consec_warn}" "${relief_used}"
  echo "• Auto relief triggered (guarded: hysteresis + max relief)"
  PORT="${PORT}" sh scripts/dev/relief_3040.sh
echo "• Cooldown ${COOLDOWN_SEC}s (let memory/load settle)"; sleep "${COOLDOWN_SEC}"
echo "• Single re-check after relief (no further relief allowed this run)"; AUTO_RELIEF=0 sh scripts/nexa/perf_sanity.sh || true
echo "✓ re-check done"
exit 0
  echo
  echo "• Re-check after relief"
  PORT="${PORT}" sh scripts/nexa/perf_sanity.sh LOAD1_WARN="${LOAD1_WARN}" FREE_PCT_WARN="${FREE_PCT_WARN}" AUTO_RELIEF=0
  exit 0
fi

echo "✅ NEXA perf sanity — done"
exit 0
