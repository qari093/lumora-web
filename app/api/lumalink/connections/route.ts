import { NextResponse } from "next/server";
import { requireUserSession, userPrivateNoStoreHeaders } from "@/src/lib/auth/requireUserSession";
import {
  createConnectionForActor,
  listUserConnections,
  updateConnectionForActor,
} from "@/src/core/lumalink/persistence";

export async function GET() {
  const auth = await requireUserSession();
  if (!auth.ok) return auth.response;

  return NextResponse.json(
    { ok: true, connections: await listUserConnections(auth.identity.userId) },
    { headers: userPrivateNoStoreHeaders() },
  );
}

export async function POST(req: Request) {
  const auth = await requireUserSession();
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);

  try {
    const connection = await createConnectionForActor(
      auth.identity.userId,
      body?.recipientId,
    );
    return NextResponse.json(
      { ok: true, connection },
      { status: 201, headers: userPrivateNoStoreHeaders() },
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "connection_creation_failed" },
      { status: 400, headers: userPrivateNoStoreHeaders() },
    );
  }
}

export async function PATCH(req: Request) {
  const auth = await requireUserSession();
  if (!auth.ok) return auth.response;

  const body = await req.json().catch(() => null);

  try {
    const connection = await updateConnectionForActor(
      auth.identity.userId,
      body?.otherUserId ?? body?.recipientId ?? body?.requesterId,
      body?.status,
    );
    return NextResponse.json(
      { ok: true, connection },
      { headers: userPrivateNoStoreHeaders() },
    );
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "connection_update_failed" },
      { status: 400, headers: userPrivateNoStoreHeaders() },
    );
  }
}
