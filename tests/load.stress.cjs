const { setTimeout: sleep } = require("timers/promises");
const { performance } = require("perf_hooks");

function log(msg) {
  console.log(msg);
}

const PORT = process.env.PORT || "3000";
const BASE = process.env.LOAD_BASE_URL || `http://127.0.0.1:${PORT}`;

const TARGETS = [
  "/",
  "/api/health",
  "/api/lumaspace/state",
  "/api/ads/serve",
];

const CONCURRENCY = Number(process.env.LOAD_CONCURRENCY || 32);
const DURATION_MS = Number(process.env.LOAD_DURATION_MS || 20000);
const TIMEOUT_MS = Number(process.env.LOAD_REQ_TIMEOUT_MS || 4000);

const MAX_ERROR_RATE = 0.02;      // 2%
const MAX_AVG_LATENCY = 1000;     // 1s average allowed
const MAX_P95_LATENCY = 2500;     // 2.5s p95 allowed

async function fetchWithTimeout(url, options = {}, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function ensureServerUp() {
  log(`• Checking server health at ${BASE}/api/health ...`);
  for (let i = 0; i < 5; i++) {
    try {
      const res = await fetchWithTimeout(`${BASE}/api/health`, {}, 2000);
      if (res.ok) {
        log("✓ Server responded OK on /api/health");
        return true;
      }
      log(`⚠ Health check attempt ${i + 1} failed with status ${res.status}`);
    } catch (err) {
      log(`⚠ Health check attempt ${i + 1} error: ${err && err.message}`);
    }
    await sleep(1000);
  }
  console.error("❌ Server did not respond healthy on /api/health. Start Next.js (PORT=3000 npx next dev) and retry.");
  return false;
}

function createStats() {
  return {
    requests: 0,
    errors: 0,
    latencies: [],
  };
}

async function worker(targetPath, stats, deadline) {
  const url = `${BASE}${targetPath}`;
  while (performance.now() < deadline) {
    const start = performance.now();
    let ok = false;
    try {
      const res = await fetchWithTimeout(url);
      const status = res.status;
      if (status >= 200 && status < 500) {
        ok = true;
      }
      // Drain body in background (ignore content)
      res.arrayBuffer().catch(() => {});
    } catch (_err) {
      ok = false;
    }
    const dur = performance.now() - start;
    stats.requests++;
    stats.latencies.push(dur);
    if (!ok) stats.errors++;
  }
}

function computeMetrics(stats) {
  const { requests, errors, latencies } = stats;
  const total = requests || 0;
  const errorRate = total ? errors / total : 0;

  if (!latencies.length) {
    return {
      requests,
      errors,
      errorRate,
      avgLatency: 0,
      p95Latency: 0,
      maxLatency: 0,
    };
  }

  const sorted = [...latencies].sort((a, b) => a - b);
  const sum = latencies.reduce((acc, v) => acc + v, 0);
  const avg = sum / latencies.length;
  const idx95 = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95));
  const p95 = sorted[idx95];
  const max = sorted[sorted.length - 1];

  return {
    requests,
    errors,
    errorRate,
    avgLatency: avg,
    p95Latency: p95,
    maxLatency: max,
  };
}

async function runScenario() {
  log("▶️ Step 14.0 — Load & Stress Testing");
  log(`• Base URL: ${BASE}`);
  log(`• Targets: ${TARGETS.join(", ")}`);
  log(`• Concurrency: ${CONCURRENCY}, Duration: ${DURATION_MS}ms`);

  const up = await ensureServerUp();
  if (!up) {
    process.exit(1);
  }

  const deadline = performance.now() + DURATION_MS;

  const allStats = {};
  for (const t of TARGETS) {
    allStats[t] = createStats();
  }

  const workers = [];
  for (const target of TARGETS) {
    const perTargetConcurrency = Math.max(1, Math.floor(CONCURRENCY / TARGETS.length));
    for (let i = 0; i < perTargetConcurrency; i++) {
      workers.push(worker(target, allStats[target], deadline));
    }
  }

  await Promise.all(workers);

  log("");
  log("▶️ Load test summary (per target):");
  let overallOk = true;

  for (const target of TARGETS) {
    const metrics = computeMetrics(allStats[target]);
    const total = metrics.requests;
    const errors = metrics.errors;
    const errorPct = (metrics.errorRate * 100).toFixed(2);

    log(`\nTarget: ${target}`);
    log(`  Requests: ${total}, Errors: ${errors} (${errorPct}%)`);
    log(
      `  Latency ms: avg=${metrics.avgLatency.toFixed(1)}, p95=${metrics.p95Latency.toFixed(
        1
      )}, max=${metrics.maxLatency.toFixed(1)}`
    );

    if (total === 0) {
      console.error("  ❌ No successful requests recorded — treat as failure.");
      overallOk = false;
      continue;
    }

    if (metrics.errorRate > MAX_ERROR_RATE) {
      console.error(
        `  ❌ Error rate ${errorPct}% exceeds allowed ${MAX_ERROR_RATE * 100}%`
      );
      overallOk = false;
    }

    if (metrics.avgLatency > MAX_AVG_LATENCY) {
      console.error(
        `  ❌ Average latency ${metrics.avgLatency.toFixed(
          1
        )}ms exceeds allowed ${MAX_AVG_LATENCY}ms`
      );
      overallOk = false;
    }

    if (metrics.p95Latency > MAX_P95_LATENCY) {
      console.error(
        `  ❌ p95 latency ${metrics.p95Latency.toFixed(
          1
        )}ms exceeds allowed ${MAX_P95_LATENCY}ms`
      );
      overallOk = false;
    }
  }

  log("");
  if (!overallOk) {
    console.error("❌ Load & Stress Testing FAILED — see per-target details above.");
    process.exit(1);
  }

  log("✅ Load & Stress Testing passed — within configured thresholds.");
}

runScenario().catch((err) => {
  console.error("❌ Load & Stress Testing script error:", err && err.stack ? err.stack : err);
  process.exit(1);
});
