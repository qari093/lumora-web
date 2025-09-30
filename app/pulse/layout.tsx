import React from "react";
import Link from "next/link";
import PlayerDock from "./_player/PlayerDock";
export const metadata = { title: "NEXA Pulse", description: "Music & Social by NEXA" };
export default function PulseLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="en">
      <body style={{margin:0,background:"#0a0a0a",color:"#e5e7eb",fontFamily:"ui-sans-serif,system-ui"}}>
        <header style={{borderBottom:"1px solid #27272a",background:"#0f0f12",position:"sticky",top:0,zIndex:50}}>
          <div style={{maxWidth:1100,margin:"0 auto",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontWeight:800,fontSize:18,letterSpacing:0.5,color:"#8b5cf6"}}>NEXA Pulse</div>
              <nav style={{display:"flex",gap:14,fontSize:14}}>
                <Link href="/pulse">Home</Link>
                <Link href="/pulse/explore">Explore</Link>
                <Link href="/pulse/playlists">Playlists</Link>
                <Link href="/pulse/upload">Upload</Link>
              
              <a href="/pulse/account" style={{opacity:.95}}>Account</a>
            
              <a href="/pulse/explore" style={{opacity:.95}}>Explore</a>
              <a href="/pulse/trending" style={{opacity:.95}}>Trending</a>
              <a href="/pulse/charts" style={{opacity:.95}}>Charts</a>
              <a href="/pulse/upload" style={{opacity:.95}}>Upload</a>
            </nav>
            </div>
            <div style={{fontSize:13,opacity:.85}}>
              <Link href="/arena">NEXA Live TV</Link>
            </div>
          </div>
        
        {/* PULSE_LOCAL_MODE_BANNER */}
        {process.env.PULSE_LOCAL_MODE===1 && (
          <div style={{background:"#fde68a",color:"#111827",padding:"6px 12px",fontSize:12,textAlign:"center"}}>
            Local Mode active — saving to data/playlists.json (no Supabase). Turn off by setting PULSE_LOCAL_MODE=0.
          </div>
        )}
      </header>
        <PlayerDock>
          <main style={{maxWidth:1100,margin:"0 auto",padding:"16px",paddingBottom:72}}>{children}</main>
        </PlayerDock>
      </body>
    </html>
  );
}
