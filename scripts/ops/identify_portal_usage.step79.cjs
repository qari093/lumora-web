'use strict';

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const outFile = process.env.OUT_FILE || path.join(root, 'ops/_analysis/portal_usage.step79.json');

function safeRead(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return ''; }
}

function listFilesRecursive(dir, acc = []) {
  let ents;
  try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return acc; }
  for (const e of ents) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) listFilesRecursive(p, acc);
    else acc.push(p);
  }
  return acc;
}

function extractRoutesFromText(txt) {
  const routes = new Map();
  if (!txt) return routes;
  const re = /(^|[\s(])\/[a-z0-9][a-z0-9\-\/]*[a-z0-9]\/?([?#][^\s)]*)?/gi;
  let m;
  while ((m = re.exec(txt)) !== null) {
    const r = (m[0] || '').trim();
    if (!r.startsWith('/')) continue;
    const clean = r.replace(/[),.]+$/g, '');
    routes.set(clean, (routes.get(clean) || 0) + 1);
  }
  return routes;
}

function mergeCounts(into, from) {
  for (const [k, v] of from.entries()) into.set(k, (into.get(k) || 0) + v);
}

(function main() {
  const sources = [
    path.join(root, 'ops/_observations'),
    path.join(root, 'ops/_feedback'),
    path.join(root, 'ops/_friction'),
  ];

  const report = {
    ok: true,
    createdAt: new Date().toISOString(),
    sources: sources.map((p) => p.replace(root + path.sep, '')),
    totals: { filesScanned: 0, routesFound: 0 },
    topRoutes: [],
    notes: [
      'Heuristic route frequency from markdown logs (observations/feedback/friction).',
      'CommonJS .cjs required because package.json sets type=module.',
    ],
  };

  const counts = new Map();
  for (const dir of sources) {
    const files = listFilesRecursive(dir).filter((p) => p.toLowerCase().endsWith('.md'));
    for (const f of files) {
      report.totals.filesScanned++;
      const txt = safeRead(f);
      mergeCounts(counts, extractRoutesFromText(txt));
    }
  }

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 50);
  report.totals.routesFound = counts.size;
  report.topRoutes = sorted.map(([route, count]) => ({ route, count }));

  try {
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, JSON.stringify(report, null, 2) + '\n', 'utf8');
  } catch (e) {
    report.ok = false;
    report.error = String(e && e.message ? e.message : e);
  }

  process.stdout.write(`✓ Wrote: ${path.relative(root, outFile)}\n`);
})();
