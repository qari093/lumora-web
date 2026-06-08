import fs from "node:fs";

const routeFiles = [
  "app/api/zendoro/checkout/route.ts",
  "app/api/zendoro/webhook/route.ts",
  "app/api/stripe/webhook/route.ts",
  "app/api/payments/checkout/route.ts",
  "app/api/payments/webhook/route.ts",
  "app/api/shop/webhook/route.ts"
];

const requiredEnvNames = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
];

const routes = routeFiles.map((file) => {
  const exists = fs.existsSync(file);
  const src = exists ? fs.readFileSync(file, "utf8") : "";

  return {
    file,
    exists,
    bytes: src.length,
    methods: [...src.matchAll(/export\s+(?:async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE)\b/g)].map((m) => m[1]),
    mentionsStripe: src.includes("stripe") || src.includes("Stripe"),
    mentionsWebhookSignature: src.includes("constructEvent") || src.includes("stripe-signature") || src.includes("Stripe-Signature"),
    isCompatibilityWrapper: src.includes("compatibilityJson"),
    mentionsZendoroCanonical: src.includes("/api/zendoro/")
  };
});

const env = requiredEnvNames.map((name) => ({
  name,
  present: Boolean(process.env[name]),
  length: process.env[name] ? process.env[name].length : 0,
  masked: process.env[name] ? `${process.env[name].slice(0, 6)}…${process.env[name].slice(-4)}` : null
}));

const canonicalCheckout = routes.find((r) => r.file === "app/api/zendoro/checkout/route.ts");
const canonicalWebhook = routes.find((r) => r.file === "app/api/zendoro/webhook/route.ts");

const report = {
  checkedAt: new Date().toISOString(),
  status:
    canonicalCheckout?.exists &&
    canonicalWebhook?.exists &&
    canonicalCheckout.methods.includes("POST") &&
    canonicalWebhook.methods.includes("POST")
      ? "PASS"
      : "FAIL",
  routes,
  env,
  nextRequiredAction: "production zendoro payment endpoint smoke"
};

console.log(JSON.stringify(report, null, 2));
if (report.status !== "PASS") process.exitCode = 1;
