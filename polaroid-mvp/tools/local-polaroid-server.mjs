#!/usr/bin/env node
/**
 * Polaroid MVP local server:
 * - Serves repo-root static content (focus: /polaroid-mvp/*)
 * - Health endpoints: /health and /polaroid-mvp/health
 * - Events endpoint: POST /polaroid-mvp/events (ndjson append)
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { URL } from "node:url";

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || "8088");
const ROOT = process.cwd();
const POLAROID_DIR = path.join(ROOT, "polaroid-mvp");
const EVENTS_FILE = path.join(POLAROID_DIR, "events.ndjson");

function send(res, code, headers, body) {
  res.writeHead(code, headers);
  res.end(body);
}

function sendJson(res, code, obj) {
  send(res, code, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }, JSON.stringify(obj));
}

function safeJoin(base, rel) {
  const p = path.normalize(path.join(base, rel));
  if (!p.startsWith(base)) return null;
  return p;
}

function mime(p) {
  const ext = path.extname(p).toLowerCase();
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".js") return "application/javascript; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".json") return "application/json; charset=utf-8";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".svg") return "image/svg+xml; charset=utf-8";
  if (ext === ".txt") return "text/plain; charset=utf-8";
  return "application/octet-stream";
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const pathname = u.pathname;

  // Health endpoints
  if (req.method === "GET" && (pathname === "/health" || pathname === "/polaroid-mvp/health")) {
    return sendJson(res, 200, {
      ok: true,
      service: "polaroid-local",
      host: HOST,
      port: PORT,
      ts: new Date().toISOString(),
    });
  }

  // Events endpoint: POST /polaroid-mvp/events (ndjson)
  if (pathname === "/polaroid-mvp/events" && req.method === "POST") {
    try {
      const body = await readBody(req);
      const line = body.toString("utf8").trim();
      if (!line) return sendJson(res, 400, { ok: false, error: "empty body" });
      // minimal validation: must be JSON object
      let obj;
      try { obj = JSON.parse(line); } catch { return sendJson(res, 400, { ok: false, error: "invalid json" }); }
      if (typeof obj !== "object" || obj === null) return sendJson(res, 400, { ok: false, error: "json must be object" });

      fs.mkdirSync(POLAROID_DIR, { recursive: true });
      fs.appendFileSync(EVENTS_FILE, `${JSON.stringify(obj)}\n`, "utf8");
      return sendJson(res, 200, { ok: true });
    } catch (e) {
      return sendJson(res, 500, { ok: false, error: String(e?.message || e) });
    }
  }

  // Redirect convenience: / -> /polaroid-mvp/index.html
  if (req.method === "GET" && pathname === "/") {
    res.writeHead(302, { location: "/polaroid-mvp/index.html" });
    return res.end();
  }

  // Static serving (repo root, but path traversal protected)
  if (req.method === "GET" || req.method === "HEAD") {
    const target = pathname.replace(/^\/+/, "");
    const abs = safeJoin(ROOT, target);
    if (!abs) return sendJson(res, 400, { ok: false, error: "bad path" });

    let stat;
    try { stat = fs.statSync(abs); } catch { stat = null; }
    if (stat && stat.isDirectory()) {
      const idx = path.join(abs, "index.html");
      try { fs.statSync(idx); } catch { return sendJson(res, 404, { ok: false, error: "not found" }); }
      const data = fs.readFileSync(idx);
      res.writeHead(200, { "content-type": mime(idx), "cache-control": "no-store" });
      if (req.method === "HEAD") return res.end();
      return res.end(data);
    }
    if (stat && stat.isFile()) {
      const data = fs.readFileSync(abs);
      res.writeHead(200, { "content-type": mime(abs), "cache-control": "no-store" });
      if (req.method === "HEAD") return res.end();
      return res.end(data);
    }
    return sendJson(res, 404, { ok: false, error: "not found" });
  }

  return sendJson(res, 405, { ok: false, error: "method not allowed" });
});

server.on("error", (e) => {
  // Keep output readable for shell smoke scripts
  console.error("SERVER_ERROR", e?.code || "", String(e?.message || e));
  process.exit(2);
});

server.listen(PORT, HOST, () => {
  console.log(`POLAROID_LOCAL_SERVER_LISTENING http://${HOST}:${PORT}/polaroid-mvp/index.html`);
});
