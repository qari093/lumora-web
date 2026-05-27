import { NextResponse } from "next/server";
import { enqueueModerationItem, getModerationQueue } from "@/src/core/creator-alchemy/moderation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();

  const item = enqueueModerationItem({
    id: String(body?.id || `mod-${Date.now()}`),
    source: body?.source || "comment",
    content: String(body?.content || ""),
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({ ok: item.result.allow, item });
}

export async function GET() {
  return NextResponse.json({ ok: true, queue: getModerationQueue() });
}
