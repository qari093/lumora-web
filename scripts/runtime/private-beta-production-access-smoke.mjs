const baseUrl = process.env.LUMORA_PROD_URL || "https://lumoraverse.io";

const checks = [
  { name: "go", method: "GET", path: "/go", expected: [200], minBytes: 100 },
  { name: "beta", method: "GET", path: "/beta", expected: [200, 307, 308, 401, 403, 404], minBytes: 0 },
  { name: "privateAccessPage", method: "GET", path: "/private-access", expected: [200, 307, 308, 401, 403, 404], minBytes: 0 },
  { name: "privateAccessApi", method: "GET", path: "/api/private-access", expected: [200, 400, 401, 403, 404], minBytes: 0 },
  { name: "privateBetaAccessApi", method: "GET", path: "/api/private-beta/access", expected: [200, 400, 401, 403, 404, 405], minBytes: 0 },
  { name: "privateBetaGateApi", method: "GET", path: "/api/private-beta/gate", expected: [200, 400, 401, 403, 404, 405], minBytes: 0 },
  { name: "privateBetaAllowlistApi", method: "GET", path: "/api/private-beta/allowlist", expected: [200, 400, 401, 403, 404, 405], minBytes: 0 }
];

async function runCheck(check) {
  const started = Date.now();
  const url = `${baseUrl}${check.path}`;
  try {
    const response = await fetch(url, { method: check.method, redirect: "follow" });
    const text = await response.text();
    const bytes = Buffer.byteLength(text);
    const ok = check.expected.includes(response.status) && bytes >= check.minBytes && response.status < 500;
    return {
      ...check,
      url,
      status: response.status,
      bytes,
      ms: Date.now() - started,
      ok
    };
  } catch (error) {
    return {
      ...check,
      url,
      status: 0,
      bytes: 0,
      ms: Date.now() - started,
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

const results = [];
for (const check of checks) {
  results.push(await runCheck(check));
}

const report = {
  checkedAt: new Date().toISOString(),
  baseUrl,
  status: results.every((r) => r.ok) ? "PASS" : "FAIL",
  results
};

console.log(JSON.stringify(report, null, 2));
process.exitCode = report.status === "PASS" ? 0 : 1;
