const BASE_URL = process.env.LUMORA_PROD_URL || "https://lumoraverse.io";

const routes = [
  { name: "home", path: "/", minBytes: 1000 },
  { name: "fyp", path: "/fyp", minBytes: 1000 },
  { name: "live", path: "/live", minBytes: 1000 },
  { name: "gmar", path: "/gmar", minBytes: 100 },
  { name: "creatorHub", path: "/creator-hub", minBytes: 100 },
  { name: "health", path: "/api/health", minBytes: 10 },
  { name: "ready", path: "/api/ready", minBytes: 10 }
];

const results = [];

for (const route of routes) {
  const url = `${BASE_URL}${route.path}`;
  const started = Date.now();

  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        "user-agent": "LumoraProductionJourneySmoke/1.0"
      }
    });

    const text = await response.text();
    results.push({
      ...route,
      url,
      status: response.status,
      ok: response.status >= 200 && response.status < 400 && text.length >= route.minBytes,
      bytes: text.length,
      ms: Date.now() - started
    });
  } catch (error) {
    results.push({
      ...route,
      url,
      status: 0,
      ok: false,
      bytes: 0,
      ms: Date.now() - started,
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

if (report.status !== "PASS") {
  process.exitCode = 1;
}
