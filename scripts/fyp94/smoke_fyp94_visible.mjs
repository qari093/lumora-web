import http from "node:http";

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:3000${path}`, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body, headers: res.headers }));
    });
    req.on("error", reject);
    req.setTimeout(8000, () => {
      req.destroy(new Error("request_timeout"));
    });
  });
}

const feed = await get("/api/fyp94/feed");

if (feed.status !== 200) {
  throw new Error(`feed_status_${feed.status}`);
}

const parsed = JSON.parse(feed.body);

if (!parsed.ok || parsed.source !== "fyp94") {
  throw new Error("invalid_feed_contract");
}

if (!Array.isArray(parsed.items) || parsed.items.length !== 20) {
  throw new Error(`invalid_feed_count_${parsed.items?.length ?? "missing"}`);
}

if (!parsed.items.every((item) => item.playbackUrl && item.posterUrl)) {
  throw new Error("missing_playback_or_poster");
}

console.log("FYP94_VISIBLE_SMOKE_PASS");
