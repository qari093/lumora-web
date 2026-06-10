import fs from "node:fs";

const portals = [
  { name: "home", path: "app/page.tsx" },
  { name: "fyp", path: "app/fyp/page.tsx" },
  { name: "live", path: "app/live/page.tsx" },
  { name: "gmar", path: "app/gmar/page.tsx" },
  { name: "nexa", path: "app/nexa/page.tsx" },
  { name: "zendoro", path: "app/zendoro/page.tsx" },
  { name: "lumaspace", path: "app/lumaspace/page.tsx" },
  { name: "wallet", path: "app/wallet/page.tsx" },
  { name: "movies", path: "app/movies/page.tsx" },
  { name: "music", path: "app/music/page.tsx" }
];

const result = {
  system: "FOUNDER_VISUAL_FUNCTIONAL_AUDIT",
  pack: "01/05",
  phase: "Portal Reality Audit",
  checkedAt: new Date().toISOString(),
  portals: [],
  summary: {
    total: portals.length,
    existing: 0
  }
};

for (const portal of portals) {
  const exists = fs.existsSync(portal.path);
  const bytes = exists ? fs.statSync(portal.path).size : 0;

  if (exists) result.summary.existing++;

  result.portals.push({
    portal: portal.name,
    exists,
    bytes
  });
}

result.status =
  result.summary.existing === result.summary.total
    ? "PASS"
    : "FAIL";

fs.writeFileSync(
  "data/founder-audit/pack01-portal-reality-audit.json",
  JSON.stringify(result, null, 2)
);

fs.writeFileSync(
  ".lumora-audits/founder-pack01-portal-reality-audit.json",
  JSON.stringify(result, null, 2)
);

console.log(JSON.stringify(result, null, 2));

if (result.status !== "PASS") process.exit(1);
