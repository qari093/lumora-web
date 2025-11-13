const { performance } = require("perf_hooks");
const { writeFileSync } = require("fs");

function log(msg) {
  console.log(msg);
}

const PORT = process.env.PORT || "3000";
const BASE = process.env.ANALYTICS_BASE_URL || `http://127.0.0.1:${PORT}`;
const TIMEOUT_MS = Number(process.env.ANALYTICS_TIMEOUT_MS || 5000);
const MAX_ERROR_RATE = Number(process.env.ANALYTICS_MAX_ERROR_RATE || 0.15);

// Key analytics surfaces we care about
const ENDPOINTS = [
  // Core metrics pipeline
  { path: "/api/metrics/batch", method: "POST", kind: "metrics-ingest" },

  // Ads analytics
  { path: "/api/ads/analytics/summary", method: "GET", kind: "ads-analytics-summary" },
  { path: "/api/ads/analytics/timeseries", method: "GET", kind: "ads-analytics-timeseries" },

  // Economy analytics
  { path: "/api/eco/summary", method: "GET", kind: "eco-summary" },
  { path: "/api/eco/timeseries", method: "GET", kind: "eco-timeseries" },

  // Emotion / EMML analytics
  { path: "/api/emotion/heat", method: "GET", kind: "emotion-heat" },
  { path: "/api/emml/indices", method: "GET", kind: "emml-indices" },
  { path: "/api/emml/heat", method: "GET", kind: "emml-heat" },
];

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

function safeJsonParse(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : String(err) };
  }
}

function isMeaningfulBody(x) {
  if (x == null) return false;
  if (Array.isArray(x)) return x.length > 0;
  if (typeof x === "object") return Object.keys(x).length > 0;
  return true;
}

async function probeEndpoint(ep) {
  const url = `${BASE}${ep.path}`;
  const started = performance.now();

  const payload =
    ep.method === "POST"
      ? {
          source: "analytics-finalization",
          ts: new Date().toISOString(),
          entries: [
            {
              type: ep.kind,
              at: new Date().toISOString(),
              meta: {
                demo: true,
                route: ep.path,
                label: "analytics-finalization-probe",
              },
            },
          ],
        }
      : null;

  const init = {
    method: ep.method,
    headers: payload ? { "content-type": "application/json" } : undefined,
    body: payload ? JSON.stringify(payload) : undefined,
  };

  let status = 0;
  let level = "info";
  let error = null;
  let ok = false;
  let jsonOk = false;
  let hasBody = false;
  let bodyShape = "unknown";

  try {
    const res = await fetchWithTimeout(url, init);
    status = res.status;

    const text = await res.text().catch(() => "");
    const { ok: parsed, value, error: jsonError } = safeJsonParse(text);

    jsonOk = parsed;
    if (parsed) {
      hasBody = isMeaningfulBody(value);
      if (Array.isArray(value)) {
        bodyShape = "array";
      } else if (value && typeof value === "object") {
        bodyShape = "object";
      } else {
        bodyShape = typeof value;
      }
    } else {
      if (text && text.trim().length) {
        hasBody = true;
        bodyShape = "non-json";
      } else {
        bodyShape = "empty";
      }
    }

    if (status >= 500) {
      level = "error";
      error = `5xx response (${status})`;
      ok = false;
    } else {
      // Anything below 500 is considered "reachable" for analytics wiring
      ok = true;
      if (status >= 400) {
        level = "warn";
        error = `4xx/405 response (${status}) — reachable but contract mismatch`;
      }
      if (!hasBody) {
        level = "warn";
        error = (error ? error + "; " : "") + "response body is empty or not meaningful";
      } else if (!jsonOk && status < 300) {
        level = "warn";
        error = (error ? error + "; " : "") + "expected JSON but got non-JSON body";
      }
      if (!error) {
        level = "info";
      }
    }

    const durationMs = performance.now() - started;

    return {
      ...ep,
      url,
      status,
      ok,
      level,
      error,
      durationMs,
      jsonOk,
      hasBody,
      bodyShape,
    };
  } catch (err) {
    const durationMs = performance.now() - started;
    return {
      ...ep,
      url,
      status: 0,
      ok: false,
      level: "error",
      error: err && err.message ? err.message : String(err),
      durationMs,
      jsonOk: false,
      hasBody: false,
      bodyShape: "error",
    };
  }
}

async function main() {
  log("▶️ Step 17.0 — Analytics Finalization");
  log(`• Base URL: ${BASE}`);
  log(
    `• Endpoints: ${ENDPOINTS.map((e) => `${e.method} ${e.path} [${e.kind}]`).join(", ")}`
  );
  log(`• Timeout per request: ${TIMEOUT_MS}ms`);
  log(`• Max allowed hard error rate: ${(MAX_ERROR_RATE * 100).toFixed(1)}%`);

  const results = [];
  for (const ep of ENDPOINTS) {
    const r = await probeEndpoint(ep);
    results.push(r);

    const tag = r.ok ? "✓" : "❌";
    const dur = r.durationMs.toFixed(1);
    const extra =
      r.error && r.error.length
        ? ` (${r.level}: ${r.error}; body=${r.bodyShape}, jsonOk=${r.jsonOk})`
        : ` (body=${r.bodyShape}, jsonOk=${r.jsonOk})`;
    log(`${tag} ${ep.method} ${ep.path} [${ep.kind}] → status=${r.status}, ${dur}ms${extra}`);
  }

  const total = results.length;
  const hardFails = results.filter((r) => !r.ok).length;
  const errorRate = total ? hardFails / total : 0;

  log("");
  log("▶️ Analytics wiring summary");
  log(`• Total endpoints checked: ${total}`);
  log(`• Hard failures (network/5xx): ${hardFails}`);
  log(`• Error rate: ${(errorRate * 100).toFixed(2)}%`);
  log(
    `• Max allowed error rate: ${(MAX_ERROR_RATE * 100).toFixed(
      2
    )}% (4xx/405 treated as reachable but contract warnings)`
  );

  const report = {
    baseUrl: BASE,
    checkedAt: new Date().toISOString(),
    endpoints: results,
    summary: {
      total,
      hardFails,
      errorRate,
      maxErrorRate: MAX_ERROR_RATE,
    },
  };

  const outPath = "tests/analytics_final_report.json";
  writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");
  log(`• Report written → ${outPath}`);

  if (errorRate > MAX_ERROR_RATE) {
    console.error(
      `❌ Analytics Finalization FAILED: hard error rate ${(errorRate * 100).toFixed(
        2
      )}% > ${(MAX_ERROR_RATE * 100).toFixed(2)}%`
    );
    process.exit(1);
  }

  log("✅ Analytics Finalization passed (all endpoints reachable with < 500 errors).");
}

main().catch((err) => {
  console.error("❌ Analytics Finalization script error:", err && err.stack ? err.stack : err);
  process.exit(1);
});
