import { NextResponse } from "next/server";
import { fypYoutubeVideos, getFypYoutubeFeedSummary } from "@/src/core/fyp/youtubeFeed";

export async function GET() {
  return NextResponse.json({
    ok: true,
    summary: getFypYoutubeFeedSummary(),
    videos: fypYoutubeVideos
  });
}
