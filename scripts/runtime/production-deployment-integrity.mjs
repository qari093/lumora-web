const baseUrl = (process.env.LUMORA_PROD_URL || "").trim().replace(/\/$/, "");

if (!baseUrl) {
  console.error("LUMORA_PROD_URL is required");
  process.exitCode = 1;
} else {
  const checks = [
    { name: "home", route: "/", expected: [200], minBytes: 1000, content: "html" },
    { name: "login", route: "/login", expected: [200], minBytes: 500, content: "html" },
    { name: "health", route: "/api/health", expected: [200], minBytes: 10, content: "json" },
    { name: "ready", route: "/api/ready", expected: [200], minBytes: 10, content: "json" },
    { name: "coreHealth", route: "/api/_health", expected: [200], minBytes: 10, content: "json" },
    { name: "healthz", route: "/api/healthz", expected: [200], minBytes: 10, content: "json" },
    { name: "whereami", route: "/api/whereami", expected: [200], minBytes: 10, content: "json" }
  ];

  const results = [];

  for (const check of checks) {
    const startedAt = Date.now();
    const requestUrl = new URL(check.route, baseUrl);
    requestUrl.searchParams.set("__lumora_integrity", Date.now().toString());

    try {
      const response = await fetch(requestUrl, {
        redirect: "follow",
        signal: AbortSignal.timeout(15000),
        headers: {
          accept: check.content === "json" ? "application/json" : "text/html,application/xhtml+xml",
          "cache-control": "no-cache",
          "user-agent": "Lumora-Production-Deployment-Integrity/1.0"
        }
      });

      const body = await response.text();
      const contentType = response.headers.get("content-type") || "";
      let jsonValid = false;

      if (check.content === "json") {
        try {
          JSON.parse(body);
          jsonValid = true;
        } catch {
          jsonValid = false;
        }
      }

      const statusValid = check.expected.includes(response.status);
      const sizeValid = Buffer.byteLength(body) >= check.minBytes;
      const contentValid =
        check.content === "json"
          ? jsonValid && contentType.toLowerCase().includes("json")
          : contentType.toLowerCase().includes("html");

      results.push({
        name: check.name,
        method: "GET",
        route: check.route,
        requestUrl: requestUrl.toString(),
        finalUrl: response.url,
        status: response.status,
        expected: check.expected,
        bytes: Buffer.byteLength(body),
        contentType,
        jsonValid,
        redirected: response.redirected,
        vercelId: response.headers.get("x-vercel-id"),
        vercelCache: response.headers.get("x-vercel-cache"),
        ms: Date.now() - startedAt,
        ok: statusValid && sizeValid && contentValid
      });
    } catch (error) {
      results.push({
        name: check.name,
        method: "GET",
        route: check.route,
        requestUrl: requestUrl.toString(),
        ms: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error),
        ok: false
      });
    }
  }

  const report = {
    checkedAt: new Date().toISOString(),
    baseUrl,
    status: results.every((result) => result.ok) ? "PASS" : "FAIL",
    summary: {
      total: results.length,
      passed: results.filter((result) => result.ok).length,
      failed: results.filter((result) => !result.ok).length
    },
    results
  };

  console.log(JSON.stringify(report, null, 2));

  if (report.status !== "PASS") {
    process.exitCode = 1;
  }
}
