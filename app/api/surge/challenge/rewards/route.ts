import { NextRequest, NextResponse } from "next/server";
import { distributeChallengeRewards } from "@/lib/surge/challengeRewards";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      typeof body?.rewardPool !== "number" ||
      !Array.isArray(body?.winners)
    ) {
      return NextResponse.json(
        { ok: false, error: "missing_reward_fields" },
        { status: 400 }
      );
    }

    const payouts = distributeChallengeRewards({
      rewardPool: body.rewardPool,
      winners: body.winners,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_challenge_rewards_v1",
      payouts,
      totalPayout: payouts.reduce((sum, item) => sum + item.payout, 0),
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "reward_distribution_failed" },
      { status: 500 }
    );
  }
}
