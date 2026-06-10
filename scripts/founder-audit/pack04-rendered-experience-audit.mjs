import fs from "node:fs";

const routes = [
  "/",
  "/fyp",
  "/live",
  "/gmar",
  "/nexa",
  "/zendoro",
  "/lumaspace",
  "/wallet",
  "/movies",
  "/music"
];

const base =
  process.env.LUMORA_AUDIT_BASE ||
  "https://lumoraverse.io";

const results = [];

for (const route of routes) {
  try {
    const res = await fetch(base + route);

    const html = await res.text();

    results.push({
      route,
      status: res.status,
      ok: res.ok,
      htmlBytes: html.length,
      hasLumora: /lumora/i.test(html),
      hasButton:
        /button|enter|explore|continue/i.test(html),
      hasVideo:
        /video|stream|player/i.test(html),
      hasPortalContent:
        html.length > 5000
    });
  } catch (error) {
    results.push({
      route,
      error: String(error)
    });
  }
}

const summary = {
  totalRoutes: results.length,
  healthyRoutes: results.filter(
    r => r.ok === true
  ).length
};

const report = {
  system: "FOUNDER_VISUAL_FUNCTIONAL_AUDIT",
  pack: "04/05",
  phase: "Rendered Portal Experience Audit",
  checkedAt: new Date().toISOString(),
  summary,
  results
};

fs.writeFileSync(
  "data/founder-audit/pack04-rendered-experience-audit.json",
  JSON.stringify(report, null, 2)
);

console.log(JSON.stringify(report, null, 2));
