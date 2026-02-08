#!/usr/bin/env bash
set +e

PORT="${PORT:-3040}"
BASE="http://127.0.0.1:${PORT}"

# Thresholds (tunable)
LOAD1_WARN="${LOAD1_WARN:-50}"
FREE_PCT_WARN="${FREE_PCT_WARN:-3}"     # percent
AUTO_RELIEF="${AUTO_RELIEF:-0}"         # 1 => run scripts/dev/relief_3040.sh when warn triggers

echo "NEXA perf sanity — ${BASE}"
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
  echo "• Auto relief triggered"
  PORT="${PORT}" sh scripts/dev/relief_3040.sh
  echo
  echo "• Re-check after relief"
  PORT="${PORT}" sh scripts/nexa/perf_sanity.sh LOAD1_WARN="${LOAD1_WARN}" FREE_PCT_WARN="${FREE_PCT_WARN}" AUTO_RELIEF=0
  exit 0
fi

echo "✅ NEXA perf sanity — done"
exit 0
