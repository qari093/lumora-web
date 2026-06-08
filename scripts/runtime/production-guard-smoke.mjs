const BASE_URL = process.env.LUMORA_PROD_URL || "https://lumoraverse.io";

const guardedRoutes = [
  "/api/dev/routes",
  "/api/dev/testers/reset",
  "/api/debug/boot-metrics",
  "/api/diag",
  "/api/fyp/debug",
  "/api/hybrid/dev/state",
  "/api/live/raw-audit",
  "/api/stripe/dev/simulate",
  "/api/videos/debug/list"
];

const results = [];

for (const path of guardedRoutes) {
  const url = `${BASE_URL}${path}`;
  const started = Date.now();

  try {
    const response = await fetch(url, {
      headers: {
        "accept": "application/json",
        "user-agent": "LumoraProductionGuardSmoke/1.0"
      }
    });

    const text = await response.text();

    results.push({
      path,
      url,
      status: response.status,
      bytes: text.length,
      ms: Date.now() - started,
      ok: response.status === 404
    });
  } catch (error) {
    results.push({
      path,
      url,
      status: 0,
      bytes: 0,
      ms: Date.now() - started,
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

const report = {
  checkedAt: new Date().toISOString(),
  baseUrl: BASE_URL,
  status: results.every((r) => r.ok) ? "PASS" : "FAIL",
  results
};

console.log(JSON.stringify(report, null, 2));
if (report.status !== "PASS") process.exitCode = 1;
