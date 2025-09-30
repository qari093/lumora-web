"use client";
import React,{useEffect,useState} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePulsePlayer } from "../../_player/PlayerDock";

type PlTrack = { playlist_id:string; track_id:string; title:string; artist:string; url:string; added_at:string };

export default function PlaylistDetail(){
  const { playNow, enqueue } = usePulsePlayer();
  const pathname = usePathname();
  const id = pathname.split("/").pop() || "";
  const [name,setName]=useState<string>("");
  const [tracks,setTracks]=useState<PlTrack[]>([]);
  const [loading,setLoading]=useState(true);

  async function load(){
    setLoading(true);
    // fetch playlist name from list (simple approach)
    try{
      const pls = await (await fetch("/api/playlists",{cache:"no-store"})).json();
      const me = (pls||[]).find((p:any)=>p.id===id);
      setName(me?.name || "Playlist");
    }catch{}
    try{
      const r = await fetch(`/api/playlists/${id}/tracks`,{cache:"no-store"});
      const j = await r.json();
      setTracks(Array.isArray(j)?j:[]);
    }catch{}
    setLoading(false);
  }
  useEffect(()=>{ load(); },[id]);

  async function remove(trackId:string){
    await fetch("/api/playlist-tracks",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({playlistId:id, trackId})});
    setTracks(ts=>ts.filter(t=>t.track_id!==trackId));
  }

  return (
    <section>
      <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between"}}>
        <h1 style={{fontSize:24,fontWeight:800,marginBottom:12}}>{name}</h1>
        <Link href="/pulse/playlists" style={{fontSize:14,opacity:.85}}>← Back</Link>
      </div>
      {loading ? <div>Loading…</div> :
      tracks.length===0 ? <div style={{opacity:.75}}>No tracks yet. Add from <Link href="/pulse/explore">Explore</Link>.</div> :
      <div style={{display:"grid",gap:10}}>
        {tracks.map((t)=>(
          <div key={t.track_id} style={{background:"#18181b",padding:12,borderRadius:8,display:"grid",gap:6}}>
            <div style={{display:"flex",justifyContent:"space-between",gap:10}}>
              <div style={{overflow:"hidden"}}>
                <div style={{fontWeight:600,whiteSpace:"nowrap",textOverflow:"ellipsis",overflow:"hidden"}}>{t.title}</div>
                <div style={{opacity:.75,fontSize:13}}>{t.artist}</div>
              </div>
              <div style={{display:"flex",gap:8,flexShrink:0}}>
                <button onClick={()=>playNow({id:t.track_id,title:t.title,artist:t.artist,url:t.url})}
                        style={{background:"#4f46e5",color:"#fff",padding:"6px 10px",borderRadius:6}}>Play</button>
                <button onClick={()=>enqueue({id:t.track_id,title:t.title,artist:t.artist,url:t.url})}
                        style={{background:"#3f3f46",color:"#fff",padding:"6px 10px",borderRadius:6}}>Queue</button>
                <button onClick={()=>remove(t.track_id)}
                        style={{background:"#ef4444",color:"#fff",padding:"6px 10px",borderRadius:6}}>Remove</button>
              </div>
            </div>
            <audio src={t.url} preload="none" controls style={{width:"100%"}}/>
          </div>
        ))}
      </div>}
    </section>
  );
}
