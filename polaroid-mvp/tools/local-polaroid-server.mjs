import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Repo root is two levels up: polaroid-mvp/tools/...
const repoRoot = path.resolve(__dirname, "..", "..");
const polaroidRoot = path.join(repoRoot, "polaroid-mvp");
const outNdjson = path.join(polaroidRoot, "events.ndjson");

const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || "8088");

function send(res, code, headers, body) {
  res.writeHead(code, headers);
  if (body) res.end(body);
  else res.end();
}

function safeJoin(base, unsafeRel) {
  const rel = unsafeRel.replace(/^\/+/, "");
  const target = path.resolve(base, rel);
  if (!target.startsWith(base + path.sep) && target !== base) return null;
  return target;
}

function contentType(p) {
  const ext = path.extname(p).toLowerCase();
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".js") return "application/javascript; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".json") return "application/json; charset=utf-8";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".svg") return "image/svg+xml; charset=utf-8";
  if (ext === ".txt" || ext === ".md") return "text/plain; charset=utf-8";
  return "application/octet-stream";
}

function readBody(req, limitBytes = 512 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > limitBytes) {
        reject(new Error("payload too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    const pathname = url.pathname;

    // Health
    if (req.method === "GET" && pathname === "/polaroid-mvp/health") {
      return send(res, 200, { "content-type": "application/json; charset=utf-8" }, JSON.stringify({ ok: true }));
    }

    // NDJSON receiver
    if (req.method === "POST" && pathname === "/polaroid-mvp/events.ndjson") {
      const body = await readBody(req);
      // Normalize to LF + ensure trailing newline
      const text = body.toString("utf8").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
      // Basic sanity: allow empty but still 204
      fs.mkdirSync(path.dirname(outNdjson), { recursive: true });
      fs.appendFileSync(outNdjson, text.endsWith("\n") ? text : text + "\n", "utf8");
      return send(res, 204, { "cache-control": "no-store" });
    }

    // Static serving for /polaroid-mvp/*
    if (req.method === "GET" && (pathname === "/polaroid-mvp" || pathname.startsWith("/polaroid-mvp/"))) {
      const rel = pathname === "/polaroid-mvp" ? "/polaroid-mvp/index.html" : pathname;
      const relFromPolaroid = rel.replace(/^\/polaroid-mvp\/?/, "");
      const filePath = safeJoin(polaroidRoot, relFromPolaroid || "index.html");
      if (!filePath) return send(res, 400, { "content-type": "text/plain; charset=utf-8" }, "bad path");

      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        return send(res, 404, { "content-type": "text/plain; charset=utf-8" }, "not found");
      }
      const buf = fs.readFileSync(filePath);
      return send(res, 200, { "content-type": contentType(filePath), "cache-control": "no-store" }, buf);
    }

    // Default
    return send(res, 404, { "content-type": "text/plain; charset=utf-8" }, "not found");
  } catch (e) {
    return send(res, 500, { "content-type": "text/plain; charset=utf-8" }, "server error");
  }
});

server.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`POLAROID_LOCAL_SERVER_OK http://${host}:${port}/polaroid-mvp/index.html`);
});
