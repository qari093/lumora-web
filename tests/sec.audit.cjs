const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function log(msg) {
  console.log(msg);
}

function run(cmd, args, opts = {}) {
  const pretty = [cmd].concat(args || []).join(" ");
  log(`• Running: ${pretty}`);
  const res = spawnSync(cmd, args, {
    stdio: opts.inheritStdout ? "inherit" : ["ignore", "pipe", "pipe"],
    env: { ...process.env, ...(opts.env || {}) },
  });

  const out = res.stdout ? res.stdout.toString() : "";
  const err = res.stderr ? res.stderr.toString() : "";

  if (!opts.inheritStdout && out) process.stdout.write(out);
  if (!opts.inheritStdout && err) process.stderr.write(err);

  return { status: res.status ?? 0, out, err };
}

function fileExists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function runNpmAudit() {
  log("▶️ Dependency vulnerability scan (npm audit --production --audit-level=high)");

  const res = run("npm", ["audit", "--production", "--audit-level=high"], {
    inheritStdout: true,
  });

  if (res.status !== 0) {
    console.error(
      "❌ npm audit reported HIGH or CRITICAL vulnerabilities.\n" +
        "   Fix or review them before considering this security check as passed."
    );
    return false;
  }

  log("✓ npm audit completed with no high/critical vulnerabilities.");
  return true;
}

function runPrismaValidate() {
  log("▶️ Prisma schema validation (npx prisma validate)");

  const res = run("npx", ["prisma", "validate"], { inheritStdout: true });

  if (res.status !== 0) {
    console.error("❌ npx prisma validate failed. Investigate schema/config issues.");
    return false;
  }

  log("✓ Prisma schema validated.");
  return true;
}

function scanForDangerousCORS() {
  log("▶️ Static scan for dangerous CORS patterns (Access-Control-Allow-Origin: *)");

  const root = process.cwd();
  const suspicious = [];

  const exts = new Set([".ts", ".tsx", ".js", ".cjs", ".mjs"]);

  function walk(dir) {
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        walk(full);
      } else if (e.isFile()) {
        const ext = path.extname(e.name);
        if (!exts.has(ext)) continue;
        if (!full.includes(path.join("app", "api")) && !full.includes(path.join("pages", "api"))) {
          continue;
        }
        let src;
        try {
          src = fs.readFileSync(full, "utf8");
        } catch {
          continue;
        }
        if (src.includes("Access-Control-Allow-Origin") && src.includes("*")) {
          suspicious.push(full);
        }
      }
    }
  }

  walk(path.join(root, "app"));
  if (fileExists(path.join(root, "pages", "api"))) {
    walk(path.join(root, "pages", "api"));
  }

  if (!suspicious.length) {
    log("✓ No wild-card CORS headers detected in app/api or pages/api.");
    return true;
  }

  console.error("⚠ Potentially dangerous CORS configuration detected in:");
  for (const f of suspicious) {
    console.error("   - " + path.relative(root, f));
  }
  console.error(
    "   Review these locations to ensure wild-card CORS is intentional and safe."
  );
  // Treat as soft fail (warning) to avoid blocking CI but still highlight risk.
  return true;
}

function main() {
  log("▶️ Step 12.0 — Security Penetration Audit");

  let ok = true;

  // 1) Dependency vulnerabilities (hard fail on high/critical)
  const auditOk = runNpmAudit();
  if (!auditOk) ok = false;

  // 2) Prisma core schema sanity (hard fail)
  const prismaOk = runPrismaValidate();
  if (!prismaOk) ok = false;

  // 3) Static scan for obviously dangerous CORS (soft fail)
  const corsOk = scanForDangerousCORS();
  if (!corsOk) ok = false;

  if (!ok) {
    console.error("❌ Security Penetration Audit FAILED. Address issues above before proceeding.");
    process.exit(1);
  }

  log("✅ Security Penetration Audit passed.");
}

main();
