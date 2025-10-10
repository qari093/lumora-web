#!/usr/bin/env bash
set -euo pipefail

# 1) Ensure dirs (zsh-safe, no brace/paren expansion)
mkdir -p "src/lib/auth"
mkdir -p "src/app/auth/login"

# 2) Fix tsconfig alias (@/* → src/*) and remove any stray '*@/*'
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

# 3) Ensure login page exists (idempotent)
if [ ! -f src/app/auth/login/page.tsx ]; then
  mkdir -p src/app/auth/login
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
fi

# 4) Commit (no-op if nothing changed)
git add -A
git commit -m "Phase 6: safe fix script, tsconfig alias ensure, login page ensure" >/dev/null 2>&1 || true

# 5) Restart Next dev
pkill -f "next dev" >/dev/null 2>&1 || true
PORT=${PORT:-3000} npx next dev >/tmp/next-dev.out 2>&1 & disown
sleep 6

echo "➡ Login:       http://localhost:${PORT:-3000}/auth/login"
echo "➡ Admin:       http://localhost:${PORT:-3000}/dash/admin"
echo "➡ Moderator:   http://localhost:${PORT:-3000}/dash/moderator"
echo "➡ Creator:     http://localhost:${PORT:-3000}/dash/creator"
echo "➡ Advertiser:  http://localhost:${PORT:-3000}/dash/advertiser"
echo "➡ User:        http://localhost:${PORT:-3000}/dash/user"
