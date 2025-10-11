import { NextRequest, NextResponse } from "next/server";

/**
 * RBAC via cookie "role"
 *  - /dash/admin -> admin only
 *  - /dash/mod   -> mod or admin
 *  - /dash/*     -> any logged-in user (user|mod|admin)
 * If unauthorized: redirect to /login?next=<original>
 */
type Role = "guest" | "user" | "mod" | "admin";

const roleRank: Record<Role, number> = {
  guest: 0,
  user: 1,
  mod: 2,
  admin: 3,
};

function needFor(pathname: string): Role | null {
  if (pathname.startsWith("/dash/admin")) return "admin";
  if (pathname.startsWith("/dash/mod"))   return "mod";
  if (pathname.startsWith("/dash"))       return "user";
  return null;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const need = needFor(pathname);
  if (!need) return NextResponse.next();

  // Normalize cookie (defensive: lowercase + fallback)
  const raw = req.cookies.get("role")?.value ?? "guest";
  const cookieRole = (typeof raw === "string" ? raw.toLowerCase() : "guest") as Role;
  const have: Role = (["guest","user","mod","admin"].includes(cookieRole) ? cookieRole : "guest") as Role;

  const ok = roleRank[have] >= roleRank[need];
  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname + (search || ""))}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dash/:path*"] };
