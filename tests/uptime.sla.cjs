const { setTimeout: sleep } = require("timers/promises");
const { performance } = require("perf_hooks");

function log(msg) {
  console.log(msg);
}

const PORT = process.env.PORT || "3000";
const BASE = process.env.UPTIME_BASE_URL || `http://127.0.0.1:${PORT}`;
const DURATION_MS = Number(process.env.UPTIME_WINDOW_MS || 300000); // default 5 minutes
const INTERVAL_MS = Number(process.env.UPTIME_INTERVAL_MS || 1000); // 1s per probe
const TIMEOUT_MS = Number(process.env.UPTIME_TIMEOUT_MS || 2000);   // 2s timeout
const MIN_UPTIME = Number(process.env.UPTIME_MIN || 0.99);          // 99% over window

async function fetchWithTimeout(url, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function runUptimeProbe() {
  log("▶️ Step 15.0 — Uptime SLA Verification");
  log(`• Base URL: ${BASE}`);
  log(`• Window: ${DURATION_MS}ms, Interval: ${INTERVAL_MS}ms, Timeout: ${TIMEOUT_MS}ms`);
  log(`• Required uptime: ${(MIN_UPTIME * 100).toFixed(2)}% on /api/health over this window`);

  const start = performance.now();
  const end = start + DURATION_MS;

  let total = 0;
  let ok = 0;

  while (performance.now() < end) {
    total++;
    try {
      const res = await fetchWithTimeout(`${BASE}/api/health`);
      if (res.ok) {
        ok++;
      } else {
        log(`⚠ Probe #${total}: status=${res.status}`);
      }
    } catch (err) {
      log(`⚠ Probe #${total}: error=${err && err.message}`);
    }
    const now = performance.now();
    const remaining = end - now;
    if (remaining <= 0) break;
    const sleepMs = Math.min(INTERVAL_MS, remaining);
    await sleep(sleepMs);
  }

  const uptime = total ? ok / total : 0;
  log("");
  log("▶️ Uptime summary");
  log(`• Probes: total=${total}, ok=${ok}, failed=${total - ok}`);
  log(`• Uptime over window: ${(uptime * 100).toFixed(2)}%`);

  if (total === 0) {
    console.error("❌ No probes executed; cannot compute uptime.");
    process.exit(1);
  }

  if (uptime < MIN_UPTIME) {
    console.error(
      `❌ Uptime SLA check FAILED: ${(uptime * 100).toFixed(
        2
      )}% < required ${(MIN_UPTIME * 100).toFixed(2)}%`
    );
    process.exit(1);
  }

  log(
    `✅ Uptime SLA check passed: ${(uptime * 100).toFixed(
      2
    )}% ≥ required ${(MIN_UPTIME * 100).toFixed(2)}%`
  );
}

runUptimeProbe().catch((err) => {
  console.error("❌ Uptime SLA script error:", err && err.stack ? err.stack : err);
  process.exit(1);
});
