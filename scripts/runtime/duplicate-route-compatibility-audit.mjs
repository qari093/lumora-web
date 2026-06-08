import fs from "node:fs";
import path from "node:path";

const groups = {
  liveRoomAliases: [
    "app/api/live/room/route.ts",
    "app/api/live/room-list/route.ts",
    "app/api/live/roomlist/route.ts",
    "app/api/live/rooms-list/route.ts",
    "app/api/live/roomslist/route.ts",
    "app/api/live/rooms/list/route.ts",
    "app/api/live/rooms/public/route.ts",
    "app/api/live/rooms/route.ts"
  ],
  fypLegacy: [
    "app/api/fyp94/feed/route.ts",
    "app/api/fyp94/health/route.ts",
    "app/api/fyp94/library/route.ts",
    "app/api/fyp94/production-health/route.ts",
    "app/api/feed/route.ts",
    "app/api/feed/final/route.ts",
    "app/api/feed/mix/route.ts",
    "app/api/fyp/feed/route.ts",
    "app/api/fyp/native-feed/route.ts"
  ],
  walletZencoinOverlap: [
    "app/api/wallet/route.ts",
    "app/api/wallet/balance/route.ts",
    "app/api/wallet/history/route.ts",
    "app/api/wallet/ledger/route.ts",
    "app/api/wallets/route.ts",
    "app/api/wallets/ensure/route.ts",
    "app/api/zencoin/wallet/route.ts",
    "app/api/zenwallet/runtime/route.ts",
    "app/api/zenwallet/ledger/route.ts"
  ],
  zendoroCommerceOverlap: [
    "app/api/zendoro/products/route.ts",
    "app/api/products/route.ts",
    "app/api/zendoro/orders/route.ts",
    "app/api/orders/route.ts",
    "app/api/zendoro/checkout/route.ts",
    "app/api/payments/checkout/route.ts",
    "app/api/stripe/checkout/route.ts",
    "app/api/stripe/create-checkout-session/route.ts",
    "app/api/zendoro/webhook/route.ts",
    "app/api/payments/webhook/route.ts",
    "app/api/stripe/webhook/route.ts",
    "app/api/shop/webhook/route.ts",
    "app/api/webhooks/zendoro/route.ts"
  ]
};

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function methods(src) {
  return [...src.matchAll(/export\s+(?:async\s+)?function\s+(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD)\b/g)].map((m) => m[1]);
}

function imports(src) {
  return [...src.matchAll(/from\s+["']([^"']+)["']/g)].map((m) => m[1]).sort();
}

function hasGate(src) {
  return src.includes("productionDebugGate") || src.includes("runtime") || src.includes("canonical") || src.includes("redirect") || src.includes("rewrit");
}

function classify(file, canonicalSet) {
  if (!fs.existsSync(file)) return "missing";
  if (canonicalSet.has(file)) return "canonical";
  const src = read(file);
  if (src.includes("NextResponse.redirect") || src.includes("307") || src.includes("308")) return "redirect_alias";
  if (src.includes("fetch(") || src.includes("NextResponse.json")) return "active_implementation";
  return "unknown";
}

const canonical = new Set([
  "app/api/live/rooms/route.ts",
  "app/api/live/rooms/[id]/route.ts",
  "app/api/fyp/route.ts",
  "app/api/fyp/feed/route.ts",
  "app/api/fyp/native-feed/route.ts",
  "app/api/zenwallet/runtime/route.ts",
  "app/api/zenwallet/ledger/route.ts",
  "app/api/zendoro/products/route.ts",
  "app/api/zendoro/orders/route.ts",
  "app/api/zendoro/checkout/route.ts",
  "app/api/zendoro/webhook/route.ts",
  "app/api/stripe/webhook/route.ts"
]);

const report = {
  generatedAt: new Date().toISOString(),
  canonical: [...canonical].sort(),
  groups: {}
};

for (const [group, files] of Object.entries(groups)) {
  report.groups[group] = files.map((file) => {
    const src = read(file);
    return {
      file,
      exists: fs.existsSync(file),
      classification: classify(file, canonical),
      methods: methods(src),
      importCount: imports(src).length,
      imports: imports(src).slice(0, 20),
      byteSize: src.length,
      hasCompatibilitySignal: hasGate(src)
    };
  });
}

fs.writeFileSync(".lumora-audits/duplicate-route-compatibility-audit.json", JSON.stringify(report, null, 2) + "\n");

let md = "# Duplicate Route Compatibility Audit\n\n";
md += `Generated: ${report.generatedAt}\n\n`;
for (const [group, rows] of Object.entries(report.groups)) {
  md += `## ${group}\n\n`;
  md += "| Route | Exists | Classification | Methods | Bytes |\n";
  md += "|---|---:|---|---|---:|\n";
  for (const row of rows) {
    md += `| \`${row.file}\` | ${row.exists ? "yes" : "no"} | ${row.classification} | ${row.methods.join(", ") || "-"} | ${row.byteSize} |\n`;
  }
  md += "\n";
}
md += "## Rule\n\nNo route is deleted in this audit. Any legacy route must first be converted to a compatibility wrapper or gated behind a production-safe 404 before removal.\n";

fs.writeFileSync("docs/runtime/duplicate-route-compatibility-audit.md", md);

const risky = [];
for (const [group, rows] of Object.entries(report.groups)) {
  for (const row of rows) {
    if (row.exists && row.classification === "active_implementation" && !canonical.has(row.file)) {
      risky.push({ group, file: row.file, methods: row.methods });
    }
  }
}

fs.writeFileSync(".lumora-audits/duplicate-route-risk-list.json", JSON.stringify({ generatedAt: report.generatedAt, risky }, null, 2) + "\n");

console.log(`Audited groups: ${Object.keys(groups).length}`);
console.log(`Risky duplicate implementations: ${risky.length}`);
for (const item of risky.slice(0, 40)) console.log(`${item.group}: ${item.file} [${item.methods.join(",") || "-"}]`);
