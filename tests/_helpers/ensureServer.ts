import * as NextTestServer from "./nextTestServer";

let started = false;

export async function ensureServer(opts?: { port?: number; timeoutMs?: number }) {
  if (started) return;
  await NextTestServer.startNextTestServer({
    port: opts?.port,
    timeoutMs: opts?.timeoutMs,
  });
  started = true;
}

export async function shutdownServer() {
  await NextTestServer.shutdownServer();
  started = false;
}

export const stopNextTestServer = shutdownServer;
export const getNextTestBaseUrl = NextTestServer.getNextTestBaseUrl;
