import fs from "node:fs";

const routes = [
  "app/fyp/page.tsx",
  "app/live/page.tsx",
  "app/gmar/page.tsx",
  "app/nexa/page.tsx",
  "app/zendoro/page.tsx",
  "app/lumaspace/page.tsx",
  "app/wallet/page.tsx"
];

const apiHints = [
  "fetch(",
  "/api/",
  "useEffect(",
  "useSWR(",
  "axios.",
  "server action",
  "async function"
];

const findings = routes.map((file) => {
  const content = fs.existsSync(file)
    ? fs.readFileSync(file, "utf8")
    : "";

  return {
    file,
    bytes: content.length,
    runtimeSignals: apiHints.filter(h => content.includes(h)).length,
    importsCount: (content.match(/^import /gm) || []).length,
    jsxDensity: (content.match(/</g) || []).length
  };
});

const result = {
  system: "FOUNDER_VISUAL_FUNCTIONAL_AUDIT",
  pack: "03/05",
  phase: "Runtime Content Validation",
  checkedAt: new Date().toISOString(),
  findings
};

fs.writeFileSync(
  "data/founder-audit/pack03-runtime-content-audit.json",
  JSON.stringify(result, null, 2)
);

console.log(JSON.stringify(result, null, 2));
