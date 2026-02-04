/**
 * Vitest global setup for Lumora launch suites.
 *
 * IMPORTANT: Vitest expects this file to default-export an async function
 * that optionally returns a teardown function.
 *
 * We start a Next server once per vitest run, set an env base URL for tests,
 * and ensure teardown stops the server to avoid hanging-process reporter.
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { startNextTestServer, type NextServerHandle } from "./next.testServer";

let handle: NextServerHandle | null = null;

function hasNextBuild(): boolean {
  try {
    const p = path.join(process.cwd(), ".next", "BUILD_ID");
    return fs.existsSync(p) && fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

function markerPath(): string {
  return path.join(process.cwd(), ".quarantine", "vitest_next_build.marker");
}

function isMarkerFresh(maxAgeMs: number): boolean {
  try {
    const p = markerPath();
    if (!fs.existsSync(p)) return false;
    const st = fs.statSync(p);
    return Date.now() - st.mtimeMs < maxAgeMs;
  } catch {
    return false;
  }
}

function writeMarker(): void {
  const p = markerPath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, String(Date.now()) + "\n", "utf8");
}

function ensureNextBuild(): void {
  if (process.env.NEXT_TEST_FORCE_BUILD === "1") {
    execSync("npx -y next build", { stdio: "inherit" });
    writeMarker();
    return;
  }

  const fresh = isMarkerFresh(6 * 60 * 60 * 1000); // 6h
  if (hasNextBuild() && fresh) return;

  if (hasNextBuild() && !process.env.NEXT_TEST_REQUIRE_FRESH_BUILD) {
    writeMarker();
    return;
  }

  execSync("npx -y next build", { stdio: "inherit" });
  writeMarker();
}

export default async function globalSetup(): Promise<() => Promise<void>> {
  ensureNextBuild();

  if (!handle) {
    handle = await startNextTestServer({
      port: Number(process.env.NEXT_TEST_PORT || 4173),
      mode: "start",
      quiet: process.env.NEXT_TEST_VERBOSE !== "1",
      waitMs: 120000,
    });
  }

  // Make tests deterministic: they should call this base URL.
  process.env.LUMORA_TEST_BASE_URL = handle.baseUrl;

  // Return teardown
  return async () => {
    try {
      await handle?.stop?.();
    } finally {
      handle = null;
      delete process.env.LUMORA_TEST_BASE_URL;
    }
  };
}
