import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = { email?: string; token?: string; tok?: string };

function norm(s: unknown): string {
  return String(s ?? "").trim();
}

function normalizeEmail(s: unknown): string {
  return norm(s).toLowerCase();
}

function splitAllowlist(raw: string): string[] {
  // Supports: comma, whitespace, newline, semicolon. Supports quoted values.
  const cleaned = raw
    .replace(/[\r\n]+/g, ",")
    .replace(/[;\t ]+/g, ",")
    .replace(/^export\s+/i, "")
    .replace(/^["']|["']$/g, "")
    .trim();
  return cleaned
    .split(",")
    .map((x) => x.trim().replace(/^["']|["']$/g, "").toLowerCase())
    .filter(Boolean);
}

function getEnvAny(keys: string[]): string {
  for (const k of keys) {
    const v = process.env[k];
    if (v && String(v).trim().length) return String(v).trim();
  }
  return "";
}

function safeJson(status: number, body: any): NextResponse {
  return NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });
}

function verifyAccess(email: string, token: string) {
  const allowRaw = getEnvAny([
    "LUMORA_PRIVATE_ALLOWLIST",
    "LUMORA_ALLOWLIST",
    "LUMORA_PRIVATE_ACCESS_ALLOWLIST",
  ]);
  const tokEnv = getEnvAny([
    "LUMORA_PRIVATE_TOKEN",
    "LUMORA_PRIVATE_ACCESS_TOKEN",
    "LUMORA_TOKEN",
  ]);

  if (!allowRaw) return { ok: false as const, error: "missing_allowlist" };
  if (!tokEnv) return { ok: false as const, error: "missing_token" };

  const allow = splitAllowlist(allowRaw);
  const okEmail = allow.includes(email);
  const okTok = token.length > 0 && token === tokEnv;

  if (!okEmail) return { ok: false as const, error: "email not allowlisted" };
  if (!okTok) return { ok: false as const, error: "bad token" };
  return { ok: true as const };
}

function setEmailCookie(res: NextResponse, email: string) {
  // Cookie must be valid for "/" so middleware can read it.
  const secure = (process.env.NODE_ENV || "").toLowerCase() === "production";
  res.cookies.set({
    name: "lumora_email",
    value: email,
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30d
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Payload;
    const email = normalizeEmail(body.email);
    const token = norm(body.token || body.tok);

    if (!email) return safeJson(400, { ok: false, error: "missing email" });
    if (!token) return safeJson(400, { ok: false, error: "missing token" });

    const v = verifyAccess(email, token);
    if (!v.ok) return safeJson(403, { ok: false, error: v.error });

    const res = safeJson(200, { ok: true, email });
    setEmailCookie(res, email);
    return res;
  } catch (e: any) {
    return safeJson(500, { ok: false, error: "internal", detail: String(e?.message || e) });
  }
}

export async function GET(req: NextRequest) {
  try {
    const u = new URL(req.url);
    const email = normalizeEmail(u.searchParams.get("email"));
    const token = norm(u.searchParams.get("token") || u.searchParams.get("tok"));

    if (!email) return safeJson(400, { ok: false, error: "missing email" });
    if (!token) return safeJson(400, { ok: false, error: "missing token" });

    const v = verifyAccess(email, token);
    if (!v.ok) return safeJson(403, { ok: false, error: v.error });

    const res = safeJson(200, { ok: true, email });
    setEmailCookie(res, email);
    return res;
  } catch (e: any) {
    return safeJson(500, { ok: false, error: "internal", detail: String(e?.message || e) });
  }
}
