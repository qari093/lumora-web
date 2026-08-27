import { NextResponse } from "next/server";
import { requireUserSession, userPrivateNoStoreHeaders } from "@/src/lib/auth/requireUserSession";
import {
  listMessagesForActor,
  sendMessageForActor,
} from "@/src/core/lumalink/persistence";

export async function GET(req: Request) {
  const auth = await requireUserSession();
  if (!auth.ok) return auth.response;

  try {
    const conversationId =
      new URL(req.url).searchParams.get("conversationId") ?? "";

    const messages = await listMessagesForActor(
      auth.identity.userId,
      conversationId,
    );

    return NextResponse.json(
      { ok: true, messages },
      { headers: userPrivateNoStoreHeaders() },
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "message_read_failed" },
      { status: 400, headers: userPrivateNoStoreHeaders() },
    );
  }
}

export async function POST(req: Request) {
  const auth = await requireUserSession();
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);

  try {
    const message = await sendMessageForActor(auth.identity.userId, {
      recipientId: body?.recipientId,
      groupId: body?.groupId,
      body: body?.body,
    });

    return NextResponse.json(
      { ok: true, message },
      { status: 201, headers: userPrivateNoStoreHeaders() },
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "message_send_failed" },
      { status: 400, headers: userPrivateNoStoreHeaders() },
    );
  }
}
