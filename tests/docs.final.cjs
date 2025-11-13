#!/usr/bin/env node
/* Step 18.0 — Documentation Final Pass */

const fs = require("fs");
const path = require("path");

function log(msg) {
  console.log(msg);
}

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function isDirectory(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function walkDocs(root, exts, ignoreDirs) {
  const results = [];
  function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (ignoreDirs.has(entry.name)) continue;
        walk(full);
      } else if (entry.isFile()) {
        if (exts.includes(path.extname(entry.name))) {
          results.push(full);
        }
      }
    }
  }
  walk(root);
  return results;
}

function scanTodos(files) {
  const todos = [];
  let totalTodoItems = 0;

  for (const file of files) {
    let content;
    try {
      content = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    const lines = content.split(/\r?\n/);
    let count = 0;
    lines.forEach((line) => {
      if (/\b(TODO|FIXME)\b/i.test(line)) count += 1;
    });
    if (count > 0) {
      todos.push({ file, count });
      totalTodoItems += count;
    }
  }

  return { todos, totalTodoItems };
}

function main() {
  log("▶️ Step 18.0 — Documentation Final Pass");

  const root = process.cwd();
  const reportPath = path.join(root, "tests", "docs_final_report.json");

  // ────────────────────────────────────────────────
  // 1) Required top-level docs
  // ────────────────────────────────────────────────
  const readmePath = path.join(root, "README.md");
  const contributingPath = path.join(root, "CONTRIBUTING.md");
  const changelogPath = path.join(root, "CHANGELOG.md");
  const docsDirPath = path.join(root, "docs");

  const readmeExists = exists(readmePath);
  const contributingExists = exists(contributingPath);
  const changelogExists = exists(changelogPath);
  const docsDirExists = exists(docsDirPath) && isDirectory(docsDirPath);

  let hardFail = false;

  if (readmeExists) {
    log(`✓ README.md found at ${path.relative(root, readmePath)}`);
  } else {
    log("❌ README.md is missing at repository root (required before release).");
    hardFail = true;
  }

  if (docsDirExists) {
    log(`✓ docs/ directory found (${path.relative(root, docsDirPath)})`);
  } else {
    log("⚠ docs/ directory not found. Consider adding structured docs under docs/.");
  }

  if (contributingExists) {
    log(`• CONTRIBUTING.md found (${path.relative(root, contributingPath)})`);
  } else {
    log("ℹ CONTRIBUTING.md not found (optional but recommended).");
  }

  if (changelogExists) {
    log(`• CHANGELOG.md found (${path.relative(root, changelogPath)})`);
  } else {
    log("ℹ CHANGELOG.md not found (optional but recommended for releases).");
  }

  // ────────────────────────────────────────────────
  // 2) Scan markdown docs for TODO/FIXME
  // ────────────────────────────────────────────────
  const ignoreDirs = new Set([
    "node_modules",
    ".git",
    ".next",
    "dist",
    "build",
    "coverage",
    ".turbo",
    ".vercel"
  ]);

  const exts = [".md", ".mdx"];
  const docRoots = [root];
  if (docsDirExists) docRoots.push(docsDirPath);

  const docFiles = [];
  for (const r of docRoots) {
    const files = walkDocs(r, exts, ignoreDirs);
    for (const f of files) {
      if (!docFiles.includes(f)) docFiles.push(f);
    }
  }

  log("");
  log(`• Markdown / MDX docs discovered: ${docFiles.length}`);

  const { todos, totalTodoItems } = scanTodos(docFiles);
  if (todos.length === 0) {
    log("✓ No TODO/FIXME markers found in documentation files.");
  } else {
    log(
      `⚠ Found ${totalTodoItems} TODO/FIXME markers across ${todos.length} documentation file(s):`
    );
    for (const t of todos.slice(0, 20)) {
      log(`  - ${path.relative(root, t.file)} (count=${t.count})`);
    }
    if (todos.length > 20) {
      log(`  ... and ${todos.length - 20} more file(s) with TODO/FIXME.`);
    }
  }

  // ────────────────────────────────────────────────
  // 3) Simple coverage hints for key areas
  // ────────────────────────────────────────────────
  const keyDocHints = [
    { key: "lumaspace", expected: ["lumaspace", "LumaSpace"] },
    { key: "ads", expected: ["ads", "campaign", "advertiser"] },
    { key: "economy", expected: ["Zencoin", "economy", "wallet"] },
    { key: "offline", expected: ["offline", "cache", "sync"] },
    { key: "hybrid", expected: ["emoji", "avatar", "hybrid"] }
  ];

  const coverage = {};
  for (const hint of keyDocHints) {
    coverage[hint.key] = false;
  }

  for (const file of docFiles) {
    let content;
    try {
      content = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    for (const hint of keyDocHints) {
      if (coverage[hint.key]) continue;
      if (hint.expected.some((tok) => content.includes(tok))) {
        coverage[hint.key] = true;
      }
    }
  }

  log("");
  log("• Key area doc hints (not hard-fail, just guidance):");
  for (const hint of keyDocHints) {
    const ok = coverage[hint.key];
    if (ok) {
      log(`  ✓ ${hint.key} — appears documented`);
    } else {
      log(`  ℹ ${hint.key} — no obvious dedicated docs detected (optional but recommended).`);
    }
  }

  // ────────────────────────────────────────────────
  // 4) Write machine-readable report
  // ────────────────────────────────────────────────
  const report = {
    timestamp: new Date().toISOString(),
    required: {
      readmeExists,
      docsDirExists
    },
    optional: {
      contributingExists,
      changelogExists
    },
    docs: {
      totalDocFiles: docFiles.length,
      todoFiles: todos.length,
      totalTodoItems
    },
    keyCoverage: coverage,
    notes: {
      message:
        "Hard fail only on missing README.md. Other fields are guidance for manual doc polish before public release."
    }
  };

  try {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");
    log(`\n✓ Documentation report written → ${path.relative(root, reportPath)}`);
  } catch (err) {
    log(`⚠ Failed to write docs report at ${reportPath}: ${err && err.message}`);
  }

  log("");
  if (hardFail) {
    console.error("❌ Documentation Final Pass FAILED (missing required README.md).");
    process.exit(1);
  } else {
    log("✅ Documentation Final Pass completed (see warnings above, if any).");
  }
}

main();
