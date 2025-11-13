const fs = require("fs");
const path = require("path");
const { performance } = require("perf_hooks");
const { spawnSync } = require("child_process");

const BASELINE_PATH = path.join("tests", "perf.baseline.json");
const MAX_BUILD_SLOW_RATIO = 1.5;          // 50% slower allowed
const MAX_BUILD_SLOW_ABS = 2000;           // +2s absolute tolerance
const MAX_STATIC_GROWTH_RATIO = 1.2;       // 20% size growth allowed
const MAX_STATIC_GROWTH_ABS = 100 * 1024;  // +100KB absolute tolerance

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

function runBuild() {
  log("▶️ Running production build for performance guard...");
  const start = performance.now();
  const res = spawnSync("npm", ["run", "build"], {
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
  });
  const end = performance.now();
  const buildTimeMs = end - start;

  if (res.status !== 0) {
    console.error("❌ npm run build failed during performance guard.");
    process.exit(res.status || 1);
  }

  log(`✓ Build completed in ~${Math.round(buildTimeMs)} ms`);
  return buildTimeMs;
}

function walkDirCollectBytes(root) {
  let total = 0;
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
      total += stat.size;
    }
  }

  return total;
}

function collectStaticSize() {
  const staticDir = path.join(".next", "static");
  if (!fileExists(staticDir)) {
    log("⚠ .next/static not found; static size set to 0 bytes.");
    return 0;
  }
  const bytes = walkDirCollectBytes(staticDir);
  log(`• Total .next/static size: ${bytes} bytes (~${(bytes / 1024).toFixed(1)} KB)`);
  return bytes;
}

function loadBaseline() {
  if (!fileExists(BASELINE_PATH)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(BASELINE_PATH, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("⚠ Failed to parse existing baseline; ignoring and recreating.");
    return null;
  }
}

function saveBaseline(data) {
  const payload = {
    ...data,
    updatedAt: new Date().toISOString(),
    version: 1,
  };
  fs.writeFileSync(BASELINE_PATH, JSON.stringify(payload, null, 2), "utf8");
  log(`✓ Baseline saved → ${BASELINE_PATH}`);
}

function main() {
  log("▶️ Step 11.0 — Performance Regression Guard");

  const buildTimeMs = runBuild();
  const staticBytes = collectStaticSize();

  const current = { buildTimeMs, staticBytes };

  const baseline = loadBaseline();
  if (!baseline) {
    log("• No existing baseline found. Creating initial baseline from current metrics.");
    saveBaseline(current);
    log("✅ Performance baseline established. Guard will compare against this on future runs.");
    return;
  }

  log(`• Baseline build time: ~${Math.round(baseline.buildTimeMs)} ms`);
  log(`• Baseline static size: ${baseline.staticBytes} bytes (~${(baseline.staticBytes / 1024).toFixed(1)} KB)`);

  let hasRegression = false;

  // Build time check
  const buildDelta = buildTimeMs - baseline.buildTimeMs;
  const buildRatio = baseline.buildTimeMs > 0 ? buildTimeMs / baseline.buildTimeMs : 1;
  log(`• Current vs baseline build time: Δ=${Math.round(buildDelta)} ms, ratio=${buildRatio.toFixed(2)}x`);

  if (
    baseline.buildTimeMs > 0 &&
    buildTimeMs > baseline.buildTimeMs * MAX_BUILD_SLOW_RATIO &&
    buildDelta > MAX_BUILD_SLOW_ABS
  ) {
    console.error(
      `❌ Build time regression: current ~${Math.round(
        buildTimeMs
      )} ms vs baseline ~${Math.round(
        baseline.buildTimeMs
      )} ms (ratio=${buildRatio.toFixed(2)}x, Δ=${Math.round(buildDelta)} ms)`
    );
    hasRegression = true;
  }

  // Static size check
  const sizeDelta = staticBytes - baseline.staticBytes;
  const sizeRatio = baseline.staticBytes > 0 ? staticBytes / baseline.staticBytes : 1;
  log(`• Current vs baseline static size: Δ=${sizeDelta} bytes, ratio=${sizeRatio.toFixed(2)}x`);

  if (
    baseline.staticBytes > 0 &&
    staticBytes > baseline.staticBytes * MAX_STATIC_GROWTH_RATIO &&
    sizeDelta > MAX_STATIC_GROWTH_ABS
  ) {
    console.error(
      `❌ Static asset size regression: current ${staticBytes} bytes vs baseline ${baseline.staticBytes} bytes `
      + `(ratio=${sizeRatio.toFixed(2)}x, Δ=${sizeDelta} bytes)`
    );
    hasRegression = true;
  }

  if (hasRegression) {
    console.error("❌ Performance regression guard FAILED. Investigate recent changes before proceeding.");
    process.exit(1);
  }

  log("✓ No significant performance regression detected.");
  saveBaseline(current);
  log("✅ Performance Regression Guard passed.");
}

main();
