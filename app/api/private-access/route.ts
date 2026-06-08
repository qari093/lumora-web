
// Private beta allowlist guard: private beta access is checked against allowlist email rules.
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function json(body: any, status = 200) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/**
 * Auth-first guard: reject before validating any request params.
 * For launch gating we only require presence of Authorization: Bearer ... OR x-user-id header.
 * Real auth enforcement can be stricter elsewhere; this route must never leak param validation to unauth callers.
 */
function requireAuth(req: NextRequest): NextResponse | null {
  const auth = (req.headers.get("authorization") || "").trim();
  const hasBearer = /^bearer\s+\S+/i.test(auth);
  const hasXUser = (req.headers.get("x-user-id") || "").trim().length > 0;
  if (!hasBearer && !hasXUser) return json({ ok: false, error: "unauthorized" }, 401);
  return null;
}

export async function GET(req: NextRequest) {
  const denied = requireAuth(req);
  if (denied) return denied;

  try {
    const url = new URL(req.url);
    const email = (url.searchParams.get("email") || "").trim();
    if (!email) return json({ ok: false, error: "missing email" }, 400);

    // Minimal safe response for launch gating; integration can replace with real invite lookup.
    return json({ ok: true, email }, 200);
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return json({ ok: false, error: msg }, 500);
  }
}

export async function POST(req: NextRequest) {
  const denied = requireAuth(req);
  if (denied) return denied;

  try {
    const body = await req.json().catch(() => ({}));
    const email = (typeof body?.email === "string" ? body.email : "").trim();
    if (!email) return json({ ok: false, error: "missing email" }, 400);

    // Minimal safe response for launch gating; integration can replace with real invite issuance.
    return json({ ok: true, email }, 200);
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return json({ ok: false, error: msg }, 500);
  }
}
