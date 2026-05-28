import { NextResponse } from "next/server";
import { createUnexpectedGift } from "@/lib/personalization/unexpectedGift";

export async function GET() {
  return NextResponse.json({
    ok: true,
    gift: createUnexpectedGift({
      preferredLane: "Silent Wonder",
      replayDepth: 3,
      skippedRecently: false
    })
  });
}
