import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const xf = req.headers.get("x-forwarded-for") || "";
  const ip = xf.split(",")[0]?.trim() || "127.0.0.1";
  const host = req.headers.get("host") || null;

  return Response.json({
    ok: true,
    service: "whereami",
    host,
    ip,
    ts: new Date().toISOString(),
    note: "Minimal route; no external deps. Replace later with lib/ip if desired."
  });
}
