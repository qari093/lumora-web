import http from "node:http";

const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || "3040");

const pages = [
  ["/portals", "Portals"],
  ["/fyp", "FYP"],
  ["/videos", "Videos"],
  ["/gmar", "GMAR"],
  ["/nexa", "NEXA"],
  ["/movies", "CineVerse Movies"],
  ["/music", "Lumora Echo"],
  ["/live", "Live"],
];

function get(path) {
  return new Promise((resolve) => {
    const req = http.request(
      { host, port, path, method: "GET", timeout: 12000, headers: { "User-Agent": "lumora-smoke" } },
      (res) => {
        const chunks = [];
        res.on("data", (d) => chunks.push(d));
        res.on("end", () => {
          const body = Buffer.concat(chunks).toString("utf8");
          resolve({ path, status: res.statusCode || 0, body });
        });
      }
    );
    req.on("error", () => resolve({ path, status: 0, body: "" }));
    req.on("timeout", () => {
      req.destroy();
      resolve({ path, status: 0, body: "" });
    });
    req.end();
  });
}

let bad = 0;
for (const [path, must] of pages) {
  const r = await get(path);
  const ok = r.status === 200 && r.body.toLowerCase().includes(must.toLowerCase());
  const line = `${path.padEnd(12)} ${String(r.status).padEnd(4)} ${ok ? "✓" : "❌"} (${must})`;
  console.log(line);
  if (!ok) bad++;
}

process.exit(bad === 0 ? 0 : 2);
