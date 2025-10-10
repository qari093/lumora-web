import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
const routeMinRole = [
  { prefix: "/dash/admin",      min: "admin" },
  { prefix: "/dash/moderator",  min: "moderator" },
  { prefix: "/dash/creator",    min: "creator" },
  { prefix: "/dash/advertiser", min: "advertiser" },
  { prefix: "/dash/user",       min: "user" },
];
const RANK: Record<string, number> = { admin:5, moderator:4, creator:3, advertiser:2, user:1, guest:0 };
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const rule = routeMinRole.find(r => pathname.startsWith(r.prefix));
  if (!rule) return NextResponse.next();
  const role = req.cookies.get("role")?.value || "guest";
  if ((RANK[role] ?? 0) >= (RANK[rule.min] ?? 0)) return NextResponse.next();
  const url = req.nextUrl.clone(); url.pathname = "/auth/login"; url.searchParams.set("redirect", pathname);
  return NextResponse.redirect(url);
}
export const config = { matcher: ["/dash/:path*"] };
