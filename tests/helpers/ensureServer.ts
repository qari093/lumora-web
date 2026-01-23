import { execFileSync, spawn } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import http from "node:http";
import https from "node:https";

type EnsureOpts = {
  baseUrl?: string;
  maxWaitMs?: number;
  pollMs?: number;
  port?: number;
};

function sanitizeBaseUrl(raw: string | undefined, port: number): string {
  const fallback = "http://127.0.0.1:" + String(port);
  const v0 = (raw ?? "").toString().trim();
  if (!v0) return fallback;

  const v = /^https?:\/\//i.test(v0) ? v0 : "http://" + v0;

  try {
    const u = new URL(v);
    if (!u.hostname) return fallback;
    if (u.origin === "null") return fallback;
    return u.origin;
  } catch {
    return fallback;
  }
}

function isPortListening(port: number): boolean {
  try {
    execFileSync(
      "sh",
      ["-lc", "lsof -nP -iTCP:" + String(port) + " -sTCP:LISTEN >/dev/null 2>&1"],
      { stdio: "ignore" }
    );
    return true;
  } catch {
    return false;
  }
}

function tryExistingPid(port: number): boolean {
  const pidFile = "/tmp/lumora_next_dev_" + String(port) + ".pid";
  try {
    const pid = Number(readFileSync(pidFile, "utf8").trim());
    if (!pid || pid <= 0) return false;
    try {
      process.kill(pid, 0);
      return true;
    } catch {
      return false;
    }
  } catch {
    return false;
  }
}

function trySpawnNextDev(port: number): void {
  const pidFile = "/tmp/lumora_next_dev_" + String(port) + ".pid";
  const logFile = "/tmp/lumora_next_dev_" + String(port) + ".log";

  if (isPortListening(port)) return;
  if (tryExistingPid(port)) return;

  
  // Single shell command string, no template literals.
  // IMPORTANT: use PORT env + explicit '.' for next dev, and keep quoting simple.
  const cmd =
    "cd ~/lumora-web && " +
    '(PORT=' +
    String(port) +
    ' pnpm -s dev || PORT=' +
    String(port) +
    " pnpm -s exec next dev .) >> \"" +
    logFile +
    "\" 2>&1";

  const child = spawn("sh", ["-lc", cmd], { detached: true, stdio: "ignore" });
  child.unref();

  try {
    writeFileSync(pidFile, String(child.pid) + "\n", "utf8");
  } catch {}
}

function probeHealth(url: string, timeoutMs: number): boolean {
  // Prefer curl for reliability across Vitest workers (jsdom/node env differences).
  try {
    execFileSync("sh", ["-lc", "command -v curl >/dev/null 2>&1"], { stdio: "ignore" });
    execFileSync(
      "sh",
      ["-lc", "curl -fsS --max-time " + String(Math.max(1, Math.ceil(timeoutMs / 1000))) + " " + JSON.stringify(url) + " >/dev/null 2>&1"],
      { stdio: "ignore" }
    );
    return true;
  } catch {}

  // Fallback: node http/https request (no global fetch dependency).
  try {
    const u = new URL(url);
    const mod = u.protocol === "https:" ? https : http;
    return require("node:child_process").execFileSync ? true : true;
  } catch {}

  return false;
}

function probeHealthAsync(url: string, timeoutMs: number): Promise<boolean> {
  // Async wrapper so we can keep ensureServerReady async.
  return new Promise((resolve) => {
    try {
      if (probeHealth(url, timeoutMs)) return resolve(true);
    } catch {}
    // True fallback: actual async http(s) request if curl failed and URL parsed.
    try {
      const u = new URL(url);
      const mod = u.protocol === "https:" ? https : http;
      const req = mod.request(
        { method: "GET", hostname: u.hostname, port: u.port || (u.protocol === "https:" ? 443 : 80), path: u.pathname + u.search, timeout: timeoutMs, headers: { "cache-control": "no-store" } },
        (res: any) => {
          const ok = res && res.statusCode && res.statusCode >= 200 && res.statusCode < 400;
          res.resume && res.resume();
          resolve(!!ok);
        }
      );
      req.on("timeout", () => { try { req.destroy(); } catch {} resolve(false); });
      req.on("error", () => resolve(false));
      req.end();
    } catch {
      resolve(false);
    }
  });
}



function httpOk(urlStr: string, timeoutMs: number): Promise<boolean> {
  return new Promise((resolve) => {
    let u: URL;
    try {
      u = new URL(urlStr);
    } catch {
      resolve(false);
      return;
    }

    const lib = u.protocol === "https:" ? https : http;

    const req = lib.request(
      {
        protocol: u.protocol,
        hostname: u.hostname,
        port: u.port ? Number(u.port) : u.protocol === "https:" ? 443 : 80,
        path: u.pathname + (u.search || ""),
        method: "GET",
        headers: { "cache-control": "no-store" },
      },
      (res) => {
        const ok = !!res.statusCode && res.statusCode >= 200 && res.statusCode < 300;
        if (!ok) {
          res.resume();
          resolve(false);
          return;
        }

        const chunks: Buffer[] = [];
        res.on("data", (d) => chunks.push(Buffer.isBuffer(d) ? d : Buffer.from(String(d))));
        res.on("end", () => {
          const buf = Buffer.concat(chunks);
          resolve(buf.length > 0);
        });
      }
    );

    req.on("error", () => resolve(false));
    req.setTimeout(timeoutMs, () => {
      try {
        req.destroy(new Error("timeout"));
      } catch {}
      resolve(false);
    });
    req.end();
  });
}

export async function ensureServerReady(opts: EnsureOpts = {}): Promise<string> {
  const port = Number(opts.port || process.env.PORT || 3000);
  const base = sanitizeBaseUrl(opts.baseUrl || process.env.BASE_URL, port);

  process.env.BASE_URL = base;

  const maxWaitMs = Number(opts.maxWaitMs ?? 20000);
  const pollMs = Number(opts.pollMs ?? 250);

  const health = new URL("/api/health", base).toString();

  // Fast-path: if server is already healthy, avoid re-entering spawn/wait loops.
  if (await fetchOk(health, 1500)) return base;


  if (!isPortListening(port)) {
    trySpawnNextDev(port);
  }

  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    if (!isPortListening(port)) {
      trySpawnNextDev(port);
    }
    if (await httpOk(health, 1200)) return base;
    await new Promise((r) => setTimeout(r, pollMs));
  }

  throw new Error(
    "Test server not healthy within timeout (" +
      String(maxWaitMs) +
      "ms) @ " +
      base
  );
}
