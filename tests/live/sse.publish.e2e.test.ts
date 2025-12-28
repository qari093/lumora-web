import { describe, expect, test } from "vitest";
import { spawn } from "node:child_process";

function getBase(): string {
  const b =
    process.env.BASE ||
    process.env.npm_package_config_base ||
    process.env.npm_config_base ||
    "http://127.0.0.1:3000";
  return String(b).replace(/\/+$/, "");
}



function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function spawnCurlSSE(url: string) {
  const args = ["-sS", "-N", "-H", "accept: text/event-stream", url];
  const cp = spawn("curl", args, { stdio: ["ignore", "pipe", "pipe"] });

  let out = "";
  let err = "";

  cp.stdout.setEncoding("utf8");
  cp.stderr.setEncoding("utf8");

  cp.stdout.on("data", (d) => (out += d));
  cp.stderr.on("data", (d) => (err += d));

  const kill = () => {
    try {
      cp.kill("SIGKILL");
    } catch {}
  };

  return {
    proc: cp,
    readAll: () => out,
    readErr: () => err,
    kill,
  };
}

async function postJson(url: string, body: any) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const t = await r.text();
  return { status: r.status, text: t };
}

describe("Live SSE publish E2E", () => {
  test(
    "SSE stream receives published event",
    async () => {
      const base = getBase();
      const roomId = "demo-room";
      const sseUrl = `${base}/api/live/events?roomId=${encodeURIComponent(roomId)}`;
      const publishUrl = `${base}/api/live/publish`;

      // Start SSE stream via curl (reliable streaming)
      const sse = spawnCurlSSE(sseUrl);

      // Wait for connected marker
      const deadlineConnected = Date.now() + 10_000;
      while (Date.now() < deadlineConnected) {
        if (sse.readAll().toLowerCase().includes("event: connected")) break;
        await sleep(80);
      }
      for (let i = 0; i < 80; i++) {
        if (sse.readAll().toLowerCase().includes("event: connected")) break;
        await sleep(80);
      }
      expect(sse.readAll().toLowerCase()).toContain("event: connected");

      // Publish event
      const pub = await postJson(publishUrl, { roomId, kind: "event" });
      expect(pub.status).toBe(200);
      expect(pub.text.toLowerCase()).toContain('"ok":true');

      // Wait for published marker to appear in the SSE stream
      const deadlinePublished = Date.now() + 15_000;
      while (Date.now() < deadlinePublished) {
        if (sse.readAll().toLowerCase().includes("event: published")) break;
        await sleep(80);
      }

      const all = sse.readAll();
      const allLower = all.toLowerCase();
      sse.kill();

      // Assert stream actually received published event
      expect(allLower).toContain("event: event");
      expect(allLower).toContain('"roomid":"demo-room"');
      expect(allLower).toContain('"kind":"event"');
    },
    30_000
  );
});
