"use client";
import React from "react";

const ROLES = ["admin","moderator","creator","advertiser","user","guest"] as const;

export default function LoginPage(){
  const [redirect, setRedirect] = React.useState<string>("/");
  React.useEffect(()=>{
    const p = new URLSearchParams(window.location.search);
    setRedirect(p.get("redirect") || "/");
  },[]);

  async function setRole(role: string){
    await fetch("/api/auth/set-role", {
      method: "POST",
      headers: {"content-type":"application/json"},
      body: JSON.stringify({ role, name: role.toUpperCase() + "_USER" })
    });
    window.location.href = redirect || "/";
  }

  async function logout(){
    await fetch("/api/auth/logout", { method:"POST" });
    window.location.href = "/";
  }

  return (
    <div style={{maxWidth:560,margin:"64px auto",padding:24,fontFamily:"ui-sans-serif,system-ui"}}>
      <h1 style={{fontSize:28,margin:0,marginBottom:8}}>Sign in (Dev)</h1>
      <p style={{opacity:.8,marginTop:0,marginBottom:16}}>Choose a role to continue. Redirect: {redirect}</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
        {ROLES.map(r=>(
          <button key={r} onClick={()=>setRole(r)}
            style={{padding:"10px 12px",border:"1px solid #333",borderRadius:10,cursor:"pointer",background:"#0b0f12",color:"#e5e7eb"}}>
            {r}
          </button>
        ))}
      </div>
      <div style={{marginTop:16}}>
        <button onClick={logout}
          style={{padding:"8px 10px",border:"1px solid #933",borderRadius:8,background:"#1a0f0f",color:"#ffe5e5",cursor:"pointer"}}>
          Logout
        </button>
      </div>
    </div>
  );
}
"TSX"

# minimal home page with links (if missing)
if [ ! -f src/app/page.tsx ]; then
  mkdir -p src/app
  cat > src/app/page.tsx <<TSX
import Link from "next/link";
export default function Home(){
  return (
    <div style={{padding:24}}>
      <h1>Lumora — Phase 6</h1>
      <ul style={{lineHeight:1.9}}>
        <li><Link href="/auth/login">/auth/login</Link></li>
        <li><Link href="/dash/admin">/dash/admin</Link></li>
        <li><Link href="/dash/moderator">/dash/moderator</Link></li>
        <li><Link href="/dash/creator">/dash/creator</Link></li>
        <li><Link href="/dash/advertiser">/dash/advertiser</Link></li>
        <li><Link href="/dash/user">/dash/user</Link></li>
      </ul>
    </div>
  );
}
"TSX"
fi

# restart next + show links
pkill -f "next dev" >/dev/null 2>&1 || true
PORT=3000
nohup npx next dev > /tmp/next-dev.out 2>&1 & disown
sleep 6
echo "Login -> http://localhost:3000/auth/login"
echo "Dash  -> http://localhost:3000/dash"
echo "Admin -> http://localhost:3000/dash/admin"
