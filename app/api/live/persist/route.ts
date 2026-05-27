import fs from "fs";
import path from "path";
import { fetchGoogleTrends } from "./google";
import { fetchReddit } from "./reddit";

export const dynamic = "force-dynamic";

async function fetchRss(): Promise<string | null> {
  try {
    const res = await fetch("https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml", {
      headers: {
        "User-Agent": "Mozilla/5.0 (LumoraRSS/1.0)",
        "Accept": "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.1"
      },
      cache: "no-store",
      redirect: "follow"
    });

    if (!res.ok) return null;

    const text = await res.text();
    return text.length > 200 ? text : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const dir = path.join(process.cwd(), "data", "live_ingestion_raw");
  fs.mkdirSync(dir, { recursive: true });

  const ts = Date.now();
  const saved: string[] = [];
  const failed: string[] = [];

  const google = await fetchGoogleTrends();
  if (google) {
    const file = `google_${ts}.xml`;
    fs.writeFileSync(path.join(dir, file), google, "utf-8");
    saved.push(file);
  } else {
    failed.push("google");
  }

  const rss = await fetchRss();
  if (rss) {
    const file = `rss_${ts}.xml`;
    fs.writeFileSync(path.join(dir, file), rss, "utf-8");
    saved.push(file);
  } else {
    failed.push("rss");
  }

  const reddit = await fetchReddit();
  if (reddit) {
    const file = `reddit_${ts}.json`;
    fs.writeFileSync(path.join(dir, file), reddit, "utf-8");
    saved.push(file);
  } else {
    failed.push("reddit");
  }

  return Response.json({
    ok: true,
    live_status: saved.length ? "candidate_live" : "not_live",
    proof_status: saved.length >= 2 ? "pending" : "failed",
    source_of_truth: "external_source",
    data: {
      saved,
      failed,
      dir
    },
    ts: Date.now()
  });
}
