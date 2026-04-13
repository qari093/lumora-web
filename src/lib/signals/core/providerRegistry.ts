import type { LumoraSignal } from "@/types/lumora.signal";
import { ingestTikTokSignals } from "@/lib/signals/providers/tiktok";
import { ingestInstagramSignals } from "@/lib/signals/providers/instagram";
import { ingestTwitterXSignals } from "@/lib/signals/providers/twitterX";
import { ingestRedditSignals } from "@/lib/signals/providers/reddit";
import { ingestGoogleTrendsSignals } from "@/lib/signals/providers/googleTrends";
import { ingestNewsRssSignals } from "@/lib/signals/providers/newsRss";
import { ingestTwitchSignals } from "@/lib/signals/providers/twitch";

export type ProviderIngestResult = {
  provider: string;
  source: "provider" | "fixture";
  count: number;
  signals: LumoraSignal[];
  warning?: string;
};

export async function ingestAllSignalProviders(limitPerProvider = 5): Promise<ProviderIngestResult[]> {
  const results = await Promise.all([
    ingestTikTokSignals({ limit: limitPerProvider, useFixtureOnFailure: true }),
    ingestInstagramSignals({ limit: limitPerProvider, useFixtureOnFailure: true }),
    ingestTwitterXSignals({ limit: limitPerProvider, useFixtureOnFailure: true }),
    ingestRedditSignals({ limit: limitPerProvider, useFixtureOnFailure: true }),
    ingestGoogleTrendsSignals({ limit: limitPerProvider, useFixtureOnFailure: true }),
    ingestNewsRssSignals({ limit: limitPerProvider, useFixtureOnFailure: true }),
    ingestTwitchSignals({ limit: limitPerProvider, useFixtureOnFailure: true }),
  ]);

  return [
    { provider: "tiktok", source: results[0].source, count: results[0].count, signals: results[0].signals, warning: results[0].error },
    { provider: "instagram", source: results[1].source, count: results[1].count, signals: results[1].signals, warning: results[1].error },
    { provider: "twitter_x", source: results[2].source, count: results[2].count, signals: results[2].signals, warning: results[2].error },
    { provider: "reddit", source: results[3].source, count: results[3].count, signals: results[3].signals, warning: results[3].error },
    { provider: "google_trends", source: results[4].source, count: results[4].count, signals: results[4].signals, warning: results[4].error },
    { provider: "news_rss", source: results[5].source, count: results[5].count, signals: results[5].signals, warning: results[5].error },
    { provider: "twitch", source: results[6].source, count: results[6].count, signals: results[6].signals, warning: results[6].error },
  ];
}
