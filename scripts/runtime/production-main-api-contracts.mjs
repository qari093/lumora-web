const BASE_URL = process.env.LUMORA_PROD_URL || "https://lumoraverse.io";

const endpoints = [
  { name: "health", path: "/api/health" },
  { name: "ready", path: "/api/ready" },
  { name: "fypHealth", path: "/api/fyp/health" },
  { name: "liveHealth", path: "/api/live/health" },
  { name: "gmarHealth", path: "/api/gmar/health" },
  { name: "nexaHealth", path: "/api/nexa/health" }
];

const results = [];

for (const endpoint of endpoints) {
  const url = `${BASE_URL}${endpoint.path}`;
  const started = Date.now();

  try {
    const response = await fetch(url, {
      headers: {
        "accept": "application/json",
        "user-agent": "LumoraProductionApiContracts/1.0"
      }
    });

    const text = await response.text();
    let jsonValid = false;

    try {
      JSON.parse(text);
      jsonValid = true;
    } catch {}

    results.push({
      ...endpoint,
      url,
      status: response.status,
      jsonValid,
      bytes: text.length,
      ms: Date.now() - started,
      ok: response.status >= 200 && response.status < 500 && text.length > 0
    });
  } catch (error) {
    results.push({
      ...endpoint,
      url,
      status: 0,
      jsonValid: false,
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
