import { NextResponse } from "next/server";
import { availablePayoutMethods } from "@/src/core/zenwallet/creator/creatorSeparation";

export async function GET() {
  return NextResponse.json({ ok: true, payoutMethods: availablePayoutMethods("DE") });
}
