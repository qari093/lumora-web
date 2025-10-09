"use client";
import Link from "next/link";
export default function PulseHome(){
  return (
    <section>
      <h1 style={{fontSize:28,fontWeight:800,marginBottom:8}}>Welcome to NEXA Pulse</h1>
      <p style={{opacity:.8,maxWidth:720,marginBottom:16}}>Premium music portal inside Lumora with an auto-updating library.</p>
      <div style={{display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))"}}>
        <Card title="Explore" href="/pulse/explore" desc="Browse categories, search, and play instantly."/>
        <Card title="Playlists" href="/pulse/playlists" desc="Create and manage playlists (coming)."/>
        <Card title="Upload" href="/pulse/upload" desc="Add your own tracks (Supabase wiring next)."/>
      </div>
    </section>
  );
}
function Card({title,href,desc}:{title:string;href:string;desc:string}){
  return (
    <Link href={href} style={{display:"block",background:"#18181b",border:"1px solid #27272a",padding:16,borderRadius:12}}>
      <div style={{fontWeight:700,marginBottom:6}}>{title}</div>
      <div style={{opacity:.8,fontSize:14}}>{desc}</div>
    </Link>
  );
}
