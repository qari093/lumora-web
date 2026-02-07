import http from "node:http";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || "3055", 10);
const HOST = process.env.HOST || "127.0.0.1";
const CC_TARGET = process.env.CC_TARGET || "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";
const MANIFEST_PATH = path.join(process.cwd(), "public", "manifest.webmanifest");

function serveManifest(req, res, pathname) {
  console.log(`[manifest] intercept pathname="${pathname}" method=${req.method}`);
  let data;
  let st;
  try {
    data = readFileSync(MANIFEST_PATH);
    st = statSync(MANIFEST_PATH);
  } catch {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("X-Lumora-Server", "custom");
    res.setHeader("X-Lumora-Manifest", "1");
    res.end("manifest_not_found");
    return true;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
  res.setHeader("Cache-Control", CC_TARGET);
  res.setHeader("Last-Modified", new Date(st.mtimeMs).toUTCString());
  res.setHeader("X-Lumora-Server", "custom");
  res.setHeader("X-Lumora-Manifest", "1");
  res.end(data);
  return true;
}

async function main() {
  const nextMod = await import("next");
  const next = nextMod.default;
  const app = next({ dev: false, hostname: HOST, port: PORT });
  const handle = app.getRequestHandler();
  await app.prepare();

  const server = http.createServer(async (req, res) => {
    try {
      const rawHost = req.headers.host || `${HOST}:${PORT}`;
      const u = new URL(req.url || "/", `http://${rawHost}`);
      const p = u.pathname;

      if (p === "/manifest.webmanifest" || p === "/manifest.webmanifest/") {
        if (serveManifest(req, res, p)) return;
      }

      await handle(req, res);
    } catch (e) {
      console.error("internal_error", e);
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("X-Lumora-Server", "custom");
      res.end("internal_error");
    }
  });

  server.on("error", (e) => {
    console.error("server_error", e);
    process.exit(1);
  });

  server.listen(PORT, HOST, () => {
    console.log(`✓ lumora_prod_server listening on http://${HOST}:${PORT}`);
    console.log(`✓ CC_TARGET="${CC_TARGET}"`);
  });
}

main().catch((e) => {
  console.error("❌ failed to start custom prod server", e);
  process.exit(1);
});
