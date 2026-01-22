import { exec } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const BASE = process.env.BASE_URL || "http://127.0.0.1:3000";

async function isHealthy(): Promise<boolean> {
  try {
    const r = await fetch(new URL("/api/health", BASE), { cache: "no-store" });
    return r.ok;
  } catch {
    return false;
  }
}

export async function ensureServerReady(timeoutMs = 120_000) {
  const start = Date.now();

  if (await isHealthy()) return;

  exec("PORT=3000 npx next dev >/tmp/next-dev.test.out 2>&1 &");

  while (Date.now() - start < timeoutMs) {
    if (await isHealthy()) return;
    await sleep(750);
  }

  throw new Error("Test server not healthy within timeout");
}
