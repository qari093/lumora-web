// import { saveToFeed, awardZencoin } from "@/lib/your-feed";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { _id, _path, _userId } = await req.json();
  // await saveToFeed({ _id, url: _path, _userId });
  // await awardZencoin(_userId, { amount: 1, reason: "ai_video_publish" });
  return NextResponse.json({ ok: true });
}
