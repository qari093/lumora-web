import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      ok: true,
      source: "lumora_wallet_summary_v1",
      summary: {
        status: "active",
        balance: 1250,
        rewardsReady: true,
        recentTransactions: 6,
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "wallet_summary_failed" },
      { status: 500 }
    );
  }
}
