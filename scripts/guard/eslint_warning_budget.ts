import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type LineHit = { file: string; line: number; col: number; rule: string; message: string };
type Report = {
  ok: boolean;
  cap: number;
  warnings: number;
  hits: LineHit[];
  command: string;
  ts: number;
};

const CAP = Number.parseInt(process.env.ESLINT_WARNING_CAP || "25", 10);
if (!Number.isFinite(CAP) || CAP < 0) {
  console.error("Invalid ESLINT_WARNING_CAP");
  process.exit(2);
}

const cmd = process.env.BUILD_CMD?.trim()
  ? process.env.BUILD_CMD.trim().split(/\s+/)
  : (process.env.npm_config_user_agent || "").includes("pnpm")
    ? ["pnpm", "-s", "build"]
    : ["npx", "-y", "next", "build"];

const child = spawn(cmd[0], cmd.slice(1), { stdio: ["ignore", "pipe", "pipe"], env: process.env });

let out = "";
child.stdout.on("data", (d) => { out += d.toString("utf8"); process.stdout.write(d); });
child.stderr.on("data", (d) => { out += d.toString("utf8"); process.stderr.write(d); });

function parseWarnings(all: string): LineHit[] {
  // Next.js ESLint warning lines look like:
  // ./path/to/file.tsx
  // 102:3  Warning: <message>  <rule>
  // We'll parse both "Warning:" and "warning" variants defensively.
  const lines = all.split(/\r?\n/);
  const hits: LineHit[] = [];
  let currentFile = "";
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.startsWith("./") || l.startsWith("app/") || l.startsWith("components/") || l.startsWith("lib/") || l.startsWith("src/")) {
      // Treat as file header if it looks like a path and ends with .ts/.tsx/.js/.jsx
      if (/\.(ts|tsx|js|jsx)$/.test(l.trim())) currentFile = l.trim().replace(/^\.\//, "");
      continue;
    }

    // Match: 102:3  Warning: message  rule
    const m = l.match(/^(\d+):(\d+)\s+Warning:\s+(.*)\s+([@\w/-]+)$/);
    if (m && currentFile) {
      hits.push({
        file: currentFile,
        line: Number(m[1]),
        col: Number(m[2]),
        message: m[3].trim(),
        rule: m[4].trim(),
      });
    }
  }
  return hits;
}

const done = new Promise<number>((resolve) => child.on("close", (code) => resolve(code ?? 1)));

(async () => {
  const code = await done;
  const hits = parseWarnings(out);
  const warnings = hits.length;

  const report: Report = {
    ok: code === 0 && warnings <= CAP,
    cap: CAP,
    warnings,
    hits,
    command: cmd.join(" "),
    ts: Date.now(),
  };

  const outDir = join(process.cwd(), "artifacts");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "eslint_warning_budget.json"), JSON.stringify(report, null, 2), "utf8");

  if (code !== 0) {
    console.error(`❌ build failed (exit=${code})`);
    process.exit(code);
  }

  if (warnings > CAP) {
    console.error(`❌ ESLint warning budget exceeded: ${warnings} > ${CAP}`);
    console.error(`See artifacts/eslint_warning_budget.json`);
    process.exit(1);
  }

  console.log(`✓ ESLint warning budget ok: ${warnings} <= ${CAP}`);
})();
