#!/usr/bin/env node
/* Step 19.0 — Release Candidate Tagging */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function sh(cmd) {
  return execSync(cmd, { encoding: "utf8" }).trim();
}

function log(msg) {
  console.log(msg);
}

function main() {
  log("▶️ Step 19.0 — Release Candidate Tagging");

  const root = process.cwd();
  const reportPath = path.join(root, "tests", "rc_tag_report.json");

  // ────────────────────────────────────────────────
  // 1) Ensure this is a git repo
  // ────────────────────────────────────────────────
  try {
    sh("git rev-parse --is-inside-work-tree");
  } catch {
    console.error("❌ Not inside a git repository. Initialize git before tagging.");
    process.exit(1);
  }

  // ────────────────────────────────────────────────
  // 2) Basic git state: branch + cleanliness
  // ────────────────────────────────────────────────
  let branch = "unknown";
  try {
    branch = sh("git rev-parse --abbrev-ref HEAD");
  } catch (err) {
    console.error("❌ Failed to determine current git branch:", err && err.message);
    process.exit(1);
  }

  let statusPorcelain = "";
  try {
    statusPorcelain = sh("git status --porcelain");
  } catch (err) {
    console.error("❌ Failed to run git status:", err && err.message);
    process.exit(1);
  }

  if (statusPorcelain.length > 0) {
    console.error("❌ Working tree is not clean. Commit or stash changes before tagging RC.");
    console.error(statusPorcelain);
    process.exit(1);
  }

  log(`• Git branch: ${branch}`);
  if (!["main", "master"].includes(branch)) {
    console.warn("⚠ RC tag is being created on a non-main branch. This is allowed but unusual.");
  }

  const lastCommit = sh("git rev-parse HEAD");
  const lastCommitShort = sh("git rev-parse --short HEAD");
  log(`• Last commit: ${lastCommitShort}`);

  // ────────────────────────────────────────────────
  // 3) Determine version & tag name
  // ────────────────────────────────────────────────
  let version = "0.0.0";
  let pkgName = "lumora-web";
  const pkgPath = path.join(root, "package.json");

  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
      if (typeof pkg.version === "string" && pkg.version.length > 0) {
        version = pkg.version;
      }
      if (typeof pkg.name === "string" && pkg.name.length > 0) {
        pkgName = pkg.name;
      }
    } catch (err) {
      console.warn("⚠ Failed to read package.json for version info:", err && err.message);
    }
  } else {
    console.warn("⚠ package.json not found. Using default version 0.0.0 for RC tag.");
  }

  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const ts =
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    "-" +
    pad(now.getHours()) +
    pad(now.getMinutes());

  const base = `v${version}`;
  const tagName = `${base}-rc.${ts}`;
  const tagMessage = `Release candidate for ${pkgName} ${base} (${ts}), commit ${lastCommitShort}`;

  log(`• Proposed RC tag: ${tagName}`);

  // ────────────────────────────────────────────────
  // 4) Check if tag already exists
  // ────────────────────────────────────────────────
  let existing = "";
  try {
    existing = sh(`git tag --list "${tagName}"`);
  } catch {
    existing = "";
  }

  if (existing && existing.split("\n").includes(tagName)) {
    console.warn(`⚠ Tag ${tagName} already exists. No new tag will be created.`);
  } else {
    // Create annotated tag
    try {
      sh(`git tag -a "${tagName}" -m "${tagMessage.replace(/"/g, '\\"')}"`);
      log(`✓ Created annotated tag: ${tagName}`);
    } catch (err) {
      console.error("❌ Failed to create RC tag:", err && err.message);
      process.exit(1);
    }
  }

  // ────────────────────────────────────────────────
  // 5) Optional push hint (not executed automatically)
  // ────────────────────────────────────────────────
  const pushHint = `git push origin "${tagName}"`;

  // ────────────────────────────────────────────────
  // 6) Write machine-readable report
  // ────────────────────────────────────────────────
  const report = {
    timestamp: now.toISOString(),
    tagName,
    branch,
    lastCommit,
    lastCommitShort,
    version,
    pkgName,
    pushHint,
    notes: {
      message:
        "Tag created locally. To share with remote, run the pushHint command manually after review."
    }
  };

  try {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");
    log(`✓ RC tag report written → ${path.relative(root, reportPath)}`);
  } catch (err) {
    console.warn("⚠ Failed to write RC tag report:", err && err.message);
  }

  log("");
  log("✅ Release Candidate Tagging completed.");
  log(`   Review tag with: git show "${tagName}"`);
  log(`   Push to remote (optional): ${pushHint}`);
}

main();
