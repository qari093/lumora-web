import { NextResponse } from "next/server";
import Parser from "rss-parser";

export const dynamic = "force-dynamic";

const GOOGLE_TRENDS_RSS_URL =
  "https://trends.google.com/trending/rss?geo=US";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; LumoraLive/1.0)",
    Accept: "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8"
  }
});

export async function GET() {
  try {
    const feed = await parser.parseURL(GOOGLE_TRENDS_RSS_URL);

    const items = (feed.items ?? [])
      .map((item, index) => {
        const title = item.title?.trim() ?? "";

        if (!title) {
          return null;
        }

        return {
          id: `google-trends-${index}-${Buffer.from(title)
            .toString("base64url")
            .slice(0, 20)}`,
          source: "google_trends",
          title,
          url: item.link?.trim() ?? "",
          publishedAt: item.pubDate ?? item.isoDate ?? null,
          rank: index + 1
        };
      })
      .filter(
        (
          item
        ): item is {
          id: string;
          source: string;
          title: string;
          url: string;
          publishedAt: string | null;
          rank: number;
        } => item !== null
      )
      .slice(0, 25);

    return NextResponse.json(
      {
        ok: items.length > 0,
        service: "live",
        provider: "google_trends",
        route: "/api/live/google-trends",
        live_status: items.length > 0 ? "candidate_live" : "not_live",
        proof_status: items.length > 0 ? "pending" : "failed",
        source_of_truth: "external_source",
        source: "google_trends_rss",
        count: items.length,
        items,
        ts: Date.now()
      },
      {
        status: items.length > 0 ? 200 : 503,
        headers: {
          "cache-control": "no-store"
        }
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        service: "live",
        provider: "google_trends",
        route: "/api/live/google-trends",
        live_status: "not_live",
        proof_status: "failed",
        source_of_truth: "external_source",
        source: "google_trends_rss",
        count: 0,
        items: [],
        error:
          error instanceof Error
            ? error.message
            : "google_trends_ingestion_failed",
        ts: Date.now()
      },
      {
        status: 503,
        headers: {
          "cache-control": "no-store"
        }
      }
    );
  }
}
