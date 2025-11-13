import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type AdsTimeseriesPoint = {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
};

type AdsAnalyticsTimeseriesResponse = {
  ok: true;
  placeholder: boolean;
  granularity: "day";
  points: AdsTimeseriesPoint[];
};

function buildEmptyWindow(days: number): AdsTimeseriesPoint[] {
  const out: AdsTimeseriesPoint[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    out.push({
      date: d.toISOString().slice(0, 10),
      impressions: 0,
      clicks: 0,
      conversions: 0,
      spend: 0,
    });
  }

  return out;
}

export async function GET() {
  try {
    const days = 14;
    const response: AdsAnalyticsTimeseriesResponse = {
      ok: true,
      placeholder: true,
      granularity: "day",
      points: buildEmptyWindow(days),
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "x-lumora-analytics-source": "placeholder",
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    console.error("ads/analytics/timeseries error", err);
    return NextResponse.json(
      {
        ok: false,
        error: "ads_analytics_timeseries_failed",
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
