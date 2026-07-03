const baseUrl = process.env.LUMORA_SMOKE_BASE_URL ?? "http://localhost:3000";

const routes = [
  "/api/video-ingestion/validation-pool",
  "/api/video-ingestion/runtime/fyp-smoke",
  "/api/video-ingestion/runtime/lumaspace-smoke",
  "/api/video-ingestion/runtime/final-certification",
];

const results = [];

for (const route of routes) {
  try {
    const res = await fetch(`${baseUrl}${route}`);
    const json = await res.json();

    results.push({
      route,
      status: res.status,
      ok: res.ok && json.ok === true,
      ready: json.ready ?? json.runtimeReady ?? json.memoryReady ?? json.summary?.ready ?? true,
    });
  } catch (error) {
    results.push({
      route,
      status: 0,
      ok: false,
      ready: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

const passed = results.every((item) => item.ok && item.ready !== false);

console.log(JSON.stringify({ baseUrl, passed, results }, null, 2));

if (!passed) process.exit(1);
