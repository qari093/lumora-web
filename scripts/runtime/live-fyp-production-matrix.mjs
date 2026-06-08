const BASE_URL = process.env.LUMORA_PROD_URL || "https://lumoraverse.io";

const checks = [
  { group: "page", name: "fypPage", method: "GET", path: "/fyp", expected: [200], minBytes: 1000, json: false },
  { group: "page", name: "livePage", method: "GET", path: "/live", expected: [200], minBytes: 1000, json: false },

  { group: "fypApi", name: "fypHealth", method: "GET", path: "/api/fyp/health", expected: [200], minBytes: 10, json: true },
  { group: "fypApi", name: "fypHealthz", method: "GET", path: "/api/fyp/healthz", expected: [200], minBytes: 10, json: true },
  { group: "fypApi", name: "fypFeed", method: "GET", path: "/api/fyp/feed", expected: [200, 204, 400, 404], minBytes: 0, json: false },
  { group: "fypApi", name: "fypNativeFeed", method: "GET", path: "/api/fyp/native-feed", expected: [200, 204, 400, 404], minBytes: 0, json: false },
  { group: "fypApi", name: "fypRuntime", method: "GET", path: "/api/fyp/runtime", expected: [200, 204, 400, 404], minBytes: 0, json: false },

  { group: "liveApi", name: "liveHealth", method: "GET", path: "/api/live/health", expected: [200], minBytes: 10, json: true },
  { group: "liveApi", name: "liveHealthz", method: "GET", path: "/api/live/healthz", expected: [200], minBytes: 10, json: true },
  { group: "liveApi", name: "liveRooms", method: "GET", path: "/api/live/rooms", expected: [200, 204, 400, 404], minBytes: 0, json: false },
  { group: "liveApi", name: "liveRuntime", method: "GET", path: "/api/live/runtime", expected: [200, 204, 400, 404], minBytes: 0, json: false },
  { group: "liveApi", name: "liveStatus", method: "GET", path: "/api/live/status", expected: [200, 204, 400, 404], minBytes: 0, json: false }
];

const results = [];

for (const check of checks) {
  const started = Date.now();
  const url = `${BASE_URL}${check.path}`;

  try {
    const response = await fetch(url, {
      method: check.method,
      headers: {
        "accept": check.json ? "application/json" : "*/*",
        "user-agent": "LumoraLiveFypProductionMatrix/1.0"
      }
    });

    const text = await response.text();
    let jsonValid = false;
    if (text.length > 0) {
      try {
        JSON.parse(text);
        jsonValid = true;
      } catch {}
    }

    results.push({
      ...check,
      url,
      status: response.status,
      bytes: text.length,
      jsonValid,
      ms: Date.now() - started,
      ok:
        check.expected.includes(response.status) &&
        text.length >= check.minBytes &&
        (!check.json || jsonValid)
    });
  } catch (error) {
    results.push({
      ...check,
      url,
      status: 0,
      bytes: 0,
      jsonValid: false,
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
