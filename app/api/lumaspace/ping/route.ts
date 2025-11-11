import { NextResponse } from "next/server";

function buildOk(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, { status: 200, ...init });
}

function buildError(message: string, status = 500) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function GET() {
  try {
    const now = new Date();
    return buildOk({
      ok: true,
      service: "LumaSpace",
      role: "health-ping",
      ts: now.toISOString(),
      unix: Math.floor(now.getTime() / 1000),
      env: process.env.NODE_ENV ?? "development",
    });
  } catch (e: any) {
    const msg = e?.message ?? String(e);
    return buildError(`LumaSpace ping failed: ${msg}`, 500);
  }
}

export async function HEAD() {
  return new Response(null, { status: 200 });
}

export const dynamic = "force-dynamic";
