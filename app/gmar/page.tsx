"use client";
import Link from "next/link";
const games=["runner","flappy","shooter","builder","tower","rogue","brawler","craft","tactics","survival","moba","racing","platformer","puzzle","rhythm"];
export default function GmarIndex(){
  return (
    <div style={{padding:16,color:"#e5e7eb",background:"#020617",minHeight:"100vh"}}>
      <h1 style={{fontSize:24,fontWeight:800,marginBottom:12}}>GMAR</h1>
      <div style={{display:"grid",gap:8}}>
        {games.map(id=>(
          <Link key={id} href={`/gmar/play/${id}`} style={{color:"#93c5fd",textDecoration:"underline"}}>
            ▶️ Play {id}
          </Link>
        ))}
      </div>
    </div>
  );
}
