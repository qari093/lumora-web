import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function byPrefix(files: string[], prefix: string) {
  return files.filter((f) => f.startsWith(prefix)).sort().reverse();
}

export async function GET() {
  const dir = path.join(process.cwd(), "data", "live_ingestion_raw");
  const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];

  const google = byPrefix(files, "google_");
  const rss = byPrefix(files, "rss_");
  const reddit = byPrefix(files, "reddit_");

  return Response.json({
    ok: true,
    live_status: "candidate_live",
    proof_status: (google.length + rss.length + reddit.length) > 0 ? "pending" : "failed",
    source_of_truth: "filesystem",
    data: {
      counts: {
        google: google.length,
        rss: rss.length,
        reddit: reddit.length
      },
      latest: {
        google: google[0] || null,
        rss: rss[0] || null,
        reddit: reddit[0] || null
      }
    },
    ts: Date.now()
  });
}
