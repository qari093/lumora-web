#!/bin/sh
set -e

PROJECT_ROOT="${PROJECT_ROOT:-$HOME/lumora-web}"
LOCK_FILE="$PROJECT_ROOT/branding/_locks/geometry_lock.step3.json"
SPECTRUM_FILE="$PROJECT_ROOT/branding/_locks/blade_color_spectrum_lock.step2.json"

[ -f "$LOCK_FILE" ] || { echo "❌ missing geometry lock: $LOCK_FILE"; exit 1; }
[ -f "$SPECTRUM_FILE" ] || { echo "❌ missing spectrum lock: $SPECTRUM_FILE"; exit 1; }

export PROJECT_ROOT LOCK_FILE SPECTRUM_FILE
node <<'NODE'
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.env.PROJECT_ROOT;
const lockFile = process.env.LOCK_FILE;
const spectrumFile = process.env.SPECTRUM_FILE;

function fail(msg){
  console.error("❌ " + msg);
  process.exit(1);
}

const lock = JSON.parse(fs.readFileSync(lockFile, "utf8"));
const bladeRel = lock?.assets?.blade?.path;
const expectedSha = lock?.assets?.blade?.sha256;

if (!bladeRel || !expectedSha) fail("geometry lock missing assets.blade.{path,sha256}");

const bladeAbs = path.join(root, bladeRel);
if (!fs.existsSync(bladeAbs)) fail(`blade asset missing: ${bladeRel}`);

const svgBuf = fs.readFileSync(bladeAbs);
const actualSha = crypto.createHash("sha256").update(svgBuf).digest("hex");

if (actualSha !== expectedSha){
  fail(`blade SHA mismatch\n  expected: ${expectedSha}\n  actual:   ${actualSha}\n  file:     ${bladeRel}`);
}

const spectrum = JSON.parse(fs.readFileSync(spectrumFile, "utf8"));
const expectedTokens = Array.isArray(spectrum?.colorTokens) ? spectrum.colorTokens.slice().sort() : null;
if (!expectedTokens) fail("spectrum lock missing colorTokens array");

const svgText = svgBuf.toString("utf8").replace(/\r/g, "");
const foundTokens = (svgText.match(/#[0-9a-f]{3,8}\b|rgba?\([^)]+\)|hsla?\([^)]+\)/gi) || [])
  .map(s => s.toLowerCase().replace(/\s+/g," ").replace(/ ,/g,",").replace(/, /g,","))
  .sort();

function sameArray(a,b){
  if (a.length !== b.length) return false;
  for (let i=0;i<a.length;i++) if (a[i] !== b[i]) return false;
  return true;
}

if (!sameArray(foundTokens, expectedTokens)){
  fail(
    `blade color token mismatch\n` +
    `  expected(${expectedTokens.length}): ${expectedTokens.join(", ")}\n` +
    `  found(${foundTokens.length}): ${foundTokens.join(", ")}\n` +
    `  file: ${bladeRel}`
  );
}

console.log("✓ No-touch blade guard OK");
NODE
