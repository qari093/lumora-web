import fs from "fs";
import path from "path";
import { extractSignals } from "./parser";
import { attachTopics } from "@/src/lib/activation/topicCluster";
import { dedupeSignals } from "@/src/lib/activation/dedupeSignals";

export const dynamic = "force-dynamic";

function latest(dir: string, prefix: string) {
  if (!fs.existsSync(dir)) return null;
  return fs.readdirSync(dir).filter((f) => f.startsWith(prefix)).sort().reverse()[0] || null;
}

export async function GET() {
  const rawDir = path.join(process.cwd(), "data", "live_ingestion_raw");
  const outDir = path.join(process.cwd(), "data", "live_signals");
  fs.mkdirSync(outDir, { recursive: true });

  const sources = [
    { prefix: "google_", source: "google_trends" },
    { prefix: "rss_", source: "rss" },
    { prefix: "reddit_", source: "reddit" }
  ];

  let signals: any[] = [];

  for (const item of sources) {
    const file = latest(rawDir, item.prefix);
    if (!file) continue;
    const raw = fs.readFileSync(path.join(rawDir, file), "utf-8");
    signals.push(...extractSignals(raw, item.source));
  }

  signals = dedupeSignals(signals);
  signals = attachTopics(signals);

  const outFile = `signals_${Date.now()}.json`;
  fs.writeFileSync(path.join(outDir, outFile), JSON.stringify(signals, null, 2), "utf-8");

  return Response.json({
    ok: true,
    live_status: signals.length ? "candidate_live" : "not_live",
    proof_status: signals.length ? "pending" : "failed",
    source_of_truth: "filesystem",
    data: {
      count: signals.length,
      file: outFile
    },
    ts: Date.now()
  });
}
