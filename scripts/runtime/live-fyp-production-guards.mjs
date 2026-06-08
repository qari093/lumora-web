const BASE_URL = process.env.LUMORA_PROD_URL || "https://lumoraverse.io";

const checks = [
  { group: "debug", path: "/api/fyp/debug", expected: [404] },
  { group: "debug", path: "/api/live/raw-audit", expected: [404] },
  { group: "debug", path: "/api/live/google-trends", expected: [200, 404] },
  { group: "debug", path: "/api/live/reddit", expected: [200, 404] },
  { group: "debug", path: "/api/live/youtube", expected: [200, 404] },
  { group: "safeMethods", path: "/api/fyp/native-upload", method: "GET", expected: [200, 400, 404, 405] },
  { group: "safeMethods", path: "/api/live/publish", method: "GET", expected: [200, 400, 404, 405] },
  { group: "safeMethods", path: "/api/live/mic", method: "GET", expected: [200, 400, 404, 405] },
  { group: "safeRuntime", path: "/api/fyp/observability", expected: [200, 400, 404] },
  { group: "safeRuntime", path: "/api/live/validation", expected: [200, 400, 404] }
];

const results = [];

for (const check of checks) {
  const started = Date.now();
  const method = check.method || "GET";
  const url = `${BASE_URL}${check.path}`;

  try {
    const response = await fetch(url, {
      method,
      redirect: "manual",
      headers: {
        "accept": "*/*",
        "user-agent": "LumoraLiveFypProductionGuards/1.0"
      }
    });

    const text = await response.text();

    results.push({
      ...check,
      method,
      url,
      status: response.status,
      bytes: text.length,
      ms: Date.now() - started,
      ok: check.expected.includes(response.status) && response.status < 500
    });
  } catch (error) {
    results.push({
      ...check,
      method,
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
