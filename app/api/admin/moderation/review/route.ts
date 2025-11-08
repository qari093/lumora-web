import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

type ReviewBody = { uid?: string; action?: "APPROVE" | "REJECT" };

function requireAdmin(req: Request) {
  const token = req.headers.get("x-admin-token") || "";
  const ok = token && token === (process.env.ADMIN_TOKEN || "dev-admin-token");
  if (!ok) {
    const err: any = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
}

function sanitize<T>(obj: T): T {
  // Strip BigInt (cast to number) so NextResponse.json won't throw
  return JSON.parse(
    JSON.stringify(obj, (_k, v) => (typeof v === "bigint" ? Number(v) : v))
  );
}

export async function POST(req: Request) {
  try {
    requireAdmin(req);
    const body = (await req.json()) as ReviewBody;
    const uid = (body.uid || "").trim();
    const action = body.action;

    if (!uid || !action || !["APPROVE", "REJECT"].includes(action)) {
      return NextResponse.json(
        { ok: false, error: "uid and action(APPROVE|REJECT) are required" },
        { status: 400 }
      );
    }

    const video = await prisma.streamVideo.findUnique({
      where: { uid },
      select: { id: true, uid: true, ownerId: true, status: true, readyToStream: true },
    });
    if (!video) {
      return NextResponse.json(
        { ok: false, error: "video not found", uid },
        { status: 404 }
      );
    }

    const updated =
      action === "APPROVE"
        ? await prisma.streamVideo.update({
            where: { uid },
            data: { status: "ready", readyToStream: true },
            select: {
              id: true,
              uid: true,
              ownerId: true,
              status: true,
              readyToStream: true,
            },
          })
        : await prisma.streamVideo.update({
            where: { uid },
            data: { status: "rejected", readyToStream: false },
            select: {
              id: true,
              uid: true,
              ownerId: true,
              status: true,
              readyToStream: true,
            },
          });

    return NextResponse.json(
      sanitize({
        ok: true,
        action,
        item: updated,
        requestId: Math.random().toString(36).slice(2),
      })
    );
  } catch (err: any) {
    const status = Number(err?.status) || 500;
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status }
    );
  }
}