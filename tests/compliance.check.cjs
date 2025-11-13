const fs = require("fs");
const path = require("path");

function log(msg) {
  console.log(msg);
}

function fileExists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function findFiles(root, predicate) {
  const results = [];
  const stack = [root];

  while (stack.length) {
    const current = stack.pop();
    let stat;
    try {
      stat = fs.statSync(current);
    } catch {
      continue;
    }

    if (stat.isDirectory()) {
      let entries = [];
      try {
        entries = fs.readdirSync(current);
      } catch {
        continue;
      }
      for (const e of entries) {
        stack.push(path.join(current, e));
      }
    } else if (stat.isFile()) {
      if (predicate(current)) {
        results.push(current);
      }
    }
  }

  return results;
}

function scanForPatterns(root, exts, needles) {
  const matches = {};
  for (const n of needles) matches[n] = [];

  const stack = [root];
  while (stack.length) {
    const current = stack.pop();
    let stat;
    try {
      stat = fs.statSync(current);
    } catch {
      continue;
    }

    if (stat.isDirectory()) {
      let entries = [];
      try {
        entries = fs.readdirSync(current, { withFileTypes: true });
      } catch {
        continue;
      }
      for (const ent of entries) {
        stack.push(path.join(current, ent.name));
      }
    } else if (stat.isFile()) {
      const ext = path.extname(current);
      if (!exts.has(ext)) continue;

      let src;
      try {
        src = fs.readFileSync(current, "utf8");
      } catch {
        continue;
      }

      for (const n of needles) {
        if (src.includes(n)) {
          matches[n].push(current);
        }
      }
    }
  }

  return matches;
}

function printList(title, items, root) {
  log(title);
  if (!items.length) {
    log("  (none)");
    return;
  }
  for (const f of items) {
    log("  - " + path.relative(root, f));
  }
}

function main() {
  const root = process.cwd();
  log("▶️ Step 13.0 — Compliance & Privacy Review");

  // ────────────────────────────────────────────────
  // 1) Legal pages presence (privacy / terms)
  // ────────────────────────────────────────────────
  const appDir = path.join(root, "app");
  const pagesDir = path.join(root, "pages");

  const legalFiles = [];

  const checkLegal = (dir) => {
    if (!fileExists(dir)) return;
    const hits = findFiles(dir, (f) => {
      const rel = f.toLowerCase();
      return (
        rel.includes("privacy") ||
        rel.includes("terms") ||
        rel.includes("imprint") ||
        rel.includes("legal")
      );
    });
    legalFiles.push(...hits);
  };

  checkLegal(appDir);
  checkLegal(pagesDir);

  printList("• Detected potential legal/compliance pages:", legalFiles, root);

  if (!legalFiles.length) {
    console.warn(
      "⚠ No privacy/terms/imprint/legal pages detected by filename. " +
        "Ensure you expose proper legal documents before public launch."
    );
  }

  // ────────────────────────────────────────────────
  // 2) Data & tracking surfaces (geolocation, storage, notifications)
  // ────────────────────────────────────────────────
  const EXT_SET = new Set([".ts", ".tsx", ".js", ".cjs", ".mjs"]);

  const patterns = [
    "navigator.geolocation",
    "localStorage",
    "sessionStorage",
    "cookies()",
    "document.cookie",
    "Notification.requestPermission",
    "navigator.permissions",
  ];

  const patternMatches = scanForPatterns(root, EXT_SET, patterns);

  for (const key of patterns) {
    printList(`• References to '${key}':`, patternMatches[key], root);
  }

  // ────────────────────────────────────────────────
  // 3) API privacy surfaces: /api/lumaspace/*, /api/geo/consent, /api/offline/*
  //    (Just presence checks, not semantic validation)
  // ────────────────────────────────────────────────
  const mustHaveRoutes = [
    "app/api/geo/consent/route.ts",
    "app/api/lumaspace/state/route.ts",
    "app/api/offline/batch/route.ts",
    "app/api/offline/delta/sync/route.ts",
  ];

  const missing = [];
  const present = [];

  for (const rel of mustHaveRoutes) {
    const full = path.join(root, rel);
    if (fileExists(full)) {
      present.push(full);
    } else {
      missing.push(rel);
    }
  }

  printList("• Privacy-related API routes found:", present, root);

  if (missing.length) {
    log("⚠ Suggested privacy/offline-related API routes missing (ok if intentionally renamed):");
    for (const m of missing) {
      log("  - " + m);
    }
  }

  // ────────────────────────────────────────────────
  // 4) Result summary
  // ────────────────────────────────────────────────
  log("");
  log("✅ Compliance & Privacy Review completed.");
  log("   Review warnings above (legal pages, storage/geo usage) before public launch.");
}

main();
