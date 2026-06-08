const BASE_URL = process.env.LUMORA_PROD_URL || "https://lumoraverse.io";

const checks = [
  { name: "checkoutInfo", method: "GET", path: "/api/zendoro/checkout", expected: [200] },
  { name: "webhookInfo", method: "GET", path: "/api/zendoro/webhook", expected: [200] },
  { name: "checkoutPostSafe", method: "POST", path: "/api/zendoro/checkout", expected: [501, 503] },
  { name: "webhookPostSafe", method: "POST", path: "/api/zendoro/webhook", expected: [400, 501, 503] }
];

const results = [];

for (const check of checks) {
  const started = Date.now();
  const url = `${BASE_URL}${check.path}`;

  const init = {
    method: check.method,
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "user-agent": "LumoraZendoroPaymentSmoke/1.0"
    }
  };

  if (check.method === "POST") {
    init.body = JSON.stringify({ productId: "smoke-test", quantity: 1, mode: "test" });
  }

  try {
    const response = await fetch(url, init);
    const text = await response.text();

    let jsonValid = false;
    try {
      JSON.parse(text);
      jsonValid = true;
    } catch {}

    results.push({
      ...check,
      url,
      status: response.status,
      bytes: text.length,
      jsonValid,
      ms: Date.now() - started,
      ok: check.expected.includes(response.status) && text.length > 0 && jsonValid
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
