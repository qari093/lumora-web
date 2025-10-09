import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

export async function GET(req: Request) {
  const u = new URL(req.url);
  const room = u.searchParams.get("room") || "lobby";
  const name = u.searchParams.get("name") || "Guest";
  const role = (u.searchParams.get("role") || "viewer") as "host" | "viewer";

  const LIVEKIT_URL = process.env.LIVEKIT_URL!;
  const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY!;
  const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET!;
  if (!LIVEKIT_URL || !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET) {
    return NextResponse.json({ error: "Missing LIVEKIT_URL / LIVEKIT_API_KEY / LIVEKIT_API_SECRET in .env" }, { status: 500 });
  }

  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: `${name}-${Math.random().toString(36).slice(2,7)}`,
    name,
  });
  at.addGrant({
    room,
    roomJoin: true,
    canPublish: role === "host",
    canSubscribe: true,
    canPublishData: true,
  });

  const token = await at.toJwt();
  return NextResponse.json({ token, url: LIVEKIT_URL, room, role, name });
}
