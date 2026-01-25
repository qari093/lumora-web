import { startNextTestServer, stopNextTestServer, getNextTestBaseUrl } from "./nextTestServer";

type EnsureOpts = { timeoutMs?: number; port?: number; quiet?: boolean; outDir?: string };

export async function ensureServer(opts: EnsureOpts = {}) {
  const port = opts.port ?? (Number(process.env.PORT) || 3000);
  // keep BASE_URL deterministic (avoid "/" which breaks URL())
  if (!process.env.BASE_URL || process.env.BASE_URL === "/") {
    process.env.BASE_URL = `http://127.0.0.1:${port}`;
  }
  await startNextTestServer({
    timeoutMs: opts.timeoutMs ?? 90000,
    port,
    quiet: opts.quiet ?? true,
    outDir: opts.outDir,
  });
}

export async function shutdownServer() {
  await stopNextTestServer();
}

export function baseUrl() {
  return getNextTestBaseUrl();
}
