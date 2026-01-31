/**
 * Vitest setup: normalize AbortController/AbortSignal to what undici (Node fetch) expects.
 * Problem observed: "RequestInit: Expected signal (...) to be an instance of AbortSignal."
 *
 * Cause: tests running in jsdom/happy-dom (or mixed env) can provide a different AbortSignal class.
 * Fix: use Node's undici implementation when available, and override globals.
 */
import { beforeAll } from "vitest";

beforeAll(async () => {
  try {
    // undici is a dependency of Node's fetch; present on Node 18+ and in Next toolchains
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const undici = require("undici");
    if (undici?.AbortController && undici?.AbortSignal) {
      // Force undici's classes to be the globals seen by tests
      (globalThis as any).AbortController = undici.AbortController;
      (globalThis as any).AbortSignal = undici.AbortSignal;
    }
  } catch {
    // If undici not present, fall back to native globals (best-effort).
  }

  // If fetch is missing (older node), provide undici fetch too.
  if (!(globalThis as any).fetch) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const undici = require("undici");
      if (undici?.fetch) (globalThis as any).fetch = undici.fetch;
    } catch {}
  }
});
