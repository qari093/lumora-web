import { ingestTikTokSignals } from "@/lib/signals/providers/tiktok";
import { ingestInstagramSignals } from "@/lib/signals/providers/instagram";
import { ingestTwitterXSignals } from "@/lib/signals/providers/twitterX";
import { ingestRedditSignals } from "@/lib/signals/providers/reddit";
import { ingestGoogleTrendsSignals } from "@/lib/signals/providers/googleTrends";
import { ingestNewsRssSignals } from "@/lib/signals/providers/newsRss";
import { ingestTwitchSignals } from "@/lib/signals/providers/twitch";

export type ProviderLatencyReport = {
  provider: string;
  source: "provider" | "fixture";
  ok: boolean;
  count: number;
  durationMs: number;
  thresholdMs: number;
  withinThreshold: boolean;
  warning?: string;
};

async function measure<T extends { source: "provider" | "fixture"; count: number; error?: string }>(
  provider: string,
  thresholdMs: number,
  fn: () => Promise<T>
): Promise<ProviderLatencyReport> {
  const startedAt = Date.now();
  const result = await fn();
  const durationMs = Date.now() - startedAt;

  return {
    provider,
    source: result.source,
    ok: true,
    count: result.count,
    durationMs,
    thresholdMs,
    withinThreshold: durationMs <= thresholdMs,
    warning: result.error,
  };
}

export async function getIngestionLatencyReport(limit = 1): Promise<ProviderLatencyReport[]> {
  return Promise.all([
    measure("tiktok", 3000, () => ingestTikTokSignals({ limit, useFixtureOnFailure: true })),
    measure("instagram", 3000, () => ingestInstagramSignals({ limit, useFixtureOnFailure: true })),
    measure("twitter_x", 3000, () => ingestTwitterXSignals({ limit, useFixtureOnFailure: true })),
    measure("reddit", 3000, () => ingestRedditSignals({ limit, useFixtureOnFailure: true })),
    measure("google_trends", 2500, () => ingestGoogleTrendsSignals({ limit, useFixtureOnFailure: true })),
    measure("news_rss", 2500, () => ingestNewsRssSignals({ limit, useFixtureOnFailure: true })),
    measure("twitch", 3000, () => ingestTwitchSignals({ limit, useFixtureOnFailure: true })),
  ]);
}
