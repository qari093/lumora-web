import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type EcoSummary = {
  walletCount: number;
  totalZencoin: number;
  totalZencoinPlus: number;
  burnedZencoin: number;
  treasuryBalance: number;
};

type EcoSummaryResponse = {
  ok: true;
  placeholder: boolean;
  updatedAt: string;
  summary: EcoSummary;
};

export async function GET() {
  try {
    const now = new Date().toISOString();

    const response: EcoSummaryResponse = {
      ok: true,
      placeholder: true,
      updatedAt: now,
      summary: {
        walletCount: 0,
        totalZencoin: 0,
        totalZencoinPlus: 0,
        burnedZencoin: 0,
        treasuryBalance: 0,
      },
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "x-lumora-eco-source": "placeholder",
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    console.error("eco/summary error", err);
    return NextResponse.json(
      {
        ok: false,
        error: "eco_summary_failed",
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
