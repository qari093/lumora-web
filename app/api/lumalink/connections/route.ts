import { NextResponse } from "next/server";
import {
  createConnection,
  listConnections,
  updateConnectionStatus,
} from "@/src/core/lumalink/runtime";

export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get("userId") ?? "";

  if (!userId.trim()) {
    return NextResponse.json(
      { ok: false, error: "userId_required" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    connections: listConnections(userId),
  });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  try {
    const connection = createConnection({
      requesterId: body?.requesterId,
      recipientId: body?.recipientId,
    });

    return NextResponse.json({ ok: true, connection }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "connection_failed",
      },
      { status: 400 },
    );
  }
}

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null);

  if (!["pending", "accepted", "blocked"].includes(body?.status)) {
    return NextResponse.json(
      { ok: false, error: "invalid_connection_status" },
      { status: 400 },
    );
  }

  try {
    const connection = updateConnectionStatus({
      requesterId: body?.requesterId,
      recipientId: body?.recipientId,
      status: body.status,
    });

    return NextResponse.json({ ok: true, connection });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "connection_update_failed",
      },
      { status: 404 },
    );
  }
}
