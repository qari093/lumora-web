import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type AdsTotals = {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
};

type ChannelBreakdown = {
  channel: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
};

type FormatBreakdown = {
  format: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
};

type AdsAnalyticsSummaryResponse = {
  ok: true;
  placeholder: boolean;
  updatedAt: string;
  totals: AdsTotals;
  byChannel: ChannelBreakdown[];
  byFormat: FormatBreakdown[];
};

function getDefaultTotals(): AdsTotals {
  return {
    impressions: 0,
    clicks: 0,
    conversions: 0,
    spend: 0,
  };
}

export async function GET() {
  try {
    const now = new Date().toISOString();

    const response: AdsAnalyticsSummaryResponse = {
      ok: true,
      placeholder: true,
      updatedAt: now,
      totals: getDefaultTotals(),
      byChannel: [
        { channel: "fyp", ...getDefaultTotals() },
        { channel: "search", ...getDefaultTotals() },
        { channel: "profile", ...getDefaultTotals() },
      ],
      byFormat: [
        { format: "video", ...getDefaultTotals() },
        { format: "image", ...getDefaultTotals() },
        { format: "story", ...getDefaultTotals() },
      ],
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "x-lumora-analytics-source": "placeholder",
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    console.error("ads/analytics/summary error", err);
    return NextResponse.json(
      {
        ok: false,
        error: "ads_analytics_summary_failed",
      },
      {
        status: 200,
        headers: {
          "x-lumora-analytics-source": "placeholder-error",
          "cache-control": "no-store",
        },
      },
    );
  }
}
