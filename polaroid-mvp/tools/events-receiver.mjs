#!/usr/bin/env node
/**
 * Minimal local NDJSON receiver for Polaroid MVP.
 * - Accepts POST to /polaroid-mvp/events.ndjson (or /events.ndjson) and appends to polaroid-mvp/events.ndjson
 * - Serves static files from repo root (GET/HEAD)
 *
 * Usage:
 *   PORT=8088 node polaroid-mvp/tools/events-receiver.mjs
 */
import http from "node:http";
import { createReadStream, createWriteStream, statSync } from "node:fs";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// repo root = two levels up from polaroid-mvp/tools/
const repoRoot = path.resolve(__dirname, "..", "..");
const outDir = path.resolve(repoRoot, "polaroid-mvp");
const outFile = path.resolve(outDir, "events.ndjson");

mkdirSync(outDir, { recursive: true });

const port = Number(process.env.PORT || "8088");
if (!Number.isFinite(port) || port <= 0 || port > 65535) {
  console.error("Invalid PORT:", process.env.PORT);
  process.exit(2);
}

function safePathFromUrl(urlPath) {
  // Prevent path traversal; map URL to repoRoot.
  const decoded = decodeURIComponent(urlPath.split("?")[0] || "/");
  const clean = decoded.replace(/\\/g, "/");
  const resolved = path.resolve(repoRoot, "." + clean);
  if (!resolved.startsWith(repoRoot)) return null;
  return resolved;
}

function send(res, code, body, headers = {}) {
  res.writeHead(code, { "content-type": "text/plain; charset=utf-8", ...headers });
  res.end(body);
}

const server = http.createServer((req, res) => {
  try {
    const method = (req.method || "GET").toUpperCase();
    const urlPath = (req.url || "/").split("?")[0] || "/";

    // Accept beacons to either /polaroid-mvp/events.ndjson or /events.ndjson
    const isEvents =
      urlPath === "/polaroid-mvp/events.ndjson" ||
      urlPath === "/events.ndjson" ||
      urlPath.endsWith("/events.ndjson");

    if (method === "POST" && isEvents) {
      let bytes = 0;
      const chunks = [];
      req.on("data", (c) => {
        bytes += c.length;
        // hard cap 256KB per request
        if (bytes > 256 * 1024) {
          req.destroy(new Error("payload too large"));
          return;
        }
        chunks.push(c);
      });
      req.on("end", () => {
        const buf = Buffer.concat(chunks);
        // accept either raw ndjson lines or JSON; normalize to NDJSON line
        let out = buf.toString("utf8").trim();
        if (!out) return send(res, 204, ""); // no content
        // If it's multiple lines already, keep as-is and ensure trailing newline.
        if (!out.endsWith("\n")) out += "\n";
        const ws = createWriteStream(outFile, { flags: "a" });
        ws.on("error", (e) => send(res, 500, "write error: " + String(e?.message || e)));
        ws.end(out, () => send(res, 204, ""));
      });
      req.on("error", () => send(res, 400, "bad request"));
      return;
    }

    if (method !== "GET" && method !== "HEAD") {
      return send(res, 405, "method not allowed");
    }

    // default doc for / => /polaroid-mvp/index.html if present
    let filePath = safePathFromUrl(urlPath === "/" ? "/polaroid-mvp/index.html" : urlPath);
    if (!filePath) return send(res, 400, "bad path");

    // If directory, try index.html
    try {
      const st = statSync(filePath);
      if (st.isDirectory()) filePath = path.join(filePath, "index.html");
    } catch (_) {
      // fallthrough
    }

    // Serve file
    const st2 = statSync(filePath);
    if (!st2.isFile()) return send(res, 404, "not found");

    const ext = path.extname(filePath).toLowerCase();
    const ctype =
      ext === ".html" ? "text/html; charset=utf-8" :
      ext === ".js"   ? "application/javascript; charset=utf-8" :
      ext === ".css"  ? "text/css; charset=utf-8" :
      ext === ".png"  ? "image/png" :
      ext === ".json" ? "application/json; charset=utf-8" :
      "application/octet-stream";

    res.writeHead(200, { "content-type": ctype, "content-length": String(st2.size) });
    if (method === "HEAD") return res.end();

    const rs = createReadStream(filePath);
    rs.on("error", () => send(res, 500, "read error"));
    rs.pipe(res);
  } catch (e) {
    return send(res, 500, "server error: " + String(e?.message || e));
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`events-receiver listening on http://127.0.0.1:${port}`);
  console.log(`serving repo root: ${repoRoot}`);
  console.log(`writing events to: ${outFile}`);
});
