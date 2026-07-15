import { NextResponse } from "next/server";
import {
  listMessages,
  sendMessage,
} from "@/src/core/lumalink/runtime";

export async function GET(req: Request) {
  const conversationId =
    new URL(req.url).searchParams.get("conversationId") ?? "";

  if (!conversationId.trim()) {
    return NextResponse.json(
      { ok: false, error: "conversationId_required" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    messages: listMessages(conversationId),
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  try {
    const message = sendMessage({
      senderId: body?.senderId,
      recipientId: body?.recipientId,
      groupId: body?.groupId,
      body: body?.body,
    });

    return NextResponse.json({ ok: true, message }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "message_send_failed",
      },
      { status: 400 },
    );
  }
}
