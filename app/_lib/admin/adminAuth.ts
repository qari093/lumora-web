import { NextRequest, NextResponse } from "next/server";

export type AdminAuthResult =
  | { ok: true; mode: "key" | "dev-open"; reason?: string }
  | { ok: false; res: NextResponse };

function firstIp(req: NextRequest): string {
  const xf = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const xr = req.headers.get("x-real-ip")?.trim();
  return (xf || xr || "").trim();
}

function isPrivateLanIp(ip: string): boolean {
  // IPv4 private ranges: 10/8, 172.16/12, 192.168/16
  if (/^10\./.test(ip)) return true;
  if (/^192\.168\./.test(ip)) return true;
  const m = ip.match(/^172\.(\d{1,3})\./);
  if (m) {
    const n = Number(m[1]);
    if (n >= 16 && n <= 31) return true;
  }
  return false;
}

function isLocal(req: NextRequest): boolean {
  // If host is localhost/127.0.0.1, allow.
  const host = (req.headers.get("host") || "").toLowerCase();
  if (host.startsWith("localhost:") || host.startsWith("127.0.0.1:")) return true;

  const ip = firstIp(req);

  // In dev, these headers are often absent. Treat absent as local.
  if (!ip) return true;

  // Loopback
  if (ip === "127.0.0.1" || ip === "::1") return true;

  // Private LAN (common when Next injects x-forwarded-for as 192.168.x.x)
  if (isPrivateLanIp(ip)) return true;

  return false;
}

/**
 * Admin auth strategy:
 * - If ADMIN_API_KEY is set: require `x-admin-key` header to match.
 * - If ADMIN_API_KEY is NOT set: allow local/lan only (dev-open) and never throw.
 */
export function requireAdmin(req: NextRequest): AdminAuthResult {
  const key = process.env.ADMIN_API_KEY?.trim();

  if (!key) {
    if (!isLocal(req)) {
      return {
        ok: false,
        res: NextResponse.json(
          { ok: false, error: "admin_protected", reason: "dev-open local/lan only" },
          { status: 403 }
        ),
      };
    }
    return { ok: true, mode: "dev-open", reason: "ADMIN_API_KEY not set" };
  }

  const provided = req.headers.get("x-admin-key")?.trim() || "";
  if (provided !== key) {
    return {
      ok: false,
      res: NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 }),
    };
  }
  return { ok: true, mode: "key" };
}
