import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type EcoTimeseriesPoint = {
  date: string;
  netIssuance: number;
  burned: number;
  activeWallets: number;
};

type EcoTimeseriesResponse = {
  ok: true;
  placeholder: boolean;
  granularity: "day";
  points: EcoTimeseriesPoint[];
};

function buildEcoWindow(days: number): EcoTimeseriesPoint[] {
  const out: EcoTimeseriesPoint[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    out.push({
      date: d.toISOString().slice(0, 10),
      netIssuance: 0,
      burned: 0,
      activeWallets: 0,
    });
  }

  return out;
}

export async function GET() {
  try {
    const days = 14;
    const response: EcoTimeseriesResponse = {
      ok: true,
      placeholder: true,
      granularity: "day",
      points: buildEcoWindow(days),
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "x-lumora-eco-source": "placeholder",
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    console.error("eco/timeseries error", err);
    return NextResponse.json(
      {
        ok: false,
        error: "eco_timeseries_failed",
      },
      {
        status: 200,
        headers: {
          "x-lumora-eco-source": "placeholder-error",
          "cache-control": "no-store",
        },
      },
    );
  }
}
