import fs from "node:fs";

const targets = [
  "app/page.tsx",
  "app/fyp/page.tsx",
  "app/live/page.tsx",
  "app/gmar/page.tsx",
  "app/nexa/page.tsx",
  "app/zendoro/page.tsx",
  "app/lumaspace/page.tsx",
  "app/wallet/page.tsx"
];

const findings = [];

for (const file of targets) {
  const text = fs.existsSync(file)
    ? fs.readFileSync(file, "utf8")
    : "";

  findings.push({
    file,
    exists: fs.existsSync(file),
    bytes: text.length,
    hasLink: /href=|Link\s*\(/.test(text),
    hasClientUI: /button|Button|card|Card|section|Section/i.test(text),
    hasPlaceholder:
      /coming soon|placeholder|todo|stub/i.test(text)
  });
}

const result = {
  system: "FOUNDER_VISUAL_FUNCTIONAL_AUDIT",
  pack: "02/05",
  phase: "Navigation & Content Activation Audit",
  checkedAt: new Date().toISOString(),
  findings
};

fs.writeFileSync(
  "data/founder-audit/pack02-navigation-content-audit.json",
  JSON.stringify(result, null, 2)
);

console.log(JSON.stringify(result, null, 2));
