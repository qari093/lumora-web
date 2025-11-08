import { NextResponse } from "next/server";

export const config = { matcher: ["/api/:path*"] };

const BUCKET: Map<string, { tokens: number; updatedAt: number }> = new Map();

function allow(key: string, capacity: number, refillPerSec: number) {
  const now = Date.now();
  const rec = BUCKET.get(key) ?? { tokens: capacity, updatedAt: now };
  const elapsedSec = (now - rec.updatedAt) / 1000;
  const refill = elapsedSec * refillPerSec;
  rec.tokens = Math.min(capacity, rec.tokens + refill);
  rec.updatedAt = now;
  if (rec.tokens < 1) {
    BUCKET.set(key, rec);
    return false;
  }
  rec.tokens -= 1;
  BUCKET.set(key, rec);
  return true;
}

export function middleware(req: Request) {
  const url = new URL(req.url);
  const path = url.pathname;
  const ip =
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    req.headers.get("cf-connecting-ip") ||
    "0.0.0.0";

  if (req.method === "OPTIONS") return NextResponse.next();

  // Admin token early gate
  if (path.startsWith("/api/admin/")) {
    const hdr = req.headers.get("x-admin-token") || "";
    const expected = process.env.ADMIN_TOKEN || "dev-admin-token";
    if (!hdr || hdr !== expected) {
      return NextResponse.json({ ok: false, error: "Unauthorized (admin)" }, { status: 401 });
    }
  }

  // Default 60/min per IP
  let capacity = 60;
  let refillPerSec = capacity / 60;

  if (path === "/api/stripe/webhook") capacity = 20;
  if (path === "/api/stream/upload-token") capacity = 15;
  if (path.startsWith("/api/admin/")) capacity = 30;

  const ok = allow(`${ip}:${path}`, capacity, refillPerSec);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Rate limit exceeded" }, { status: 429 });
  }

  return NextResponse.next();
}
