#!/usr/bin/env bash
set +e

PORT="${PORT:-3040}"
BASE="http://127.0.0.1:${PORT}"

echo "NEXA perf sanity — ${BASE}"
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
if (free!=null && total!=null) {
  const pct = (free/total)*100;
  console.log(`freeMemBytes=${free} (${pct.toFixed(2)}%)`);
} else {
  console.log('freeMemBytes=(unknown)');
}
console.log('rssBytes=', rss ?? '(unknown)');

let warn = [];
if (load && load.length>0 && typeof load[0]==='number' && load[0] > 50) warn.push(`HIGH_LOADAVG_1M=${load[0]}`);
if (free!=null && total!=null && (free/total) < 0.03) warn.push(`LOW_FREE_MEM=${(free/total*100).toFixed(2)}%`);
if (rss!=null && rss > 1.5e9) warn.push(`HIGH_RSS_BYTES=${rss}`);

if (warn.length) {
  console.log('⚠️ WARN:', warn.join(' | '));
} else {
  console.log('✓ perf sanity: OK');
}
NODE

echo
echo "✅ NEXA perf sanity — done"
exit 0
