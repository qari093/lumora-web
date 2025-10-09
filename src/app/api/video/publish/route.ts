import { NextResponse } from "next/server";
// import { saveToFeed, awardZencoin } from "@/lib/your-feed";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { id, path, userId } = await req.json();
  // await saveToFeed({ id, url: path, userId });
  // await awardZencoin(userId, { amount: 1, reason: "ai_video_publish" });
  return NextResponse.json({ ok: true });
}
