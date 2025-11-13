const { writeFileSync } = require("fs");
const { performance } = require("perf_hooks");

function log(msg) {
  console.log(msg);
}

const PORT = process.env.PORT || "3000";
const BASE = process.env.FEEDBACK_BASE_URL || `http://127.0.0.1:${PORT}`;

// Focused on paths that already exist in your route map
const ENDPOINTS = [
  { path: "/api/metrics/batch", method: "POST" },
  { path: "/api/notify/emit", method: "POST" },
  { path: "/api/emotion/heat", method: "GET" },
  { path: "/api/emml/indices", method: "GET" },
];

const TIMEOUT_MS = Number(process.env.FEEDBACK_TIMEOUT_MS || 4000);
const MAX_ERROR_RATE = Number(process.env.FEEDBACK_MAX_ERROR_RATE || 0.2); // allow some 4xx/405

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

function asJsonSafe(obj) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return "{}";
  }
}

async function probeEndpoint(ep) {
  const url = `${BASE}${ep.path}`;
  const started = performance.now();

  const payload =
    ep.method === "POST"
      ? {
          source: "post_release_feedback_loop",
          ts: new Date().toISOString(),
          meta: {
            path: ep.path,
            demoUser: "feedback-loop-demo",
          },
        }
      : null;

  const init = {
    method: ep.method,
    headers: payload ? { "content-type": "application/json" } : undefined,
    body: payload ? JSON.stringify(payload) : undefined,
  };

  let status = 0;
  let ok = false;
  let level = "info";
  let error = null;

  try {
    const res = await fetchWithTimeout(url, init);
    status = res.status;

    // Treat any non-5xx response as "reachable" for feedback loop wiring.
    if (status >= 500) {
      ok = false;
      level = "error";
      error = `5xx response (${status})`;
    } else {
      ok = true;
      if (status >= 400) {
        level = "warn";
        error = `4xx/405 response (${status}) — likely schema/verb mismatch but endpoint reachable`;
      }
    }

    // Drain body to keep connection clean; don't care about contents here.
    res.arrayBuffer().catch(() => {});
  } catch (err) {
    ok = false;
    level = "error";
    error = err && err.message ? err.message : String(err);
  }

  const durationMs = performance.now() - started;

  return {
    path: ep.path,
    method: ep.method,
    url,
    status,
    ok,
    level,
    error,
    durationMs,
  };
}

async function main() {
  log("▶️ Step 16.0 — Post-Release Feedback Loop");

  log(`• Base URL: ${BASE}`);
  log(`• Endpoints: ${ENDPOINTS.map((e) => e.method + " " + e.path).join(", ")}`);
  log(`• Timeout per request: ${TIMEOUT_MS}ms`);
  log(`• Max error rate (hard fail if exceeded): ${(MAX_ERROR_RATE * 100).toFixed(1)}%`);

  const results = [];
  for (const ep of ENDPOINTS) {
    const r = await probeEndpoint(ep);
    results.push(r);
    const tag = r.ok ? "✓" : "❌";
    const dur = r.durationMs.toFixed(1);
    if (r.error) {
      log(`${tag} ${ep.method} ${ep.path} → status=${r.status}, ${dur}ms (${r.level}: ${r.error})`);
    } else {
      log(`${tag} ${ep.method} ${ep.path} → status=${r.status}, ${dur}ms`);
    }
  }

  const total = results.length;
  const hardErrors = results.filter((r) => !r.ok).length;
  const errorRate = total ? hardErrors / total : 0;

  log("");
  log("▶️ Feedback loop summary");
  log(`• Total endpoints checked: ${total}`);
  log(`• Hard failures (network/5xx): ${hardErrors}`);
  log(`• Error rate: ${(errorRate * 100).toFixed(2)}%`);

  const report = {
    baseUrl: BASE,
    checkedAt: new Date().toISOString(),
    endpoints: results,
    summary: {
      total,
      hardErrors,
      errorRate,
      maxErrorRate: MAX_ERROR_RATE,
    },
  };

  const outPath = "tests/post_release_feedback_report.json";
  writeFileSync(outPath, asJsonSafe(report), "utf8");
  log(`• Report written → ${outPath}`);

  if (errorRate > MAX_ERROR_RATE) {
    console.error(
      `❌ Post-release feedback loop FAILED: error rate ${(errorRate * 100).toFixed(
        2
      )}% > max ${(MAX_ERROR_RATE * 100).toFixed(2)}%`
    );
    process.exit(1);
  }

  log("✅ Post-release feedback loop verified (endpoints reachable & responding < 500).");
}

main().catch((err) => {
  console.error("❌ Feedback loop script error:", err && err.stack ? err.stack : err);
  process.exit(1);
});
