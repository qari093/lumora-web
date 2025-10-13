import { NextResponse } from "next/server";

const VALID = new Set(["admin","moderator","creator","advertiser","user","guest"]);

export async function POST(req: Request) {
  let body: any = {};
  try { body = await req.json(); } catch {}

  const role =
    typeof body.role === "string" && VALID.has(body.role) ? body.role : "guest";

  const name =
    typeof body.name === "string" && body.name.trim()
      ? body.name.trim()
      : role.toUpperCase() + "_USER";

  const uid =
    typeof body.uid === "string" && body.uid.trim()
      ? body.uid.trim()
      : Math.random().toString(36).slice(2);

  const res = NextResponse.json({ ok: true, role, name, uid });

  // 30 days
  const maxAge = 60 * 60 * 24 * 30;

  // Set cookies (HTTP header strings — NOT shell!)
  res.headers.append("set-cookie", `role=${role}; Path=/; Max-Age=${maxAge}; SameSite=Lax`);
  res.headers.append("set-cookie", `name=${encodeURIComponent(name)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`);
  res.headers.append("set-cookie", `uid=${uid}; Path=/; Max-Age=${maxAge}; SameSite=Lax`);

  return res;
}
