"use client";
import Link from "next/link";
import React from "react";
export default function Sidebar(){
  const links = [
    {href:"/dash/admin",label:"Admin"},
    {href:"/dash/moderator",label:"Moderator"},
    {href:"/dash/creator",label:"Creator"},
    {href:"/dash/advertiser",label:"Advertiser"},
    {href:"/dash/user",label:"User"},
  ];
  return (
    <aside style={{
      width:220,background:"#0f172a",color:"#e5e7eb",display:"flex",
      flexDirection:"column",padding:"16px",borderRight:"1px solid #1e293b"
    }}>
      <h2 style={{fontSize:18,fontWeight:700,marginBottom:16}}>⚡ Lumora</h2>
      {links.map(l=>(
        <Link key={l.href} href={l.href}
          style={{padding:"8px 10px",borderRadius:6,marginBottom:6,display:"block",
          textDecoration:"none",color:"#e5e7eb",background:"transparent"}}
          onMouseOver={e=>e.currentTarget.style.background="#1e293b"}
          onMouseOut={e=>e.currentTarget.style.background="transparent"}>
          {l.label}
        </Link>
      ))}
    </aside>
  );
}
"TSX"

# 2️⃣ TopBar
cat > src/components/TopBar.tsx <<TSX
"use client";
import React from "react";
export default function TopBar(){
  return (
    <header style={{
      display:"flex",alignItems:"center",justifyContent:"space-between",
      padding:"10px 16px",borderBottom:"1px solid #1e293b",background:"#0f172a"
    }}>
      <h3 style={{margin:0,fontSize:16,fontWeight:600}}>Dashboard</h3>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>document.body.classList.toggle("light")}
          style={{padding:"6px 10px",border:"1px solid #333",borderRadius:6,
          background:"#111827",color:"#e5e7eb",cursor:"pointer"}}>
          🌓 Theme
        </button>
      </div>
    </header>
  );
}
"TSX"

# 3️⃣ Animated RoleBar
cat > src/components/RoleBar.tsx <<TSX
"use client";
import React from "react";
import { motion } from "framer-motion";

export default function RoleBar(){
  const [role,setRole] = React.useState("guest");
  React.useEffect(()=>{
    const cookies = Object.fromEntries(document.cookie.split("; ").map(x=>x.split("=")));
    setRole(cookies.role||"guest");
  },[]);

  async function change(r:string){
    await fetch("/api/auth/set-role",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({role:r})});
    location.reload();
  }

  const roles=["admin","moderator","creator","advertiser","user","guest"];
  return (
    <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}
      style={{display:"flex",gap:6,padding:"6px 12px",borderBottom:"1px solid #1e293b",background:"#0f172a"}}>
      <strong style={{marginRight:12}}>Role: {role}</strong>
      {roles.map(r=>(
        <button key={r} onClick={()=>change(r)}
          style={{
            padding:"6px 10px",border:"1px solid #333",borderRadius:6,
            background: r===role? "linear-gradient(90deg,#22c55e,#16a34a)" : "#111827",
            color: r===role? "#000" : "#e5e7eb",cursor:"pointer"
          }}>{r}</button>
      ))}
      <button onClick={async()=>{await fetch("/api/auth/logout",{method:"POST"});location.href="/";}}
        style={{marginLeft:"auto",padding:"6px 10px",border:"1px solid #933",
        borderRadius:6,background:"#1a0f0f",color:"#ffe5e5",cursor:"pointer"}}>
        Logout
      </button>
    </motion.div>
  );
}
"TSX"

# 4️⃣ Widgets (placeholders)
cat > src/app/dash/widgets/AdminWidgets.tsx <<TSX
"use client";
import React from "react";
export default function AdminWidgets(){
  return (
    <div style={{display:"grid",gap:12,gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))"}}>
      <div style={{padding:16,border:"1px solid #1e293b",borderRadius:8,background:"#111827"}}>🧠 System Health</div>
      <div style={{padding:16,border:"1px solid #1e293b",borderRadius:8,background:"#111827"}}>👥 Active Users</div>
      <div style={{padding:16,border:"1px solid #1e293b",borderRadius:8,background:"#111827"}}>💼 Pending Ads</div>
    </div>
  );
}
"TSX"

# 5️⃣ Updated /dash/layout.tsx with Sidebar + TopBar + RoleBar
cat > src/app/dash/layout.tsx <<TSX
import React from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import RoleBar from "@/components/RoleBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{margin:0,display:"flex",background:"#0b0f12",color:"#e5e7eb",fontFamily:"Inter,system-ui"}}>
        <Sidebar />
        <div style={{flex:1,display:"flex",flexDirection:"column",minHeight:"100vh"}}>
          <TopBar />
          <RoleBar />
          <main style={{flex:1,padding:24}}>{children}</main>
        </div>
      </body>
    </html>
  );
}
"TSX"

# 6️⃣ Install framer-motion if missing
npm pkg get dependencies.framer-motion | grep -q framer-motion || npm install framer-motion --save

# 7️⃣ Restart Next.js
pkill -f "next dev" >/dev/null 2>&1 || true
PORT=3000
nohup npx next dev > /tmp/next-dev.out 2>&1 & disown
sleep 6

echo "✅ Dashboard Experience Upgrade (Phase 6.5) applied!"
echo "➡  Visit:  http://localhost:3000/dash/admin"
