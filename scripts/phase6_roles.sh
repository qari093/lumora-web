#!/usr/bin/env bash
set -euo pipefail

# 1) Dirs
mkdir -p "src/lib/auth"
mkdir -p "src/app/(dash)/"{admin,moderator,creator,advertiser,user}
mkdir -p "src/app/auth/login"

# 2) Role helper
cat > src/lib/auth/role.ts <<'TS'
export type Role = "admin" | "creator" | "moderator" | "advertiser" | "user" | "guest";
export const ALL_ROLES: Role[] = ["admin","creator","moderator","advertiser","user","guest"];
const RANK: Record<Role, number> = { admin:5, moderator:4, creator:3, advertiser:2, user:1, guest:0 };
export function canAccess(min: Role, actual: Role): boolean { return (RANK[actual] ?? 0) >= (RANK[min] ?? 0); }
TS

# 3) Session util
cat > src/lib/auth/session.ts <<'TS'
import { cookies } from "next/headers";
import type { Role } from "./role";
export type User = { id: string; name: string; role: Role };
export async function getUser(): Promise<User | null> {
  const jar = await cookies();
  const role = (jar.get("role")?.value as Role) || "guest";
  const name = jar.get("name")?.value || "Guest";
  const id = jar.get("uid")?.value || "0";
  return { id, name, role };
}
TS

# 4) Middleware (overwrite to ensure matcher)
cat > middleware.ts <<'TS'
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const routeMinRole: { prefix: string; min: string }[] = [
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
  const url = req.nextUrl.clone();
  url.pathname = "/auth/login";
  url.searchParams.set("redirect", pathname);
  return NextResponse.redirect(url);
}
export const config = { matcher: ["/dash/:path*"] };
TS

# 5) Dashboards
for r in admin moderator creator advertiser user; do
  cat > "src/app/(dash)/$r/page.tsx" <<TSX
import { getUser } from "@/lib/auth/session";
export default async function ${r^}Dash(){
  const u = await getUser();
  return (
    <div style={{padding:24}}>
      <h1>${r^} Dashboard</h1>
      <p>Welcome, {u?.name} (role: {u?.role})</p>
    </div>
  );
}
TSX
done

# 6) Login page (dev mock)
cat > src/app/auth/login/page.tsx <<'TSX'
"use client";
import React from "react";
const ROLES = ["admin","moderator","creator","advertiser","user","guest"] as const;
export default function LoginPage(){
  const [redirect, setRedirect] = React.useState<string>("");
  React.useEffect(()=>{
    const params = new URLSearchParams(window.location.search);
    setRedirect(params.get("redirect") || "/");
  },[]);
  function setRole(role: string){
    document.cookie = `role=${role}; path=/; max-age=2592000; samesite=lax`;
    document.cookie = `name=${role.toUpperCase()}_USER; path=/; max-age=2592000; samesite=lax`;
    document.cookie = `uid=${Math.random().toString(36).slice(2)}; path=/; max-age=2592000; samesite=lax`;
    window.location.href = redirect || "/";
  }
  return (
    <div style={{maxWidth:540, margin:"60px auto", padding:20, fontFamily:"ui-sans-serif,system-ui"}}>
      <h1 style={{fontSize:28, marginBottom:8}}>Sign in (Dev Mock)</h1>
      <p style={{opacity:.8, marginBottom:16}}>Choose a role to continue.</p>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:10}}>
        {ROLES.map(r=>(
          <button key={r} onClick={()=>setRole(r)}
            style={{padding:"10px 12px", border:"1px solid #333", borderRadius:10, cursor:"pointer"}}>
            {r}
          </button>
        ))}
      </div>
      <p style={{marginTop:16, fontSize:12, opacity:.7}}>Redirect: {redirect || "/"}</p>
    </div>
  );
}
TSX

# 7) tsconfig alias ensure (@/* -> src/*)
if [ -f tsconfig.json ]; then
  node - <<'NODE'
const fs = require("fs");
const p = "tsconfig.json";
const j = JSON.parse(fs.readFileSync(p,"utf8"));
j.compilerOptions ??= {};
j.compilerOptions.baseUrl ??= ".";
j.compilerOptions.paths ??= {};
delete j.compilerOptions.paths["*@/*"];
j.compilerOptions.paths["@/*"] = ["src/*"];
fs.writeFileSync(p, JSON.stringify(j,null,2));
console.log("tsconfig updated");
NODE
fi

# 8) Commit and restart
git add -A
git commit -m "Phase 6: roles scaffold with dashboards, login, middleware" >/dev/null 2>&1 || true
pkill -f "next dev" >/dev/null 2>&1 || true
PORT=${PORT:-3000} npx next dev >/tmp/next-dev.out 2>&1 & disown
sleep 6
echo "➡ Login:       http://localhost:${PORT:-3000}/auth/login"
echo "➡ Admin:       http://localhost:${PORT:-3000}/dash/admin"
echo "➡ Moderator:   http://localhost:${PORT:-3000}/dash/moderator"
echo "➡ Creator:     http://localhost:${PORT:-3000}/dash/creator"
echo "➡ Advertiser:  http://localhost:${PORT:-3000}/dash/advertiser"
echo "➡ User:        http://localhost:${PORT:-3000}/dash/user"
